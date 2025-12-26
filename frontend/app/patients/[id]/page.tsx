"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "../../../components/AuthGuard";
import NavBar from "../../../components/NavBar";
import PatientForm from "../../../components/PatientForm";
import EncounterForm from "../../../components/EncounterForm";
import { createEncounter, fetchEncounters, fetchPatient, updatePatient } from "../../../lib/api";
import { Encounter, Patient } from "../../../lib/types";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subtitle = useMemo(() => {
    if (!patient) return "";
    const birth = patient.birth_date ? new Date(patient.birth_date) : null;
    const age =
      birth && !Number.isNaN(birth.getTime())
        ? Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null;
    return `${patient.national_id || "Sin documento"} · ${age !== null ? `${age} años` : "Edad n/d"}`;
  }, [patient]);

  const loadData = async () => {
    setError(null);
    setLoading(true);
    if (Number.isNaN(patientId)) {
      setError("El identificador del paciente no es válido.");
      setLoading(false);
      return;
    }
    try {
      const [p, e] = await Promise.all([fetchPatient(patientId), fetchEncounters(patientId)]);
      setPatient(p);
      setEncounters(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el paciente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleUpdate = async (payload: any) => {
    if (!patient) return;
    try {
      const updated = await updatePatient(patient.id, {
        ...payload,
        birth_date: payload.birth_date || null
      });
      setPatient(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el paciente");
    }
  };

  const handleEncounter = async (payload: any) => {
    setError(null);
    try {
      const created = await createEncounter(patientId, payload);
      setEncounters((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la consulta");
    }
  };

  if (Number.isNaN(patientId)) {
    return (
      <AuthGuard>
        <NavBar />
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px 32px" }}>
          <p>El identificador del paciente no es válido.</p>
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <NavBar />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px 32px" }}>
        {loading ? (
          <p>Cargando paciente...</p>
        ) : patient ? (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.05fr 0.95fr" }}>
            <section className="glass fade-in" style={{ padding: "22px", borderRadius: 18 }}>
              <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "#0f172a",
                    color: "#e2e8f0",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700
                  }}
                >
                  🧑‍⚕️
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>
                    {patient.last_name}, {patient.first_name}
                  </p>
                  <small style={{ color: "var(--muted)" }}>{subtitle}</small>
                </div>
                <div style={{ marginLeft: "auto", padding: "8px 12px", borderRadius: 12, background: "#0f172a", color: "#e2e8f0" }}>
                  {encounters.length} consultas
                </div>
              </header>
              <PatientForm
                onSubmit={handleUpdate}
                initial={{
                  national_id: patient.national_id,
                  first_name: patient.first_name,
                  last_name: patient.last_name,
                  birth_date: patient.birth_date || "",
                  phone: patient.phone,
                  notes: patient.notes
                }}
                cta="Actualizar ficha"
              />
            </section>

            <section style={{ display: "grid", gap: 12 }}>
              <div className="glass fade-in" style={{ padding: "18px", borderRadius: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Registrar consulta</p>
                    <small style={{ color: "var(--muted)" }}>Guarda AV, PIO, examen y plan en el historial.</small>
                  </div>
                  <div style={{ padding: "6px 10px", borderRadius: 10, background: "#0f172a", color: "#e2e8f0" }}>
                    #{patient.id}
                  </div>
                </div>
                <EncounterForm onSubmit={handleEncounter} />
              </div>

              <div className="glass fade-in" style={{ padding: "18px", borderRadius: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>Historial de consultas</p>
                  <small style={{ color: "var(--muted)" }}>{encounters.length} registros</small>
                </div>
                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  {encounters.length === 0 ? (
                    <p style={{ margin: 0 }}>Aún no hay consultas.</p>
                  ) : (
                    encounters.map((e) => (
                      <article
                        key={e.id}
                        className="glass"
                        style={{
                          padding: "12px 14px",
                          borderRadius: 14,
                          border: "1px solid var(--border)",
                          background: "#fff",
                          display: "grid",
                          gap: 8
                        }}
                      >
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <div style={{ padding: "6px 10px", borderRadius: 10, background: "#0f172a", color: "#e2e8f0", fontWeight: 700 }}>
                            {new Date(e.created_at).toLocaleDateString()}
                          </div>
                          <small style={{ color: "var(--muted)" }}>
                            VA: {e.va_od || "n/d"} OD · {e.va_os || "n/d"} OS · PIO: {e.iop_od || "n/d"}/{e.iop_os || "n/d"}
                          </small>
                        </div>
                        <Row label="Motivo" value={e.chief_complaint} />
                        <Row label="Evolución" value={e.hpi} />
                        <Row label="Examen" value={e.exam} />
                        <Row label="Diagnóstico" value={e.diagnosis} />
                        <Row label="Plan" value={e.plan} />
                      </article>
                    ))
                  )}
                </div>
              </div>

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
            </section>
          </div>
        ) : (
          <p>No encontramos al paciente.</p>
        )}
      </main>
    </AuthGuard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <small style={{ color: "var(--muted)", fontWeight: 700 }}>{label}</small>
      <p style={{ margin: 0, lineHeight: 1.5 }}>{value || "Sin datos"}</p>
    </div>
  );
}
