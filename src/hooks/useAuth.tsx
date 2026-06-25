"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiGet, apiPost } from "@/lib/api";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  persistAuth,
} from "@/lib/auth";
import type {
  AuthContextValue,
  AuthUser,
  LoginResponse,
  RegisterInput,
} from "@/lib/types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      const me = await apiGet<AuthUser>("/auth/me", true, true);
      setUser(me);
      setToken(storedToken);
      persistAuth(storedToken, me);
    } catch {
      clearAuth();
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) setUser(storedUser);
      refreshMe().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiPost<LoginResponse>("/auth/login", { email, password });
    persistAuth(result.access_token, result.user);
    setToken(result.access_token);
    setUser(result.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await apiPost<Partial<LoginResponse>>("/auth/register", {
      display_name: input.display_name,
      email: input.email,
      password: input.password,
    });

    if (result.access_token && result.user) {
      persistAuth(result.access_token, result.user);
      setToken(result.access_token);
      setUser(result.user);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, token, loading, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
