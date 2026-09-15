"use client";

import Image from "next/image";
import { useState } from "react";
import { getCropAsset } from "@/lib/media/crop-assets";

export function CropVisual({
  code,
  colour,
  compact = false,
  alt,
  priority = false,
  showDemoLabel = false,
}: {
  code: string;
  colour: string;
  compact?: boolean;
  alt?: string;
  priority?: boolean;
  showDemoLabel?: boolean;
}) {
  const asset = getCropAsset(code);
  const [failedPhotoSrc, setFailedPhotoSrc] = useState<string | null>(null);
  const src = failedPhotoSrc === asset.photoSrc ? asset.generatedFallbackSrc : asset.photoSrc;
  return <div className={`grain relative overflow-hidden bg-[var(--forest)] ${compact ? "h-36" : "h-56"}`}>
    <Image
      src={src}
      alt={alt ?? `AI-generated demo photograph of a ${asset.label} stock lot`}
      fill
      priority={priority}
      quality={78}
      sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 1024px) 100vw, 50vw"}
      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      onError={() => setFailedPhotoSrc(asset.photoSrc)}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/90 via-transparent to-transparent" />
    {showDemoLabel && <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-[var(--forest-deep)]/80 px-3 py-1 text-[11px] font-black tracking-wide text-white backdrop-blur-sm">AI-GENERATED DEMO</div>}
    <div className="absolute bottom-4 left-4"><span className="text-xs font-black tracking-[.22em] text-white/80">HARVEST LOT</span><p className="mt-1 text-2xl font-black text-white" style={{ textShadow: `0 3px 20px ${colour}` }}>{code}</p></div>
  </div>;
}
