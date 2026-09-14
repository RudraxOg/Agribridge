"use client";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReadAloudButton({ text }: { text: string }) {
  function read() { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(text)); }
  return <Button type="button" variant="ghost" size="icon" aria-label="Read this page aloud" onClick={read}><Volume2 aria-hidden size={20} /></Button>;
}
