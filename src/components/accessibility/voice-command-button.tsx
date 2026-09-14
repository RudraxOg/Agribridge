"use client";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VoiceCommandButton() {
  function start() { toast.info("Voice input is a browser-assisted prototype. Every action is also available on screen."); }
  return <Button type="button" variant="ghost" size="icon" aria-label="Use voice command" onClick={start}><Mic aria-hidden size={20} /></Button>;
}
