"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loginRequest, saveTokens, clearTokens, hasTokens } from "../lib/auth";
import { fetchCurrentUser } from "../lib/api";
import { User } from "../lib/types";

type AuthContextState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    if (!hasTokens()) {
      setLoading(false);
      return;
    }
    try {
      const me = await fetchCurrentUser();
      setUser(me);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const tokens = await loginRequest(email, password);
      saveTokens(tokens);
      const me = await fetchCurrentUser();
      setUser(me);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
