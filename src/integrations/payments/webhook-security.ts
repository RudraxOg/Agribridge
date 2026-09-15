import { createHash,createHmac,timingSafeEqual } from "node:crypto";
export function verifyWebhookSignature(body:string,signature:string,secret:string){const expected=createHmac("sha256",secret).update(body).digest("hex");const a=Buffer.from(expected);const b=Buffer.from(signature);return a.length===b.length&&timingSafeEqual(a,b)}
export function webhookPayloadHash(body:string){return createHash("sha256").update(body).digest("hex")}
export class WebhookIdempotency{private processed=new Set<string>();claim(id:string){if(this.processed.has(id))return false;this.processed.add(id);return true}}
