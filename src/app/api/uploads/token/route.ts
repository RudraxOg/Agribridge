import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkLocalRateLimit, privacyKey } from "@/lib/security/rate-limit";

const schema = z.object({
  bucket: z.enum(["private-stock-originals", "grading-certificates", "delivery-proofs", "dispute-evidence"]),
  objectPath: z.string().min(10).max(400).regex(/^[a-f0-9-]+\/[a-zA-Z0-9._/-]+$/).refine((value) => !/(aadhaar|phone|bank|cvv|token|secret)/i.test(value), "Path contains a sensitive term"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "video/mp4", "video/webm", "application/pdf"]),
  byteSize: z.number().int().positive().max(80 * 1024 * 1024),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Upload request is invalid" }, { status: 400 });
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (!checkLocalRateLimit("upload-token",privacyKey([user.id]),20,60_000).allowed) return NextResponse.json({error:"Too many upload requests"},{status:429,headers:{"Retry-After":"60"}});
  const segments=parsed.data.objectPath.split("/");
  let allowed=false;
  if(parsed.data.bucket==="delivery-proofs"){
    const[orderId,shipmentId]=segments;
    const{data:shipment}=await client.from("shipments").select("id").eq("id",shipmentId).eq("order_id",orderId).maybeSingle();
    allowed=Boolean(shipment?.id);
  }else{
    const organizationId=segments[0];
    const result=await client.rpc("has_organization_permission",{target_organization_id:organizationId,required_permission:"files.upload"});
    allowed=!result.error&&result.data===true;
  }
  if(!allowed)return NextResponse.json({error:"Upload is outside your organization permission"},{status:403});
  const { data: signed, error } = await client.storage.from(parsed.data.bucket).createSignedUploadUrl(parsed.data.objectPath, { upsert: false });
  if (error) return NextResponse.json({ error: "Could not authorize upload" }, { status: 400 });
  return NextResponse.json({ token: signed.token, path: signed.path },{headers:{"Cache-Control":"no-store"}});
}
