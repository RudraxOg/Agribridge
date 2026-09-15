import { sniffMime } from "../../src/lib/storage/asset-policy";

export function fileTypeFromBuffer(bytes: Uint8Array) {
  return sniffMime(bytes);
}
