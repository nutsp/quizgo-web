import { formatPercent, publicDisplayName } from "@/lib/format";

interface PublicDisplayPreviewProps {
  displayName?: string | null;
  email: string;
  previewRank?: number;
  previewScore?: number;
}

export function PublicDisplayPreview({
  displayName,
  email,
  previewRank = 12,
  previewScore = 78,
}: PublicDisplayPreviewProps) {
  const publicName = publicDisplayName(displayName, email);

  return (
    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">ตัวอย่างบนกระดานอันดับ</p>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {previewRank}
        </span>
        <span className="min-w-0 flex-1 truncate font-semibold text-slate-950">{publicName}</span>
        <span className="shrink-0 text-sm font-semibold text-teal-700">
          {formatPercent(previewScore)}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        ระบบจะไม่แสดงอีเมลเต็มบนกระดานอันดับ
      </p>
    </div>
  );
}
