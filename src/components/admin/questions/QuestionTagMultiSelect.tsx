"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { AdminQuestionTag } from "@/lib/api/admin/endpoints";
import { QuestionTagBadge } from "@/components/admin/question-tags/QuestionTagBadge";

type QuestionTagMultiSelectProps = {
  tags: AdminQuestionTag[];
  value: string[];
  onChange: (ids: string[]) => void;
};

export function QuestionTagMultiSelect({ tags, value, onChange }: QuestionTagMultiSelectProps) {
  const [search, setSearch] = useState("");

  const activeTags = useMemo(
    () => tags.filter((t) => t.is_active),
    [tags]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeTags;
    return activeTags.filter(
      (t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
    );
  }, [activeTags, search]);

  const selectedTags = useMemo(
    () => activeTags.filter((t) => value.includes(t.id)),
    [activeTags, value]
  );

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-3">
      <Label>กลุ่มคำถาม</Label>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="คลิกเพื่อยกเลิก"
            >
              <QuestionTagBadge name={t.name} color={t.color} />
            </button>
          ))}
        </div>
      )}
      <Input
        placeholder="ค้นหากลุ่มคำถาม..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted">ไม่พบกลุ่มคำถาม</p>
        ) : (
          filtered.map((tag) => (
            <label key={tag.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={value.includes(tag.id)} onCheckedChange={() => toggle(tag.id)} />
              <QuestionTagBadge name={tag.name} color={tag.color} />
              <span className="text-slate-500">{tag.code}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
