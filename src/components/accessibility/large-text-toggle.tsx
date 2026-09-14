"use client";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LargeTextToggle() {
  function toggle() { const root = document.documentElement; root.style.fontSize = root.style.fontSize === "112.5%" ? "100%" : "112.5%"; }
  return <Button type="button" variant="ghost" size="icon" aria-label="Toggle larger text" onClick={toggle}><Type aria-hidden size={20} /></Button>;
}
