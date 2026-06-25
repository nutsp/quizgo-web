import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  completed: number;
  total: number;
  remainingMinutes: number;
  href: string;
}

export function ProgressCard({
  title,
  completed,
  total,
  remainingMinutes,
  href,
}: ProgressCardProps) {
  const progress = (completed / total) * 100;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">ทำต่อจากครั้งล่าสุด</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted">
            ทำไปแล้ว {completed} / {total} ข้อ
          </p>
        </div>
        <Progress value={progress} />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <Clock className="h-4 w-4" />
            เหลือเวลา {remainingMinutes} นาที
          </span>
          <Button asChild size="sm">
            <Link href={href}>ทำต่อ</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
