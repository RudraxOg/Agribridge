import { createClient } from "npm:@supabase/supabase-js@2";
export const jsonHeaders={"content-type":"application/json","cache-control":"no-store"};
export function userClient(request:Request){const url=Deno.env.get("SUPABASE_URL");const anon=Deno.env.get("SUPABASE_ANON_KEY");if(!url||!anon)throw new Error("Supabase function environment is incomplete");return createClient(url,anon,{global:{headers:{Authorization:request.headers.get("Authorization")??""}},auth:{persistSession:false,autoRefreshToken:false}})}
export function reply(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:jsonHeaders})}
