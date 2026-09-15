import { licenseDecision } from "../../src/lib/storage/asset-policy";
import { readManifest } from "./common";

const entries = await readManifest();
const errors: string[] = [];
const slugs = new Set<string>();
const urls = new Set<string>();

for (const entry of entries) {
  if (slugs.has(entry.slug)) errors.push(`${entry.slug}: duplicate slug`);
  slugs.add(entry.slug);
  if (entry.status !== "generated" && urls.has(entry.downloadUrl)) errors.push(`${entry.slug}: duplicate download URL`);
  urls.add(entry.downloadUrl);
  if (entry.status === "approved") {
    const decision = licenseDecision(entry.licenseCode, entry.shareAlikeHandled);
    if (!decision.allowed) errors.push(`${entry.slug}: ${decision.code} is not automatically allowed (${decision.reason})`);
    for (const [field, value] of Object.entries({ sourcePageUrl: entry.sourcePageUrl, downloadUrl: entry.downloadUrl, author: entry.author, licenseUrl: entry.licenseUrl, attributionText: entry.attributionText })) {
      if (!value.trim()) errors.push(`${entry.slug}: missing ${field}`);
    }
  }
}

console.log(`Validated ${entries.length} entries: ${entries.filter((entry) => entry.status === "approved").length} approved, ${entries.filter((entry) => entry.status === "needs-review").length} awaiting review, ${entries.filter((entry) => entry.status === "generated").length} generated.`);
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
}
