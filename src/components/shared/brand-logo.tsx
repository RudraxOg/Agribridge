import Image from "next/image";

export function BrandLogo({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return <Image src="/icons/agribridge_logo_full.png" alt="AgriBridge" width={4000} height={1440} priority className={`h-auto w-auto object-contain ${onDark ? "rounded-xl bg-white px-2 py-1" : ""} ${className}`} />;
}
