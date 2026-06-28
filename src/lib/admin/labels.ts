export const userRoleLabels: Record<string, string> = {
  user: "ผู้ใช้งาน",
  admin: "ผู้ดูแลระบบ",
  tutor: "ผู้สอน",
};

export const userStatusLabels: Record<string, string> = {
  active: "ใช้งานอยู่",
  suspended: "ระงับชั่วคราว",
  disabled: "ปิดใช้งาน",
};

export const accessLogEventLabels: Record<string, string> = {
  login_success: "เข้าสู่ระบบสำเร็จ",
  login_failed: "เข้าสู่ระบบไม่สำเร็จ",
  logout: "ออกจากระบบ",
  oauth_login_success: "เข้าสู่ระบบด้วย Social สำเร็จ",
  oauth_login_failed: "เข้าสู่ระบบด้วย Social ไม่สำเร็จ",
  account_suspended_login_blocked: "บัญชีถูกระงับ",
};

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("th-TH");
}
