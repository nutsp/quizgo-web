"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/useToast";
import {
  adminQuestionImportApi,
  type ImportPreviewResult,
  type ImportPreviewRow,
} from "@/lib/api/admin/endpoints";
import { toUserFriendlyError } from "@/lib/api";

type ImportPhase = "idle" | "preview" | "success";

function ValidationBadge({ row }: { row: ImportPreviewRow }) {
  if (!row.valid) {
    return <Badge variant="danger">มีปัญหา</Badge>;
  }
  if (row.warnings.length > 0) {
    return <Badge variant="warning">มีคำเตือน</Badge>;
  }
  return <Badge variant="success">ผ่าน</Badge>;
}

function PreviewRowItem({ row }: { row: ImportPreviewRow }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-border last:border-0 hover:bg-background/50"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="p-3">
          <div className="flex items-center gap-1">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted" />
            )}
            {row.row_number}
          </div>
        </td>
        <td className="p-3">{row.data.subject_code}</td>
        <td className="max-w-xs p-3">{row.data.question_text.slice(0, 60)}{row.data.question_text.length > 60 ? "…" : ""}</td>
        <td className="p-3">{row.data.correct_choice}</td>
        <td className="p-3">{row.data.difficulty ?? "medium"}</td>
        <td className="p-3">{row.data.status ?? "draft"}</td>
        <td className="p-3">
          <ValidationBadge row={row} />
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-background/30">
          <td colSpan={7} className="p-4">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">คำถาม</p>
                <p className="text-muted">{row.data.question_text}</p>
              </div>
              <div className="grid gap-1 sm:grid-cols-2">
                <p><span className="font-medium">ก.</span> {row.data.choice_a}</p>
                <p><span className="font-medium">ข.</span> {row.data.choice_b}</p>
                <p><span className="font-medium">ค.</span> {row.data.choice_c}</p>
                <p><span className="font-medium">ง.</span> {row.data.choice_d}</p>
              </div>
              {row.errors.length > 0 && (
                <div>
                  <p className="font-medium text-danger">ข้อผิดพลาด</p>
                  <ul className="list-inside list-disc text-danger">
                    {row.errors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
              {row.warnings.length > 0 && (
                <div>
                  <p className="font-medium text-warning">คำเตือน</p>
                  <ul className="list-inside list-disc text-warning">
                    {row.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function QuestionImportPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState<ImportPreviewResult | null>(null);
  const [importOnlyValid, setImportOnlyValid] = useState(true);
  const [phase, setPhase] = useState<ImportPhase>("idle");
  const [successSummary, setSuccessSummary] = useState<{
    imported: number;
    skipped: number;
  } | null>(null);

  const warningCount =
    preview?.rows.reduce((acc, row) => acc + (row.warnings.length > 0 ? 1 : 0), 0) ?? 0;

  const canConfirm =
    preview &&
    preview.valid_rows > 0 &&
    (preview.invalid_rows === 0 || importOnlyValid);

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    try {
      await adminQuestionImportApi.downloadTemplate();
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setDownloading(false);
    }
  };

  const acceptFile = (selected: File | null) => {
    if (!selected) return;
    const ext = selected.name.toLowerCase();
    if (!ext.endsWith(".csv") && !ext.endsWith(".xlsx")) {
      showToast("รองรับเฉพาะไฟล์ .csv และ .xlsx", "error");
      return;
    }
    setFile(selected);
    setPreview(null);
    setPhase("idle");
    setSuccessSummary(null);
  };

  const handlePreview = async () => {
    if (!file) {
      showToast("กรุณาเลือกไฟล์", "error");
      return;
    }
    setPreviewing(true);
    try {
      const result = await adminQuestionImportApi.preview(file);
      setPreview(result);
      setPhase("preview");
      setImportOnlyValid(result.invalid_rows > 0);
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setPreviewing(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || !canConfirm) return;
    setConfirming(true);
    try {
      const result = await adminQuestionImportApi.confirm({
        import_id: preview.import_id,
        import_only_valid_rows: importOnlyValid,
      });
      setSuccessSummary({
        imported: result.imported_questions,
        skipped: result.skipped_rows,
      });
      setPhase("success");
      showToast("นำเข้าคำถามสำเร็จ");
    } catch (e) {
      showToast(toUserFriendlyError(e), "error");
    } finally {
      setConfirming(false);
    }
  };

  const resetImport = useCallback(() => {
    setFile(null);
    setPreview(null);
    setPhase("idle");
    setSuccessSummary(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  if (phase === "success" && successSummary) {
    return (
      <div>
        <AdminPageHeader
          title="นำเข้าคำถาม"
          description="อัปโหลดไฟล์ Excel หรือ CSV เพื่อเพิ่มคำถามจำนวนมากเข้าสู่คลังคำถาม"
        />
        <Card className="mx-auto max-w-lg text-center">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <CheckCircle2 className="h-16 w-16 text-success" />
            <div>
              <h2 className="text-xl font-bold text-foreground">นำเข้าคำถามสำเร็จ</h2>
              <p className="mt-2 text-muted">
                นำเข้าแล้ว {successSummary.imported} ข้อ
                {successSummary.skipped > 0 && (
                  <> · ข้าม {successSummary.skipped} แถวที่มีปัญหา</>
                )}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/admin/questions">ไปที่คลังคำถาม</Link>
              </Button>
              <Button variant="outline" onClick={resetImport}>
                นำเข้าไฟล์ใหม่
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="นำเข้าคำถาม"
        description="อัปโหลดไฟล์ Excel หรือ CSV เพื่อเพิ่มคำถามจำนวนมากเข้าสู่คลังคำถาม"
      />

      <Card>
        <CardHeader>
          <CardTitle>ดาวน์โหลด Template</CardTitle>
          <CardDescription>
            ใช้ template นี้เพื่อเตรียมข้อมูลคำถาม ตัวเลือก เฉลย และคำอธิบายให้ตรงกับรูปแบบที่ระบบรองรับ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleDownloadTemplate} disabled={downloading}>
            {downloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            ดาวน์โหลด CSV Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>อัปโหลดไฟล์</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border bg-background/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              acceptFile(e.dataTransfer.files[0] ?? null);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mb-3 h-10 w-10 text-muted" />
            <p className="text-sm font-medium text-foreground">
              ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
            </p>
            <p className="mt-1 text-xs text-muted">รองรับ .csv และ .xlsx</p>
            {file && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <span>{file.name}</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
          />
          <Button onClick={handlePreview} disabled={!file || previewing}>
            {previewing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังอ่านไฟล์...
              </>
            ) : (
              "Preview ข้อมูล"
            )}
          </Button>
        </CardContent>
      </Card>

      {preview && phase === "preview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted">จำนวนแถวทั้งหมด</p>
                <p className="text-2xl font-bold">{preview.total_rows}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted">แถวที่ถูกต้อง</p>
                <p className="text-2xl font-bold text-success">{preview.valid_rows}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted">แถวที่มีปัญหา</p>
                <p className="text-2xl font-bold text-danger">{preview.invalid_rows}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted">คำเตือน</p>
                <p className="text-2xl font-bold text-warning">{warningCount}</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background text-left text-muted">
                  <th className="p-3">Row</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Question preview</th>
                  <th className="p-3">Correct choice</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Validation result</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row) => (
                  <PreviewRowItem key={row.row_number} row={row} />
                ))}
              </tbody>
            </table>
          </div>

          <Card>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                {preview.invalid_rows > 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="import-only-valid"
                      checked={importOnlyValid}
                      onCheckedChange={(v) => setImportOnlyValid(v === true)}
                    />
                    <Label htmlFor="import-only-valid" className="cursor-pointer">
                      นำเข้าเฉพาะแถวที่ถูกต้อง
                    </Label>
                  </div>
                )}
              </div>
              <Button onClick={handleConfirm} disabled={!canConfirm || confirming}>
                {confirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังนำเข้า...
                  </>
                ) : (
                  "ยืนยันนำเข้า"
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
