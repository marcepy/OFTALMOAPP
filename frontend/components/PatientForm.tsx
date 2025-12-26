"use client";

import { FormEvent, useState } from "react";
import { PatientPayload } from "../lib/types";

type Props = {
  onSubmit: (payload: PatientPayload) => Promise<void> | void;
  initial?: PatientPayload;
  cta?: string;
};

const empty: PatientPayload = {
  national_id: "",
  first_name: "",
  last_name: "",
  birth_date: "",
  phone: "",
  notes: ""
};

export default function PatientForm({ onSubmit, initial, cta = "Guardar paciente" }: Props) {
  const [values, setValues] = useState<PatientPayload>({ ...empty, ...initial });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
      if (!initial) setValues(empty);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>Nombre</span>
          <input
            required
            value={values.first_name || ""}
            onChange={(e) => setValues({ ...values, first_name: e.target.value })}
            placeholder="Ej. Juan"
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>Apellido</span>
          <input
            required
            value={values.last_name || ""}
            onChange={(e) => setValues({ ...values, last_name: e.target.value })}
            placeholder="Ej. Pérez"
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>Documento</span>
          <input
            value={values.national_id || ""}
            onChange={(e) => setValues({ ...values, national_id: e.target.value })}
            placeholder="DNI / Pasaporte"
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>Nacimiento</span>
          <input
            type="date"
            value={values.birth_date || ""}
            onChange={(e) => setValues({ ...values, birth_date: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>Teléfono</span>
          <input
            value={values.phone || ""}
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
            placeholder="+54 9 ..."
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </label>
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 600, color: "#0f172a" }}>Notas</span>
        <textarea
          value={values.notes || ""}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
          rows={3}
          placeholder="Alergias, antecedentes, contacto de emergencia..."
          className="glass"
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            resize: "vertical"
          }}
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
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
        {submitting ? "Guardando..." : cta}
      </button>
    </form>
  );
}
