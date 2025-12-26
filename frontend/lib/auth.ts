"use client";

import { Tokens } from "./types";

const ACCESS_KEY = "ofta_access";
const REFRESH_KEY = "ofta_refresh";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_KEY);
};

export const saveTokens = (tokens: Tokens) => {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
};

export const clearTokens = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const hasTokens = () => Boolean(getAccessToken() && getRefreshToken());

export async function loginRequest(email: string, password: string): Promise<Tokens> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "No se pudo iniciar sesión");
  }

  return res.json();
}

export async function refreshTokens(): Promise<Tokens> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error("No hay refresh token");
  }

  const res = await fetch(`${API_URL}/auth/refresh?refresh_token=${encodeURIComponent(refresh)}`, {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error("No se pudo refrescar la sesión");
  }

  const tokens: Tokens = await res.json();
  saveTokens(tokens);
  return tokens;
}
