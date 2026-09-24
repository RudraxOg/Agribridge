import { Download, FileDown, Settings2 } from "lucide-react";
const steps = [
  [Download, "Download", "Tap Download APK and wait for it to finish."],
  [
    FileDown,
    "Open file",
    "Tap Open, or open Downloads and select AgriBridge.apk.",
  ],
  [
    Settings2,
    "Allow and install",
    "If Android asks, tap Settings → enable Allow from this source → return → tap Install.",
  ],
] as const;
export function AndroidInstallSteps() {
  return (
    <ol className="mt-5 grid gap-3">
      {steps.map(([Icon, title, text], index) => (
        <li
          key={title}
          className="flex gap-3 rounded-xl bg-[var(--surface-muted)] p-3 text-sm"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--field)]">
            <Icon aria-hidden size={18} />
          </span>
          <p>
            <strong>
              Step {index + 1}: {title}
            </strong>
            <br />
            {text}
          </p>
        </li>
      ))}
    </ol>
  );
}
