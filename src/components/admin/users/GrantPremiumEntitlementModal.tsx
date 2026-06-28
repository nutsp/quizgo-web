"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { toUserFriendlyError } from "@/lib/api";
import { adminEntitlementsApi } from "@/lib/api/admin/endpoints";

type GrantPremiumEntitlementModalProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function GrantPremiumEntitlementModal({
  userId,
  open,
  onOpenChange,
  onSuccess,
}: GrantPremiumEntitlementModalProps) {
  const { showToast } = useToast();
  const [expiresAt, setExpiresAt] = useState(addDays(30));
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!expiresAt) {
      showToast("กรุณาระบุวันหมดอายุ", "error");
      return;
    }
    setSubmitting(true);
    try {
      await adminEntitlementsApi.grantPremium(userId, {
        expires_at: new Date(expiresAt).toISOString(),
        notes: notes || null,
      });
      showToast("ให้สิทธิ์ Premium สำเร็จ");
      onOpenChange(false);
      setNotes("");
      setExpiresAt(addDays(30));
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
          <DialogTitle>เพิ่มสิทธิ์ Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "7 วัน", days: 7 },
              { label: "30 วัน", days: 30 },
              { label: "90 วัน", days: 90 },
              { label: "1 ปี", days: 365 },
            ].map((opt) => (
              <Button
                key={opt.days}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setExpiresAt(addDays(opt.days))}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="premium_expires">วันหมดอายุ *</Label>
            <Input
              id="premium_expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="premium_notes">หมายเหตุ</Label>
            <Textarea id="premium_notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "ให้สิทธิ์ Premium"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
