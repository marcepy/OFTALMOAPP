"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import NavBar from "../../components/NavBar";
import PatientForm from "../../components/PatientForm";
import { Patient } from "../../lib/types";
import { createPatient, fetchPatients } from "../../lib/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => patients, [patients]);

  const loadPatients = async (q?: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchPatients(q);
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleCreate = async (payload: any) => {
    setError(null);
    try {
      const p = await createPatient({
        ...payload,
        birth_date: payload.birth_date || null
      });
      setPatients((prev) => [p, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el paciente");
    }
  };

  const handleSearch = async () => {
    await loadPatients(search.trim() ? search.trim() : undefined);
  };

  return (
    <AuthGuard>
      <NavBar />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px 32px" }}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.05fr 0.95fr" }}>
          <section className="glass fade-in" style={{ padding: "22px", borderRadius: 18 }}>
            <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "#0f172a",
                  color: "#e2e8f0",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700
                }}
              >
                +
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>Nuevo paciente</p>
                <small style={{ color: "var(--muted)" }}>Completa los datos básicos para crear la ficha.</small>
              </div>
            </header>
            <PatientForm onSubmit={handleCreate} cta="Crear paciente" />
            {error ? (
              <div
                style={{
                  marginTop: 12,
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
          </section>

          <section style={{ display: "grid", gap: 12 }}>
            <div className="glass fade-in" style={{ padding: "18px", borderRadius: 18 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o documento"
                  className="glass"
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--border)"
                  }}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    background: "linear-gradient(120deg, #06b6d4, #7c3aed)",
                    color: "#fff"
                  }}
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="glass fade-in" style={{ padding: "18px", borderRadius: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Pacientes</p>
                  <small style={{ color: "var(--muted)" }}>
                    {loading ? "Cargando..." : `${filteredPatients.length} resultados`}
                  </small>
                </div>
                <div style={{ padding: "6px 10px", borderRadius: 10, background: "#0f172a", color: "#e2e8f0" }}>
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                {loading ? (
                  <p style={{ margin: 0 }}>Cargando pacientes...</p>
                ) : filteredPatients.length === 0 ? (
                  <p style={{ margin: 0 }}>No hay pacientes aún.</p>
                ) : (
                  filteredPatients.map((p) => (
                    <Link
                      key={p.id}
                      href={`/patients/${p.id}`}
                      className="glass"
                      style={{
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "transform 0.15s ease",
                        background: "#fff"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          {p.last_name}, {p.first_name}
                        </div>
                        <small style={{ color: "var(--muted)" }}>
                          {p.national_id || "Sin documento"} · {p.phone || "Sin teléfono"}
                        </small>
                      </div>
                      <div style={{ color: "#7c3aed", fontWeight: 700 }}>Ver</div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
