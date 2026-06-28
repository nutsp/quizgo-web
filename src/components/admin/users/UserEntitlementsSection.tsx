"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, ShieldOff } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { GrantExamSetEntitlementModal } from "@/components/admin/users/GrantExamSetEntitlementModal";
import { GrantPremiumEntitlementModal } from "@/components/admin/users/GrantPremiumEntitlementModal";
import { UserEntitlementStatusBadge } from "@/components/admin/users/UserEntitlementStatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { formatDateTime } from "@/lib/admin/labels";
import { toUserFriendlyError } from "@/lib/api";
import {
  adminEntitlementsApi,
  type UserEntitlement,
} from "@/lib/api/admin/endpoints";

const ENTITLEMENT_TYPE_LABELS: Record<string, string> = {
  exam_set: "ชุดข้อสอบ",
  premium: "Premium",
};

const SOURCE_LABELS: Record<string, string> = {
  manual: "ให้ด้วยมือ",
  purchase: "ซื้อ",
  subscription: "สมัครสมาชิก",
};

type UserEntitlementsSectionProps = {
  userId: string;
};

export function UserEntitlementsSection({ userId }: UserEntitlementsSectionProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<UserEntitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [examSetModalOpen, setExamSetModalOpen] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<UserEntitlement | null>(null);
  const [revoking, setRevoking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminEntitlementsApi.listUserEntitlements(userId, { limit: 50 });
      setItems(data.items);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [userId, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await adminEntitlementsApi.revoke(revokeTarget.id);
      showToast("ยกเลิกสิทธิ์สำเร็จ");
      setRevokeTarget(null);
      load();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium">สิทธิ์การเข้าถึง</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setExamSetModalOpen(true)}>
            <Plus className="h-4 w-4" />
            เพิ่มสิทธิ์ชุดข้อสอบ
          </Button>
          <Button size="sm" variant="outline" onClick={() => setPremiumModalOpen(true)}>
            <Plus className="h-4 w-4" />
            เพิ่มสิทธิ์ Premium
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 p-4 text-slate-500">ยังไม่มีสิทธิ์การเข้าถึง</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-medium">ประเภทสิทธิ์</th>
                <th className="px-3 py-2 font-medium">รายการ</th>
                <th className="px-3 py-2 font-medium">แหล่งที่มา</th>
                <th className="px-3 py-2 font-medium">เริ่มต้น</th>
                <th className="px-3 py-2 font-medium">หมดอายุ</th>
                <th className="px-3 py-2 font-medium">สถานะ</th>
                <th className="px-3 py-2 font-medium">ผู้ให้สิทธิ์</th>
                <th className="px-3 py-2 font-medium">หมายเหตุ</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2">{ENTITLEMENT_TYPE_LABELS[item.entitlement_type] ?? item.entitlement_type}</td>
                  <td className="px-3 py-2">{item.ref_name ?? (item.entitlement_type === "premium" ? "Premium" : "—")}</td>
                  <td className="px-3 py-2">{SOURCE_LABELS[item.source] ?? item.source}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(item.starts_at)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {item.expires_at ? formatDateTime(item.expires_at) : "ไม่หมดอายุ"}
                  </td>
                  <td className="px-3 py-2">
                    <UserEntitlementStatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-2">{item.granted_by_name ?? "—"}</td>
                  <td className="max-w-[120px] truncate px-3 py-2" title={item.notes ?? undefined}>
                    {item.notes ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {item.status === "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setRevokeTarget(item)}
                      >
                        <ShieldOff className="h-4 w-4" />
                        ยกเลิก
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <GrantExamSetEntitlementModal
        userId={userId}
        open={examSetModalOpen}
        onOpenChange={setExamSetModalOpen}
        onSuccess={load}
      />
      <GrantPremiumEntitlementModal
        userId={userId}
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
        onSuccess={load}
      />
      <AdminConfirmDialog
        open={!!revokeTarget}
        title="ยกเลิกสิทธิ์"
        description="ยืนยันการยกเลิกสิทธิ์นี้ ผู้ใช้จะไม่สามารถเข้าถึงชุดข้อสอบที่เกี่ยวข้องได้อีก"
        confirmLabel="ยกเลิกสิทธิ์"
        loading={revoking}
        onConfirm={handleRevoke}
        onCancel={() => setRevokeTarget(null)}
      />
    </div>
  );
}
