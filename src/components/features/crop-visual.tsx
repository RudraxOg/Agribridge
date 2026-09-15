import Image from "next/image";

const cropFor = (code: string) => {
  const value = code.toLowerCase();
  if (value.includes("onion")) return "onion";
  if (value.includes("tomato")) return "tomato";
  if (value.includes("paddy") || value.includes("rice")) return "paddy";
  if (value.includes("pea")) return "peas";
  if (value.includes("mango")) return "mango";
  return "potato";
};

export function CropVisual({ code, colour, compact = false }: { code: string; colour: string; compact?: boolean }) {
  const crop = cropFor(code);
  return <div className={`grain relative overflow-hidden bg-[var(--forest)] ${compact ? "h-36" : "h-56"}`}>
    <Image src={`/generated/processed/${crop}-cover-card-640.webp`} alt={`Synthetic demo ${crop} crate used for marketplace illustration`} fill sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 1024px) 100vw, 50vw"} className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/90 via-transparent to-transparent" />
    <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-[var(--forest-deep)]/75 px-3 py-1 text-[11px] font-black tracking-wide text-white">SYNTHETIC DEMO</div>
    <div className="absolute bottom-4 left-4"><span className="text-xs font-black tracking-[.22em] text-white/80">HARVEST LOT</span><p className="mt-1 text-2xl font-black text-white" style={{ textShadow: `0 3px 20px ${colour}` }}>{code}</p></div>
  </div>;
}
