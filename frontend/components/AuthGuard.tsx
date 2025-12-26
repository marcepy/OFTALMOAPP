"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      router.replace("/");
    }
  }, [loading, router, user]);

  if (loading || redirecting) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <div className="glass" style={{ padding: "24px 32px", borderRadius: 14 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
