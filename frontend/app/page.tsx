"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function HomePage() {
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("demo@oftalmoapp.com");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/patients");
  }, [router, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.replace("/patients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    }
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 22px" }}>
      <div style={{ display: "grid", gap: 28, gridTemplateColumns: "1.1fr 0.9fr", alignItems: "stretch" }}>
        <section className="card fade-in" style={{ padding: "36px 32px" }}>
          <p style={{ color: "#a5b4fc", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0 }}>
            Oftalmología
          </p>
          <h1 style={{ margin: "8px 0 14px", fontSize: 34, letterSpacing: "-0.02em" }}>
            Historia clínica, notas y métricas en un solo panel.
          </h1>
          <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
            Administra pacientes, registra consultas y guarda métricas visuales de forma segura. Construimos una
            interfaz rápida para el día a día en consultorio.
          </p>
          <ul style={{ marginTop: 18, color: "#cbd5e1", lineHeight: 1.7, paddingLeft: 18 }}>
            <li>Lista y busca pacientes con filtros en vivo.</li>
            <li>Registra consultas: AV, PIO, examen, diagnóstico y plan.</li>
            <li>Sesiones seguras con JWT y refresco automático.</li>
          </ul>
          <div
            style={{
              marginTop: 26,
              display: "inline-flex",
              gap: 10,
              padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13
            }}
          >
            <span style={{ color: "#a5b4fc" }}>Demo:</span> demo@oftalmoapp.com / admin1234
          </div>
        </section>

        <section className="glass fade-in" style={{ padding: "32px 30px", borderRadius: 18 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 24 }}>Ingresar al consultorio</h2>
          <p style={{ margin: "0 0 20px", color: "var(--muted)" }}>
            Usa las credenciales del admin o crea usuarios desde el backend.
          </p>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Correo</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@tuclinica.com"
                className="glass"
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)"
                }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Contraseña</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="········"
                className="glass"
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)"
                }}
              />
            </label>
            {error ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "#fef2f2",
                  border: "1px solid #fecdd3",
                  color: "#991b1b"
                }}
              >
                {error}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "12px 16px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                background: "linear-gradient(120deg, #7c3aed, #06b6d4)",
                color: "#fff",
                boxShadow: "0 12px 30px rgba(124,58,237,0.28)"
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
