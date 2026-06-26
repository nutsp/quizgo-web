import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankBadge } from "@/components/leaderboard/RankBadge";
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
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-base">ตัวอย่างชื่อที่จะแสดงบนกระดานอันดับ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <RankBadge rank={previewRank} />
          <span className="font-medium text-foreground">{publicName}</span>
          <span className="text-muted">{formatPercent(previewScore)}</span>
        </div>
        <p className="mt-3 text-xs text-muted">
          ระบบจะไม่แสดงอีเมลเต็มบนกระดานอันดับ หากไม่ตั้งชื่อจะแสดงเป็นอีเมลที่ปิดบัง
        </p>
      </CardContent>
    </Card>
  );
}
