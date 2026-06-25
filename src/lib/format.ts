export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded % 1 === 0 ? Math.round(rounded) : rounded}%`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0 && m > 0) {
    return `${h} ชม. ${m} นาที`;
  }
  if (h > 0) {
    return `${h} ชม.`;
  }
  if (m > 0) {
    return `${m} นาที`;
  }
  return `${seconds} วินาที`;
}

export function formatThaiDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatScore(score: number, total: number): string {
  return `${Math.round(score)}/${Math.round(total)}`;
}
