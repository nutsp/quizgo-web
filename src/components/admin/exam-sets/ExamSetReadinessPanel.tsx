"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, XCircle, AlertTriangle } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import {
  adminExamSetsApi,
  type ExamSetReadiness,
  type ExamSetStatus,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";
import { cn } from "@/lib/utils";

type ExamSetReadinessPanelProps = {
  examSetId: string;
  status?: ExamSetStatus;
  onPublished?: () => void;
  onPublishClick?: (readiness: ExamSetReadiness) => void;
  className?: string;
};

export function ExamSetReadinessPanel({
  examSetId,
  status,
  onPublished,
  onPublishClick,
  className,
}: ExamSetReadinessPanelProps) {
  const [readiness, setReadiness] = useState<ExamSetReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminExamSetsApi.getReadiness(examSetId);
      setReadiness(data);
    } catch (e) {
      setError(toUserFriendlyError(e));
    } finally {
      setLoading(false);
    }
  }, [examSetId]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async () => {
    if (!readiness) return;
    if (!readiness.ready) {
      if (onPublishClick) onPublishClick(readiness);
      return;
    }
    if (onPublishClick) {
      onPublishClick(readiness);
      return;
    }
    setPublishing(true);
    try {
      await adminExamSetsApi.publish(examSetId);
      await load();
      onPublished?.();
    } catch (e) {
      setError(toUserFriendlyError(e));
    } finally {
      setPublishing(false);
    }
  };

  const currentStatus = status ?? readiness?.status;

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-5", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">ความพร้อมก่อนเผยแพร่</h3>
          <p className="mt-1 text-sm text-slate-500">
            ระบบจะตรวจสอบว่าชุดข้อสอบนี้พร้อมให้ผู้ใช้งานเริ่มทำข้อสอบหรือไม่
          </p>
        </div>
        {currentStatus && <AdminStatusBadge status={currentStatus} />}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : readiness ? (
        <>
          <div
            className={cn(
              "mb-4 rounded-lg px-4 py-3 text-sm font-medium",
              readiness.ready
                ? "bg-success/10 text-success"
                : "bg-amber-50 text-amber-800"
            )}
          >
            {readiness.ready
              ? "ชุดข้อสอบพร้อมเผยแพร่"
              : "ชุดข้อสอบยังไม่พร้อมเผยแพร่ กรุณาแก้ไขรายการด้านล่างก่อนเผยแพร่"}
          </div>

          <ul className="space-y-2">
            {readiness.checks.map((check) => (
              <li
                key={check.key}
                className="flex items-start gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                {check.severity === "warning" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                ) : check.passed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-800">{check.label}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs",
                        check.severity === "warning"
                          ? "bg-amber-100 text-amber-700"
                          : check.passed
                            ? "bg-success/10 text-success"
                            : "bg-red-100 text-red-700"
                      )}
                    >
                      {check.severity === "warning"
                        ? "คำเตือน"
                        : check.passed
                          ? "ผ่าน"
                          : "ไม่ผ่าน"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-slate-500">{check.message}</p>
                </div>
              </li>
            ))}
          </ul>

          {readiness.summary.total_questions > 0 && (
            <p className="mt-4 text-xs text-slate-500">
              คำถามในชุด: {readiness.summary.total_questions} ข้อ · เผยแพร่แล้ว{" "}
              {readiness.summary.published_questions} · ฉบับร่าง{" "}
              {readiness.summary.draft_questions}
              {readiness.summary.invalid_questions > 0 &&
                ` · ไม่ถูกต้อง ${readiness.summary.invalid_questions}`}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              ตรวจอีกครั้ง
            </Button>
            {currentStatus !== "published" && (
              <Button size="sm" onClick={handlePublish} disabled={publishing || !readiness.ready}>
                {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : "เผยแพร่"}
              </Button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
