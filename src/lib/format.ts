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

/** Alias for optional datetime fields on result/review pages. */
export function formatThaiDateTime(value?: string | null): string {
  if (!value) return "-";
  return formatThaiDate(value);
}

export function formatScore(score: number, total: number): string {
  return `${Math.round(score)}/${Math.round(total)}`;
}

export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "***";
  const local = parts[0];
  const domain = parts[1];
  if (local.length <= 2) {
    return `${local.slice(0, 1) || ""}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}

export function publicDisplayName(displayName?: string | null, email?: string): string {
  const trimmed = displayName?.trim();
  if (trimmed) return trimmed;
  if (email) return maskEmail(email);
  return "ผู้ใช้";
}

export function leaderboardDisplayName(
  name: string,
  isCurrentUser: boolean
): string {
  return isCurrentUser ? `${name} (คุณ)` : name;
}
