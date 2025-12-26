"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header
      className="glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        margin: "0 auto 20px",
        borderRadius: 18,
        padding: "14px 18px",
        maxWidth: 1200,
        display: "flex",
        alignItems: "center",
        gap: 16
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontWeight: 700,
          letterSpacing: "-0.01em"
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontSize: 18
          }}
        >
          👁️
        </div>
        <Link href="/patients" style={{ color: "#0f172a", textDecoration: "none" }}>
          OftalmoApp
        </Link>
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <>
            <div
              style={{
                padding: "8px 12px",
                background: "#0f172a",
                color: "#e2e8f0",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14
              }}
            >
              {user.full_name || user.email} · {user.role}
            </div>
            <button
              onClick={logout}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.08)",
                cursor: "pointer",
                background: "#f9fafb",
                fontWeight: 600
              }}
            >
              Salir
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
