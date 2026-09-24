"use client";
import { PlayCircle } from "lucide-react";
import { useGuidedDemo } from "../hooks/useGuidedDemo";
import { Button } from "@/components/ui/button";
export function DemoRestartDialog(){const {restart,loading}=useGuidedDemo();return <Button variant="secondary" disabled={loading} onClick={()=>void restart()}><PlayCircle aria-hidden/>Restart guided demo</Button>}
