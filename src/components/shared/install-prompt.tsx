"use client";
import { useEffect,useState } from "react";import { Download } from "lucide-react";import { Button } from "@/components/ui/button";
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
export function InstallPrompt(){const [event,setEvent]=useState<InstallEvent|null>(null);useEffect(()=>{const capture=(value:Event)=>{value.preventDefault();setEvent(value as InstallEvent)};addEventListener("beforeinstallprompt",capture);return()=>removeEventListener("beforeinstallprompt",capture)},[]);if(!event)return null;return <Button variant="secondary" onClick={async()=>{await event.prompt();await event.userChoice;setEvent(null)}}><Download size={17}/>Install app</Button>}
