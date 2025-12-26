"use client";

import { FormEvent, useState } from "react";
import { EncounterPayload } from "../lib/types";

type Props = {
  onSubmit: (payload: EncounterPayload) => Promise<void> | void;
};

const empty: EncounterPayload = {
  chief_complaint: "",
  hpi: "",
  exam: "",
  diagnosis: "",
  plan: "",
  va_od: "",
  va_os: "",
  iop_od: "",
  iop_os: ""
};

export default function EncounterForm({ onSubmit }: Props) {
  const [values, setValues] = useState<EncounterPayload>(empty);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues(empty);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Agudeza OD</span>
          <input
            value={values.va_od || ""}
            onChange={(e) => setValues({ ...values, va_od: e.target.value })}
            placeholder="20/20"
            className="glass"
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Agudeza OS</span>
          <input
            value={values.va_os || ""}
            onChange={(e) => setValues({ ...values, va_os: e.target.value })}
            placeholder="20/20"
            className="glass"
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>PIO OD</span>
          <input
            value={values.iop_od || ""}
            onChange={(e) => setValues({ ...values, iop_od: e.target.value })}
            placeholder="12 mmHg"
            className="glass"
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>PIO OS</span>
          <input
            value={values.iop_os || ""}
            onChange={(e) => setValues({ ...values, iop_os: e.target.value })}
            placeholder="12 mmHg"
            className="glass"
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)" }}
          />
        </label>
      </div>

      {[
        ["chief_complaint", "Motivo de consulta", "Ojo rojo, control, dolor..."],
        ["hpi", "Evolución", "Tiempo, tratamientos previos, síntomas asociados"],
        ["exam", "Examen", "Segmento anterior, fondo de ojo, biomicroscopía"],
        ["diagnosis", "Diagnóstico", "Impresión clínica o CIE10"],
        ["plan", "Plan", "Indicaciones, interconsultas, estudios"]
      ].map(([key, label, placeholder]) => (
        <label key={key} style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>{label}</span>
          <textarea
            value={(values as any)[key] || ""}
            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            placeholder={placeholder}
            rows={key === "chief_complaint" ? 2 : 3}
            className="glass"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              resize: "vertical"
            }}
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: 6,
          padding: "12px 16px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
          background: "linear-gradient(120deg, #06b6d4, #7c3aed)",
          color: "#fff",
          boxShadow: "0 12px 30px rgba(6,182,212,0.28)"
        }}
      >
        {submitting ? "Guardando..." : "Agregar consulta"}
      </button>
    </form>
  );
}
