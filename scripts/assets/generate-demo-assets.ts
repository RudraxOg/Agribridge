import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ensureDirectory, readManifest, root, sha256, writeManifest } from "./common";

const seed = "agribridge-demo-v1";
const output = path.join(root, "assets/generated");
const publicOutput = path.join(root, "public/generated");
await Promise.all([ensureDirectory(output), ensureDirectory(publicOutput), ensureDirectory(path.join(publicOutput, "360")), ensureDirectory(path.join(publicOutput, "documents"))]);

const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const svg = (body: string, label: string, width = 1200, height = 800) => `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(label)}" viewBox="0 0 ${width} ${height}"><defs><pattern id="p" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><path d="M0 22h44" stroke="#fff" stroke-opacity=".08" stroke-width="3"/></pattern><filter id="s"><feDropShadow dx="0" dy="16" stdDeviation="14" flood-opacity=".2"/></filter></defs>${body}</svg>`;
const entries = (await readManifest()).filter((entry) => entry.status !== "generated" || entry.sourceProvider === "agribridge-imagegen");

async function emit(relativePath: string, content: string | Uint8Array, kind: string, altEn: string, altHi: string, cropSlug?: string) {
  const destination = path.join(output, relativePath);
  const publicDestination = path.join(publicOutput, relativePath);
  await ensureDirectory(path.dirname(destination));
  await ensureDirectory(path.dirname(publicDestination));
  await writeFile(destination, content);
  await copyFile(destination, publicDestination);
  const bytes = typeof content === "string" ? new TextEncoder().encode(content) : content;
  const slug = relativePath.replace(/\.[^.]+$/, "").replaceAll("/", "-");
  entries.push({ slug, kind, query: `locally generated with ${seed}`, sourceProvider: "agribridge-generator", sourcePageUrl: `https://agribridge.invalid/generated/${slug}`, downloadUrl: `https://agribridge.invalid/generated/${relativePath}`, author: "AgriBridge design system", licenseCode: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", attributionText: "Original synthetic demo artwork generated locally for AgriBridge", allowedUses: ["demo", "listing-seed"], cropSlug, altText: { en: altEn, hi: altHi }, targetVariants: ["card", "detail"], status: "generated", checksumSha256: sha256(bytes) });
}

await emit("brand/mark.svg", svg(`<rect width="800" height="800" rx="180" fill="#176B3A"/><path d="M400 655V330M400 470C270 455 205 365 215 215c135 8 220 82 185 255Zm0-70c130-15 195-105 185-255-135 8-220 82-185 255Z" fill="none" stroke="#EAF5EC" stroke-width="55" stroke-linecap="round" stroke-linejoin="round"/><path d="M235 650h330" stroke="#E1B84B" stroke-width="34" stroke-linecap="round"/>`, "AgriBridge sprout mark", 800, 800), "brand", "AgriBridge sprout mark", "एग्रीब्रिज अंकुर चिह्न");
await emit("brand/wordmark.svg", svg(`<rect width="1600" height="440" rx="72" fill="#FAFCF8"/><g transform="translate(60 30) scale(.47)"><rect width="800" height="800" rx="180" fill="#176B3A"/><path d="M400 655V330M400 470C270 455 205 365 215 215c135 8 220 82 185 255Zm0-70c130-15 195-105 185-255-135 8-220 82-185 255Z" fill="none" stroke="#EAF5EC" stroke-width="55" stroke-linecap="round"/><path d="M235 650h330" stroke="#E1B84B" stroke-width="34" stroke-linecap="round"/></g><text x="500" y="235" fill="#0D3520" font-family="ui-sans-serif,system-ui" font-weight="800" font-size="150">AgriBridge</text><text x="510" y="315" fill="#52665A" font-family="ui-sans-serif,system-ui" font-size="42" letter-spacing="6">HARVEST · TRUST · TRADE</text>`, "AgriBridge wordmark", 1600, 440), "brand", "AgriBridge wordmark with sprout symbol", "अंकुर चिह्न के साथ एग्रीब्रिज शब्द चिह्न");

const illustrations = [
  ["onboarding", "From field to buyer", "खेत से खरीदार तक", "M180 570Q420 270 680 510T1050 390"],
  ["empty", "A clear crate ready for the next lot", "अगली लॉट के लिए तैयार खाली क्रेट", "M180 500Q420 610 660 480T1040 540"],
  ["offline", "Drafts stay safe while the network rests", "नेटवर्क बंद होने पर ड्राफ्ट सुरक्षित रहते हैं", "M150 480Q380 260 600 470T1050 360"],
  ["success", "Trade milestone confirmed", "व्यापार चरण की पुष्टि हुई", "M170 520Q410 300 620 500T1030 320"],
] as const;
for (const [name, en, hi, line] of illustrations) await emit(`illustrations/${name}.svg`, svg(`<rect width="1200" height="800" fill="#EAF5EC"/><rect width="1200" height="800" fill="url(#p)"/><path d="${line}" fill="none" stroke="#176B3A" stroke-width="42" stroke-linecap="round"/><circle cx="600" cy="360" r="118" fill="#E1B84B"/><path d="M600 455V295m0 80c-70-8-105-55-100-135 73 5 119 44 100 135Zm0-36c70-8 105-55 100-135-73 5-119 44-100 135Z" fill="none" stroke="#176B3A" stroke-width="28" stroke-linecap="round"/><text x="600" y="700" text-anchor="middle" fill="#0D3520" font-family="ui-sans-serif,system-ui" font-weight="700" font-size="42">${escapeXml(en)}</text>`, en), "illustration", en, hi);

const crops = [
  ["tomato", "#D94C38", "#A82F24", "Tomato"], ["onion", "#A75458", "#71353C", "Red onion"],
  ["potato", "#D9B36C", "#9D763B", "Potato"], ["paddy", "#C89A3D", "#89651E", "Rice paddy"],
  ["peas", "#5E9E54", "#326E3D", "Green peas"], ["mango", "#E3AE35", "#BD742C", "Mango"],
] as const;
const variants = ["cover", "close-up", "packaging", "quality-defect"] as const;
for (const [crop, colour, dark, label] of crops) {
  for (const [variantIndex, variant] of variants.entries()) {
    const produce = Array.from({ length: 12 }, (_, index) => {
      const x = 190 + (index % 4) * 190 + (variantIndex * 17 + index * 11) % 35;
      const y = 245 + Math.floor(index / 4) * 145 + (index % 3) * 9;
      const radius = 58 + (index * 7 + variantIndex * 3) % 22;
      const defect = variant === "quality-defect" && index === 6;
      return `<ellipse cx="${x}" cy="${y}" rx="${radius}" ry="${Math.round(radius * .8)}" fill="${defect ? "#795548" : colour}" stroke="${dark}" stroke-width="8"/><path d="M${x} ${y - radius * .72}q20-32 42-10" fill="none" stroke="#326E3D" stroke-width="11" stroke-linecap="round"/>`;
    }).join("");
    await emit(`crops/${crop}-${variant}.svg`, svg(`<rect width="1200" height="800" fill="#176B3A"/><rect width="1200" height="800" fill="url(#p)"/><path d="M105 170h870l95 500H80Z" fill="#F5EBDD" stroke="#795548" stroke-width="18" filter="url(#s)"/>${produce}<rect x="80" y="590" width="990" height="80" rx="20" fill="#795548"/><text x="96" y="105" fill="#fff" font-family="ui-sans-serif,system-ui" font-size="42" font-weight="800">${label.toUpperCase()} · ${variant.replace("-", " ").toUpperCase()}</text><text x="1040" y="105" text-anchor="end" fill="#EAF5EC" font-family="ui-monospace,monospace" font-size="26">SYNTHETIC DEMO</text>`, `Synthetic demo ${label.toLowerCase()} ${variant}`), "crop-illustration", `Synthetic demo ${label.toLowerCase()} ${variant} view`, `${label} का सिंथेटिक डेमो ${variant} दृश्य`, crop);
  }
}

const vehicles = [["mini-cargo", "Mini cargo truck", 520], ["pickup", "Pickup truck", 650], ["medium-goods", "Medium goods vehicle", 790], ["refrigerated", "Refrigerated truck", 900]] as const;
for (const [name, label, length] of vehicles) await emit(`vehicles/${name}.svg`, svg(`<rect width="1200" height="800" fill="#EAF5EC"/><path d="M130 535h${length}V310H420l-95 225Z" fill="#FAFCF8" stroke="#176B3A" stroke-width="18"/><path d="M420 310h${length - 410}v225H325Z" fill="#2E8B57" stroke="#176B3A" stroke-width="18"/><circle cx="315" cy="560" r="70" fill="#1D2820"/><circle cx="315" cy="560" r="27" fill="#F5EBDD"/><circle cx="${Math.min(length - 30, 830)}" cy="560" r="70" fill="#1D2820"/><circle cx="${Math.min(length - 30, 830)}" cy="560" r="27" fill="#F5EBDD"/><text x="600" y="690" text-anchor="middle" fill="#0D3520" font-family="ui-sans-serif,system-ui" font-size="46" font-weight="800">${label}</text><text x="600" y="745" text-anchor="middle" fill="#52665A" font-family="ui-sans-serif,system-ui" font-size="25">GENERIC DEMO VEHICLE · NO MANUFACTURER</text>`, `Generic ${label.toLowerCase()} illustration`), "vehicle", `Generic ${label.toLowerCase()} illustration`, `सामान्य ${label} चित्रण`);

for (const crop of ["potato", "tomato"] as const) {
  for (let frame = 1; frame <= 12; frame++) {
    const angle = (frame - 1) * 30;
    const x = 600 + Math.round(Math.sin(angle * Math.PI / 180) * 95);
    const frameName = String(frame).padStart(2, "0");
    await emit(`360/${crop}/frame-${frameName}.svg`, svg(`<rect width="1200" height="800" fill="#EAF5EC"/><ellipse cx="600" cy="650" rx="370" ry="70" fill="#0D3520" opacity=".15"/><g transform="rotate(${Math.sin(angle * Math.PI / 180) * 3} 600 430)"><path d="M270 230h660l-60 390H330Z" fill="#F5EBDD" stroke="#795548" stroke-width="22"/>${Array.from({ length: 15 }, (_, index) => `<circle cx="${x - 230 + (index % 5) * 115}" cy="${300 + Math.floor(index / 5) * 110}" r="52" fill="${crop === "potato" ? "#D9B36C" : "#D94C38"}" stroke="${crop === "potato" ? "#9D763B" : "#A82F24"}" stroke-width="7"/>`).join("")}<rect x="320" y="545" width="560" height="75" rx="16" fill="#795548"/></g><text x="60" y="75" fill="#176B3A" font-family="ui-sans-serif,system-ui" font-size="34" font-weight="800">MULTI-ANGLE DEMO · ${angle}°</text><text x="1140" y="75" text-anchor="end" fill="#52665A" font-family="ui-monospace,monospace" font-size="25">FRAME ${frameName}/12</text>`, `${crop} crate multi-angle demo frame ${frame} of 12`), "360-frame", `${crop} crate multi-angle demo frame ${frame} of 12`, `${crop} क्रेट बहु-कोण डेमो फ्रेम ${frame}`, crop);
  }
}

function simplePdf(title: string, rows: string[]) {
  const sanitize = (value: string) => value.replace(/[^\x20-\x7E]/g, "?").replace(/[()\\]/g, "\\$&");
  const commands = ["q", "0.95 0.92 0.84 rg", "0 0 595 842 re f", "Q", "BT", "/F1 28 Tf", "0.09 0.29 0.18 rg", `55 760 Td (${sanitize(title)}) Tj`, "/F1 12 Tf", ...rows.flatMap((row) => ["0 -38 Td", `(${sanitize(row)}) Tj`]), "ET", "q", "0.75 0.12 0.10 rg", "0.18 gs", "BT", "/F1 58 Tf", "0.707 0.707 -0.707 0.707 85 250 Tm", "(DEMO - NOT A REAL RECORD) Tj", "ET", "Q"].join("\n");
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> /ExtGState << /gs << /ca 0.18 /CA 0.18 >> >> >> /Contents 4 0 R >>", `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}

const documents = [
  ["grading-certificate", "SYNTHETIC GRADING CERTIFICATE", ["Lot: DEMO-LOT-000", "Grade: A (SIMULATED)", "Moisture: 0.0% demo value", "Issuer: AgriBridge Test Lab"]],
  ["weighbridge-slip", "SYNTHETIC WEIGHBRIDGE SLIP", ["Vehicle: TEST 00 XX 0000", "Gross: 00000 kg", "Tare: 00000 kg", "Net: 00000 kg"]],
  ["delivery-proof", "SYNTHETIC ELECTRONIC PROOF OF DELIVERY", ["Order: DEMO-ORDER-000", "Recipient: SAMPLE BUYER", "Delivered: NOT APPLICABLE", "Signature: DEMO ONLY"]],
] as const;
for (const [name, title, rows] of documents) await emit(`documents/${name}.pdf`, simplePdf(title, [...rows]), "demo-document", `${title.toLowerCase()}, visibly watermarked as demo`, `${title} का डेमो दस्तावेज़`);

await writeManifest(entries);
console.log(`Generated ${entries.filter((entry) => entry.status === "generated").length} deterministic demo assets.`);
