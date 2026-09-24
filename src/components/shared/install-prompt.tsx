"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt({ fallbackHref }: { fallbackHref: string }) {
  const [event, setEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    const capture = (value: Event) => {
      value.preventDefault();
      setEvent(value as InstallEvent);
    };
    const markInstalled = () => {
      setEvent(null);
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  if (!event) {
    return (
      <a href={fallbackHref} className={buttonVariants({ variant: "secondary" })}>
        <Download aria-hidden size={17} />
        Install Web App
      </a>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await event.prompt();
        await event.userChoice;
        setEvent(null);
      }}
    >
      <Download aria-hidden size={17} />
      Install Web App
    </Button>
  );
}
