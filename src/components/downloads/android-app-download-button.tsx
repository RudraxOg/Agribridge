"use client";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AndroidDownloadDialog } from "./android-download-dialog";
export function AndroidAppDownloadButton({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="primary"
        size={iconOnly ? "icon" : "default"}
        aria-label="Install AgriBridge Android app"
        onClick={() => setOpen(true)}
      >
        <Download aria-hidden size={18} />
        {iconOnly ? null : "Install Android"}
      </Button>
      <AndroidDownloadDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
