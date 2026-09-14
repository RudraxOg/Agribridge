import { openDB } from "idb";

type DraftKind="farmer"|"stock";
type DraftRecord<T=unknown>={id:string;kind:DraftKind;payload:T;updatedAt:string;syncState:"local"|"syncing"|"failed"};
const database=()=>openDB("agribridge-offline",1,{upgrade(db){if(!db.objectStoreNames.contains("drafts"))db.createObjectStore("drafts",{keyPath:"id"});if(!db.objectStoreNames.contains("uploads"))db.createObjectStore("uploads",{keyPath:"id"})}});

export async function saveDraft<T>(id:string,kind:DraftKind,payload:T){const record:DraftRecord<T>={id,kind,payload,updatedAt:new Date().toISOString(),syncState:"local"};await (await database()).put("drafts",record);return record}
export async function loadDraft<T>(id:string){return (await (await database()).get("drafts",id) as DraftRecord<T>|undefined)?.payload}
export async function removeDraft(id:string){await (await database()).delete("drafts",id)}
export async function queueUpload(input:{id:string;draftId:string;blob:Blob;mimeType:string}){await (await database()).put("uploads",{...input,attempts:0,nextAttemptAt:new Date().toISOString()})}
export async function compressImage(file:File,maxWidth=1600,quality=.78):Promise<Blob>{const bitmap=await createImageBitmap(file);const scale=Math.min(1,maxWidth/bitmap.width);const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext("2d")?.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Image compression failed")),"image/webp",quality))}
