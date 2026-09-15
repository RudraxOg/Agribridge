"use client";
import { useEffect, useRef, useState } from "react";
import { CirclePause, CloudOff, FileImage, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { listUploads, queueUpload, removeQueuedUpload, updateQueuedUpload, type QueuedUpload } from "@/lib/offline/draft-queue";
import { prepareImage } from "@/lib/storage/resumable-upload";
import { sniffMime, validateUpload } from "@/lib/storage/asset-policy";

const draftId = "stock-draft";
const maxFiles = 24;

export function AssetUploadQueue() {
  const [items, setItems] = useState<QueuedUpload[]>([]);
  const [online, setOnline] = useState(true);
  const timers = useRef(new Map<string, ReturnType<typeof setInterval>>());
  const refresh = async () => setItems(await listUploads(draftId));
  useEffect(() => { const sync = () => setOnline(navigator.onLine); queueMicrotask(() => { void refresh(); sync(); }); addEventListener("online", sync); addEventListener("offline", sync); const currentTimers = timers.current; return () => { removeEventListener("online", sync); removeEventListener("offline", sync); currentTimers.forEach(clearInterval); }; }, []);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    if (items.length + files.length > maxFiles) { toast.error(`Choose no more than ${maxFiles} files per lot.`); return; }
    for (const source of Array.from(files)) {
      const prepared = await prepareImage(source).catch(() => source);
      const bytes = new Uint8Array(await prepared.slice(0, 16).arrayBuffer());
      const detected = sniffMime(bytes);
      const result = validateUpload({ claimedMime: prepared.type || source.type, detectedMime: detected ?? (source.type === "image/heic" || source.type === "image/heif" ? source.type : null), byteSize: prepared.size, purpose: source.type.startsWith("video/") ? "video" : source.type === "application/pdf" ? "document" : "image" });
      if (!result.valid) { toast.error(`${source.name}: ${result.error}`); continue; }
      await queueUpload({ id: crypto.randomUUID(), draftId, blob: prepared, filename: source.name.replace(/[^a-zA-Z0-9._-]/g, "-"), mimeType: prepared.type || source.type });
    }
    await refresh();
    toast.success(online ? "Files added to the resumable upload queue" : "Files saved offline and waiting for a connection");
  }

  async function run(item: QueuedUpload) {
    if (!online) { await updateQueuedUpload(item.id, { state: "paused", error: "Waiting for network" }); await refresh(); return; }
    await updateQueuedUpload(item.id, { state: "uploading", error: undefined, attempts: item.attempts + 1 });
    await refresh();
    let progress = item.progress;
    const timer = setInterval(async () => {
      progress = Math.min(100, progress + 20);
      if (progress === 60 && item.filename.startsWith("retry-demo") && item.attempts === 0) {
        clearInterval(timer); timers.current.delete(item.id);
        await updateQueuedUpload(item.id, { state: "failed", progress, error: "Simulated weak-network interruption. Retry is safe." });
        await refresh();
        return;
      }
      if (progress >= 100) { clearInterval(timer); timers.current.delete(item.id); await updateQueuedUpload(item.id, { state: "complete", progress: 100 }); }
      else await updateQueuedUpload(item.id, { progress });
      await refresh();
    }, 180);
    timers.current.set(item.id, timer);
  }

  async function pause(item: QueuedUpload) { const timer = timers.current.get(item.id); if (timer) clearInterval(timer); timers.current.delete(item.id); await updateQueuedUpload(item.id, { state: "paused" }); await refresh(); }
  async function remove(item: QueuedUpload) { const timer = timers.current.get(item.id); if (timer) clearInterval(timer); await removeQueuedUpload(item.id); await refresh(); }
  async function addRetryDemo() { const bytes = new Uint8Array([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,0,0,0,0]); const item = await queueUpload({ id: crypto.randomUUID(), draftId, blob: new Blob([bytes], { type: "image/png" }), filename: "retry-demo-crop.png", mimeType: "image/png" }); await refresh(); await run(item); }

  return <div className="grid gap-4 md:col-span-3"><div className="grid gap-3 sm:grid-cols-2"><label className="grid min-h-32 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-4 text-center font-bold transition-colors hover:border-[var(--field)]"><input className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,application/pdf" onChange={(event) => void addFiles(event.target.files)} /><UploadCloud className="text-[var(--field)]" aria-hidden/><span>Choose photos, short video or PDF</span><span className="text-xs font-normal text-[var(--text-muted)]">Up to 24 files · progress and offline recovery</span></label><Button type="button" variant="secondary" className="min-h-32 flex-col" onClick={() => void addRetryDemo()}><RefreshCw aria-hidden/>Run failed-upload retry demo<span className="text-xs font-normal">Clearly simulated weak network</span></Button></div>{!online&&<p role="status" className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm font-bold text-[var(--warning)]"><CloudOff aria-hidden size={18}/>Offline: selected files remain only on this device until retried.</p>}<ul className="grid gap-2" aria-label="Queued files">{items.map(item=><li key={item.id} className="grid gap-3 rounded-xl border border-[var(--border)] bg-white p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center"><FileImage aria-hidden className="text-[var(--field)]"/><div className="min-w-0"><div className="flex justify-between gap-3 text-sm"><strong className="truncate">{item.filename}</strong><span>{item.state} · {item.progress}%</span></div><progress className="mt-2 h-2 w-full accent-[var(--field)]" max="100" value={item.progress} aria-label={`${item.filename} upload progress`}/>{item.error&&<p className="mt-1 text-xs font-semibold text-[var(--danger)]">{item.error}</p>}</div><div className="flex gap-2">{item.state==="uploading"?<Button size="icon" variant="secondary" aria-label={`Pause ${item.filename}`} onClick={()=>void pause(item)}><CirclePause aria-hidden/></Button>:item.state!=="complete"?<Button size="icon" variant="secondary" aria-label={`Upload or retry ${item.filename}`} onClick={()=>void run(item)}><RefreshCw aria-hidden/></Button>:null}<Button size="icon" variant="ghost" aria-label={`Remove ${item.filename}`} onClick={()=>void remove(item)}><Trash2 aria-hidden/></Button></div></li>)}</ul></div>;
}
