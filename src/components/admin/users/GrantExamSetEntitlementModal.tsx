"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { toUserFriendlyError } from "@/lib/api";
import {
  adminEntitlementsApi,
  adminExamSetsApi,
  type AdminExamSet,
} from "@/lib/api/admin/endpoints";
import { ACCESS_LABELS } from "@/lib/exam/format";

type GrantExamSetEntitlementModalProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function GrantExamSetEntitlementModal({
  userId,
  open,
  onOpenChange,
  onSuccess,
}: GrantExamSetEntitlementModalProps) {
  const { showToast } = useToast();
  const [examSets, setExamSets] = useState<AdminExamSet[]>([]);
  const [loadingSets, setLoadingSets] = useState(false);
  const [examSetId, setExamSetId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoadingSets(true);
    adminExamSetsApi
      .list({ limit: 100, status: "published" })
      .then((data) => setExamSets(data.items))
      .catch((e) => showToast(toUserFriendlyError(e), "error"))
      .finally(() => setLoadingSets(false));
  }, [open, showToast]);

  const filtered = examSets.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async () => {
    if (!examSetId) {
      showToast("กรุณาเลือกชุดข้อสอบ", "error");
      return;
    }
    setSubmitting(true);
    try {
      await adminEntitlementsApi.grantExamSet(userId, {
        exam_set_id: examSetId,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        notes: notes || null,
      });
      showToast("ให้สิทธิ์ชุดข้อสอบสำเร็จ");
      onOpenChange(false);
      setExamSetId("");
      setExpiresAt("");
      setNotes("");
      onSuccess();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>เพิ่มสิทธิ์ชุดข้อสอบ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>ค้นหาชุดข้อสอบ</Label>
            <Input
              placeholder="ค้นหาชื่อหรือรหัส..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>ชุดข้อสอบ *</Label>
            {loadingSets ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Select value={examSetId} onValueChange={setExamSetId}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกชุดข้อสอบ" />
                </SelectTrigger>
                <SelectContent>
                  {filtered.map((s) => {
                    const accessLabel =
                      ACCESS_LABELS[s.access_type as keyof typeof ACCESS_LABELS] ??
                      s.access_type;
                    const premiumBadge =
                      s.access_type === "premium"
                        ? s.allow_single_purchase
                          ? "Premium · ซื้อแยกได้"
                          : "Premium"
                        : accessLabel;
                    return (
                      <SelectItem key={s.id} value={s.id}>
                        {s.code} — {premiumBadge}
                        {s.access_type === "paid" && s.price_amount > 0
                          ? ` (${s.price_amount} บาท)`
                          : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires_at">วันหมดอายุ (ไม่บังคับ)</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <p className="text-xs text-muted">เว้นว่าง = ใช้ได้ตลอดไป</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">หมายเหตุ</Label>
            <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "ให้สิทธิ์"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
