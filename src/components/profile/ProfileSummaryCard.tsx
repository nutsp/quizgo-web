import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/lib/api/types";
import { formatThaiDateTime, publicDisplayName } from "@/lib/format";

const ROLE_LABELS: Record<string, string> = {
  user: "ผู้ใช้งาน",
  admin: "ผู้ดูแลระบบ",
};

interface ProfileSummaryCardProps {
  profile: UserProfile;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const displayName = publicDisplayName(profile.display_name, profile.email);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ข้อมูลบัญชี</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted">อีเมล</p>
          <p className="mt-1 font-medium text-foreground">{profile.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted">ชื่อที่แสดง</p>
          <p className="mt-1 font-medium text-foreground">{displayName}</p>
        </div>
        <div>
          <p className="text-xs text-muted">บทบาท</p>
          <Badge variant="outline" className="mt-1">
            {ROLE_LABELS[profile.role] ?? profile.role}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted">วันที่สมัคร</p>
          <p className="mt-1 font-medium text-foreground">
            {formatThaiDateTime(profile.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
