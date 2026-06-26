"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { AdminSubject } from "@/lib/api/admin/endpoints";

type QuestionFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;
  difficultyFilter: string;
  onDifficultyFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  excludeAssigned: boolean;
  onExcludeAssignedChange: (value: boolean) => void;
  subjects: AdminSubject[];
};

export function QuestionFilters({
  search,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  statusFilter,
  onStatusFilterChange,
  excludeAssigned,
  onExcludeAssignedChange,
  subjects,
}: QuestionFiltersProps) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="ค้นหา..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Select value={subjectFilter || "all"} onValueChange={(v) => onSubjectFilterChange(v === "all" ? "" : v)}>
          <SelectTrigger className="w-full min-w-[8rem] flex-1 sm:w-36">
            <SelectValue placeholder="หมวดวิชา" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกหมวด</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter || "all"} onValueChange={(v) => onDifficultyFilterChange(v === "all" ? "" : v)}>
          <SelectTrigger className="w-full min-w-[8rem] flex-1 sm:w-32">
            <SelectValue placeholder="ความยาก" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกระดับ</SelectItem>
            <SelectItem value="easy">ง่าย</SelectItem>
            <SelectItem value="medium">ปานกลาง</SelectItem>
            <SelectItem value="hard">ยาก</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter || "published"} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full min-w-[8rem] flex-1 sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">เผยแพร่</SelectItem>
            <SelectItem value="draft">ฉบับร่าง</SelectItem>
            <SelectItem value="archived">เก็บถาวร</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="exclude-assigned"
          checked={excludeAssigned}
          onCheckedChange={onExcludeAssignedChange}
        />
        <Label htmlFor="exclude-assigned" className="text-sm text-muted">
          ซ่อนคำถามที่อยู่ในชุดแล้ว
        </Label>
      </div>
    </div>
  );
}
