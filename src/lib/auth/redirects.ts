const controlCharacters = /[\u0000-\u001f\u007f]/;

export function safeRedirectPath(value: string | null | undefined, fallback: string) {
  if (!value || controlCharacters.test(value) || !value.startsWith("/") || value.startsWith("//")) return fallback;
  try {
    const parsed = new URL(value, "http://agribridge.local");
    if (parsed.origin !== "http://agribridge.local") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function configuredAuthOrigin() {
  const fallback="http://localhost:3000";
  const candidate=process.env.NEXT_PUBLIC_APP_URL??fallback;
  const allowed=(process.env.AUTH_ALLOWED_REDIRECT_ORIGINS??"http://localhost:3000,http://127.0.0.1:3000").split(",").map((value)=>value.trim()).filter(Boolean);
  try{const origin=new URL(candidate).origin;return allowed.includes(origin)?origin:fallback}catch{return fallback}
}
