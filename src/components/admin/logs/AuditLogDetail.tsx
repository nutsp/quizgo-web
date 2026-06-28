"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/admin/labels";
import type { AdminAuditLog } from "@/lib/api/admin/endpoints";

type AuditLogDetailProps = {
  log: AdminAuditLog | null;
  open: boolean;
  onClose: () => void;
};

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  if (data == null) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <pre className="max-h-60 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export function AuditLogDetail({ log, open, onClose }: AuditLogDetailProps) {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>รายละเอียด Audit Log</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            <p><span className="text-slate-500">เวลา:</span> {formatDateTime(log.created_at)}</p>
            <p><span className="text-slate-500">ผู้ดำเนินการ:</span> {log.actor_email || log.actor_user_id || "-"}</p>
            <p><span className="text-slate-500">Action:</span> {log.action}</p>
            <p><span className="text-slate-500">Resource:</span> {log.resource_type}</p>
            <p><span className="text-slate-500">Resource Name:</span> {log.resource_name || "-"}</p>
            <p><span className="text-slate-500">IP:</span> {log.ip_address || "-"}</p>
          </div>
          <p className="break-all text-slate-600"><span className="text-slate-500">User Agent:</span> {log.user_agent || "-"}</p>
          <JsonBlock label="Before Data" data={log.before_data} />
          <JsonBlock label="After Data" data={log.after_data} />
          <JsonBlock label="Metadata" data={log.metadata} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
