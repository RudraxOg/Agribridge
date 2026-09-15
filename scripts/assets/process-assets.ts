import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ensureDirectory, readManifest, root, sha256 } from "./common";

const processedRoot = path.join(root, "assets/processed");
const publicRoot = path.join(root, "public/generated/processed");
await Promise.all([ensureDirectory(processedRoot), ensureDirectory(publicRoot)]);
const sourceRoots = [path.join(root, "assets/originals"), path.join(root, "assets/generated/crops")];
const records: Array<{ source: string; path: string; variant: string; width: number; height: number; mimeType: string; byteSize: number; checksumSha256: string }> = [];

async function files(directory: string): Promise<string[]> {
  try {
    const names = await readdir(directory);
    return (await Promise.all(names.map(async (name) => {
      const target = path.join(directory, name);
      return (await stat(target)).isDirectory() ? files(target) : [target];
    }))).flat();
  } catch { return []; }
}

const manifest = await readManifest();
for (const source of (await Promise.all(sourceRoots.map(files))).flat()) {
  if (!/\.(avif|heic|heif|jpe?g|png|webp|svg)$/i.test(source)) continue;
  const basename = path.basename(source).replace(/\.[^.]+$/, "");
  const entry = manifest.find((item) => item.slug === basename || item.slug.endsWith(basename));
  const variants = entry?.targetVariants ?? ["card", "detail"];
  for (const variant of variants.filter((item) => item !== "original")) {
    const width = variant === "thumb" ? 320 : variant === "card" ? 640 : 1280;
    for(const format of ["webp","avif","jpeg"] as const){const relative=`${basename}-${variant}-${width}.${format==="jpeg"?"jpg":format}`;const destination=path.join(processedRoot,relative);const publicDestination=path.join(publicRoot,relative);let image=sharp(source,{failOn:"warning"}).rotate().resize({width,height:Math.round(width*.667),fit:"cover",withoutEnlargement:true});image=format==="webp"?image.webp({quality:variant==="thumb"?72:82}):format==="avif"?image.avif({quality:variant==="thumb"?48:58,effort:4}):image.jpeg({quality:variant==="thumb"?72:84,mozjpeg:true});const bytes=await image.toBuffer();await Promise.all([writeFile(destination,bytes),writeFile(publicDestination,bytes)]);const metadata=await sharp(bytes).metadata();records.push({source:path.relative(root,source),path:path.relative(root,destination),variant,width:metadata.width??width,height:metadata.height??Math.round(width*.667),mimeType:`image/${format}`,byteSize:bytes.byteLength,checksumSha256:sha256(bytes)})}
  }
}
await writeFile(path.join(processedRoot, "index.json"), `${JSON.stringify(records, null, 2)}\n`);
console.log(`Processed ${records.length} derivatives; orientation normalized and metadata stripped.`);
