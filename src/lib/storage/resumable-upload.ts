"use client";
import imageCompression from "browser-image-compression";
import * as tus from "tus-js-client";
import { createClient } from "@/lib/supabase/client";

export const resumableThresholdBytes = 6 * 1024 * 1024;

export async function prepareImage(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/heic" || file.type === "image/heif" || file.size < 1_500_000) return file;
  return imageCompression(file, { maxSizeMB: 4, maxWidthOrHeight: 1600, useWebWorker: true, fileType: "image/webp", preserveExif: false });
}

type DirectUploadInput={file:Blob;filename:string;bucket:"private-stock-originals"|"farmer-documents"|"grading-certificates"|"delivery-proofs"|"dispute-evidence";objectPath:string;mimeType:string;purpose:"listing-original"|"grading-certificate"|"farmer-document"|"delivery-proof"|"dispute-evidence";onProgress:(percent:number)=>void};
async function finalizeUpload(input:DirectUploadInput){const checksum=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",await input.file.arrayBuffer()))).map((byte)=>byte.toString(16).padStart(2,"0")).join("");const response=await fetch("/api/uploads/complete",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({bucket:input.bucket,objectPath:input.objectPath,mimeType:input.mimeType,byteSize:input.file.size,checksumSha256:checksum,originalFilename:input.filename,purpose:input.purpose})});if(!response.ok)throw new Error((await response.json() as{error?:string}).error??"Upload validation could not be queued");return response.json() as Promise<{assetId?:string;processingStatus?:string}>}
export async function uploadDirect(input: DirectUploadInput) {
  const client = createClient();
  if (input.file.size < resumableThresholdBytes) {
    const tokenResponse = await fetch("/api/uploads/token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ bucket: input.bucket, objectPath: input.objectPath, mimeType: input.mimeType, byteSize: input.file.size }) });
    if (!tokenResponse.ok) throw new Error((await tokenResponse.json() as { error?: string }).error ?? "Could not authorize upload");
    const token = await tokenResponse.json() as { token: string; path: string };
    input.onProgress(15);
    const { error } = await client.storage.from(input.bucket).uploadToSignedUrl(token.path, token.token, input.file, { contentType: input.mimeType });
    if (error) throw error;
    input.onProgress(100);
    const finalized=await finalizeUpload(input);
    return { pause: () => undefined, completed:Promise.resolve(finalized) };
  }
  const { data: { session } } = await client.auth.getSession();
  if (!session) throw new Error("Sign in before uploading to configured storage");
  const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`;
  let upload: tus.Upload;
  const completed = new Promise<void>((resolve, reject) => {
    upload = new tus.Upload(input.file, { endpoint, headers: { authorization: `Bearer ${session.access_token}` }, metadata: { bucketName: input.bucket, objectName: input.objectPath, contentType: input.mimeType, cacheControl: "3600", filename: input.filename }, chunkSize: resumableThresholdBytes, retryDelays: [0, 1_000, 3_000, 5_000], removeFingerprintOnSuccess: true, onError: reject, onProgress: (sent, total) => input.onProgress(Math.round(sent / total * 100)), onSuccess: () => {void finalizeUpload(input).then(()=>resolve(),reject)} });
    void upload.findPreviousUploads().then((previous) => { if (previous[0]) upload.resumeFromPreviousUpload(previous[0]); upload.start(); });
  });
  return { pause: () => upload.abort(false), completed };
}
