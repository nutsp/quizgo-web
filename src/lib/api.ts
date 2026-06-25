import { clearAuth, getStoredToken } from "./auth";
import type { ApiErrorBody } from "./types";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
  silent401?: boolean;
};

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
}

function parseSuccessBody<T>(json: unknown): T {
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    (json as { data: unknown }).data !== undefined
  ) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export function toUserFriendlyError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "INVALID_CREDENTIALS") {
      return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    }
    if (error.status === 401) {
      return "กรุณาเข้าสู่ระบบก่อนใช้งาน";
    }
    if (error.message) return error.message;
  }

  if (error instanceof TypeError) {
    return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
  }

  return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  clearAuth();
  const path = window.location.pathname + window.location.search;
  if (path.startsWith("/login") || path.startsWith("/register")) return;
  window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, silent401 = false, headers, ...rest } = options;

  const reqHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getStoredToken();
    if (token) {
      (reqHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(`${getBaseUrl()}${path}`, {
      ...rest,
      headers: reqHeaders,
    });
  } catch {
    throw new ApiError("NETWORK_ERROR", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", 0);
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const err = json as ApiErrorBody | null;
    const apiError = new ApiError(
      err?.error?.code ?? "UNKNOWN",
      err?.error?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      res.status
    );

    if (res.status === 401 && auth && !silent401) {
      redirectToLogin();
    }

    throw apiError;
  }

  return parseSuccessBody<T>(json);
}

export function apiGet<T>(path: string, auth = false, silent401 = false) {
  return request<T>(path, { method: "GET", auth, silent401 });
}

export function apiPost<T>(path: string, body?: unknown, auth = false) {
  return request<T>(path, {
    method: "POST",
    auth,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiPut<T>(path: string, body?: unknown, auth = true) {
  return request<T>(path, {
    method: "PUT",
    auth,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T>(path: string, auth = true) {
  return request<T>(path, { method: "DELETE", auth });
}

/** @deprecated Use apiGet/apiPost from this module directly */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, method = "GET", body, ...rest } = options;
  return request<T>(path, { method, auth, body, ...rest });
}
