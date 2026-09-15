"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/form-controls";

export function PasswordInput({ name, autoComplete = "current-password", minLength }: { name: string; autoComplete?: string; minLength?: number }) {
  const [visible,setVisible]=useState(false);
  return <div className="relative"><Input name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} minLength={minLength} required className="pr-14"/><button type="button" onClick={()=>setVisible((value)=>!value)} className="absolute top-0 right-0 grid size-12 place-items-center rounded-xl text-[var(--text-muted)]" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff aria-hidden size={20}/> : <Eye aria-hidden size={20}/>}</button></div>;
}
