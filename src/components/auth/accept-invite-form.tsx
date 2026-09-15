"use client";
import { useActionState } from "react";
import { acceptInviteAction } from "@/features/auth/invite-actions";
import { initialAuthState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
export function AcceptInviteForm({locale,token}:{locale:string;token?:string}){const[state,action,pending]=useActionState(acceptInviteAction,initialAuthState);return <form action={action} className="grid gap-4"><input type="hidden" name="locale" value={locale}/><input type="hidden" name="token" value={token??""}/>{state.status!=="idle"&&<p role={state.status==="error"?"alert":"status"} className={`rounded-xl p-3 text-sm ${state.status==="error"?"bg-red-50 text-red-900":"bg-green-50 text-green-900"}`}>{state.message}</p>}<Button disabled={pending||!token}>{pending?"Checking invitation…":"Accept organization invitation"}</Button></form>}
