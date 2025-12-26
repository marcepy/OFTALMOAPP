"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import AuthGuard from "../../components/AuthGuard";
import NavBar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import { Appointment, Patient } from "../../lib/types";
import { createAppointment, fetchAppointments, updateAppointment, createPatient, deleteAppointment } from "../../lib/api";

type Event = {
  id?: number;
  title: string;
  specialist: string;
  location: string;
  start: Date;
  end: Date;
  status?: string;
  notes?: string;
  tags?: string[];
  type?: string;
  channel?: string;
  online?: boolean;
  patient_id?: number | null;
};

const specialists = ["Marcelo Martinez", "Administrador"];
const locations = ["Consultorio 1", "Consultorio 2"];

export default function SchedulesPage() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<Partial<Event>>(newDraft());
  const [showPatientModal, setShowPatientModal] = useState(false);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const hours = useMemo(() => Array.from({ length: 10 }, (_, i) => 8 + i), []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAppointments(weekStart, addDays(weekStart, 7));
        setEvents(
          data.map((a) => ({
            id: a.id,
            title: a.title,
            specialist: a.specialist,
            location: a.location,
            start: new Date(a.start_at),
            end: new Date(a.end_at),
            status: a.status,
            notes: a.notes,
            tags: a.tags,
            type: a.type,
            channel: a.channel,
            online: a.online,
            patient_id: a.patient_id
          }))
        );
      } catch (err) {
        console.error("No se pudieron cargar citas", err);
      }
    };
    load();
  }, [weekStart]);

  const findEvent = (day: Date, hour: number): Event | null => {
    const start = withTime(day, hour, 0);
    return events.find((ev) => sameDay(ev.start, day) && ev.start.getHours() === start.getHours()) || null;
  };

  return (
    <AuthGuard>
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px 32px", display: "flex", gap: 18 }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <NavBar />

          <header style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, color: "var(--muted)", fontWeight: 700 }}>Horarios</p>
              <h2 style={{ margin: "4px 0 0" }}>Semana del {formatDate(weekStart)}</h2>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setWeekStart(addDays(weekStart, -7))}
                className="glass"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer" }}
              >
                ← Semana previa
              </button>
              <button
                onClick={() => setWeekStart(startOfWeek(new Date()))}
                className="glass"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer" }}
              >
                Hoy
              </button>
              <button
                onClick={() => setWeekStart(addDays(weekStart, 7))}
                className="glass"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", cursor: "pointer" }}
              >
                Semana siguiente →
              </button>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  background: "linear-gradient(120deg, #0ea5e9, #22c55e)",
                  color: "#fff"
                }}
              >
                + Agendar cita
              </button>
            </div>
          </header>

          <section className="glass" style={{ borderRadius: 18, padding: "8px 12px 12px", overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(7, 1fr)",
                borderBottom: "1px solid var(--border)",
                background: "#f8fafc"
              }}
            >
              <div />
              {weekDays.map((d) => (
                <div key={d.toISOString()} style={{ padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontWeight: 800 }}>{weekdayLabel(d)}</div>
                  <small style={{ color: "var(--muted)" }}>{d.getDate()} {monthShort(d)}</small>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "120px repeat(7, 1fr)" }}>
              {hours.map((h) => (
                <Fragment key={h}>
                  <div style={{ borderRight: "1px solid var(--border)", padding: "12px 6px", fontWeight: 700 }}>{`${pad(h)}:00`}</div>
                  {weekDays.map((d) => {
                    const ev = findEvent(d, h);
                    return (
                      <div
                        key={d.toISOString() + h}
                        style={{
                          borderRight: "1px solid var(--border)",
                          borderBottom: "1px solid var(--border)",
                          minHeight: 68,
                          padding: "8px 6px",
                          background: ev ? "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)" : "#fff",
                          color: ev ? "#0f172a" : "#0f172a",
                          cursor: "pointer"
                        }}
            onClick={() => {
              if (ev) {
                setDraft({ ...ev });
              } else {
                const start = withTime(d, h, 0);
                setDraft({
                  ...newDraft(),
                  start,
                  end: addMinutes(start, 30)
                });
              }
              setShowModal(true);
            }}
          >
            {ev ? (
              <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "8px 10px" }}>
                <div style={{ fontWeight: 800 }}>{ev.title}</div>
                <small>{ev.specialist} · {ev.location}</small>
                            {ev.notes ? <div style={{ fontSize: 12, color: "#334155" }}>{ev.notes}</div> : null}
                          </div>
                        ) : (
                          <small style={{ color: "var(--muted)" }}>Disponible</small>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </section>
        </div>
      </main>

      {showModal ? (
        <Modal onClose={() => setShowModal(false)}>
          <AppointmentForm
            draft={draft}
            onChange={setDraft}
            onClose={() => setShowModal(false)}
            onNewPatient={() => setShowPatientModal(true)}
            onSave={(payload) => {
              if ((payload as any).cancel && payload.id) {
                const ok = window.confirm("¿Cancelar esta cita? Esta acción no se puede deshacer.");
                if (!ok) return;
                deleteAppointment(payload.id)
                  .then(() => {
                    setEvents((prev) => prev.filter((e) => e.id !== payload.id));
                    setShowModal(false);
                  })
                  .catch((err) => console.error("No se pudo cancelar la cita", err));
                return;
              }
              if (!payload.start || !payload.end || !payload.title) return;
              const body = {
                title: payload.title,
                specialist: payload.specialist || specialists[0],
                location: payload.location || locations[0],
                start_at: payload.start.toISOString(),
                end_at: payload.end.toISOString(),
                status: payload.status || "",
                notes: payload.notes || "",
                tags: payload.tags || [],
                type: payload.type || "",
                channel: payload.channel || "",
                online: Boolean(payload.online),
                patient_id: payload.patient_id ?? null
              };

              const save = async () => {
                if (payload.id) {
                  const updated = await updateAppointment(payload.id, body);
                  setEvents((prev) =>
                    prev.map((e) =>
                      e.id === payload.id
                        ? {
                            ...e,
                            title: updated.title,
                            specialist: updated.specialist,
                            location: updated.location,
                            start: new Date(updated.start_at),
                            end: new Date(updated.end_at),
                            status: updated.status,
                            notes: updated.notes,
                            tags: updated.tags,
                            type: updated.type,
                            channel: updated.channel,
                            online: updated.online,
                            patient_id: updated.patient_id
                          }
                        : e
                    )
                  );
                } else {
                  const created = await createAppointment(body);
                  setEvents((prev) => [
                    ...prev,
                    {
                      id: created.id,
                      title: created.title,
                      specialist: created.specialist,
                      location: created.location,
                      start: new Date(created.start_at),
                      end: new Date(created.end_at),
                      status: created.status,
                      notes: created.notes,
                      tags: created.tags,
                      type: created.type,
                      channel: created.channel,
                      online: created.online,
                      patient_id: created.patient_id
                    }
                  ]);
                }
                setShowModal(false);
              };

              save().catch((err) => {
                console.error("No se pudo guardar la cita", err);
              });
            }}
          />
        </Modal>
      ) : null}
      {showPatientModal ? (
        <Modal onClose={() => setShowPatientModal(false)}>
          <PatientModal
            onClose={() => setShowPatientModal(false)}
            onCreated={(p) => {
              setDraft((prev) => ({ ...prev, patient_id: p.id, title: `${p.first_name} ${p.last_name}` }));
              setShowPatientModal(false);
            }}
          />
        </Modal>
      ) : null}
    </AuthGuard>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 12
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(920px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(15,23,42,0.45)",
          padding: "20px 22px"
        }}
      >
        {children}
      </div>
    </div>
  );
}

function AppointmentForm({
  draft,
  onChange,
  onClose,
  onSave,
  onNewPatient
}: {
  draft: Partial<Event>;
  onChange: (d: Partial<Event>) => void;
  onClose: () => void;
  onSave: (d: Partial<Event>) => void;
  onNewPatient: () => void;
}) {
  const durations = [5, 10, 15, 20, 30, 40, 45, 50, 60, 90, 120];
  const statuses = ["Se requiere confirmación", "Confirmado", "Ausencia del paciente"];
  const types = ["Primera cita", "Visita de control"];
  const channels = ["Cita Online", "Redes sociales", "Búsqueda en Google", "Paciente de paso", "Derivación médica", "Recomendación"];
  const tags = ["Consulta", "Familia referida", "Prioridad"];

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Agregar cita</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>
          ×
        </button>
      </header>
      <div style={{ display: "grid", gap: 14 }}>
        <Labeled label="Especialista">
          <select
            value={draft.specialist || ""}
            onChange={(e) => onChange({ ...draft, specialist: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          >
            {specialists.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Fecha y hora">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="datetime-local"
              value={draft.start ? toLocalInput(draft.start) : ""}
              onChange={(e) => {
                const start = parseLocalInput(e.target.value);
                if (!start) return;
                const end = draft.end || addMinutes(start, 30);
                onChange({ ...draft, start, end });
              }}
              className="glass"
              style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
            />
            <input
              type="datetime-local"
              value={draft.end ? toLocalInput(draft.end) : ""}
              onChange={(e) => {
                const end = parseLocalInput(e.target.value);
                if (!end) return;
                onChange({ ...draft, end });
              }}
              className="glass"
              style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
            />
          </div>
        </Labeled>

        <Labeled label="Paciente">
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Apellidos, documento o teléfono"
              value={draft.title || ""}
              onChange={(e) => onChange({ ...draft, title: e.target.value })}
              className="glass"
              style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)", flex: 1 }}
            />
            <button
              type="button"
              onClick={onNewPatient}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                cursor: "pointer",
                background: "#0f172a",
                color: "#e2e8f0",
                fontWeight: 700,
                minWidth: 100
              }}
            >
              + Nuevo
            </button>
          </div>
        </Labeled>

        <Labeled label="Motivo de la consulta">
          <textarea
            placeholder="Ej. Control post-op, refracción, urgencia..."
            value={draft.notes || ""}
            onChange={(e) => onChange({ ...draft, notes: e.target.value })}
            rows={3}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)", resize: "vertical" }}
          />
        </Labeled>

        <Labeled label="Estado">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statuses.map((s) => (
              <ColorChip key={s} active={draft.status === s} label={s} onClick={() => onChange({ ...draft, status: s })} color={chipColor(s)} />
            ))}
          </div>
        </Labeled>

        <Labeled label="Duración">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {durations.map((d) => (
              <Chip
                key={d}
                active={durationEquals(draft.start, draft.end, d)}
                label={`${d}'`}
                onClick={() => {
                  if (!draft.start) return;
                  onChange({ ...draft, end: addMinutes(draft.start, d) });
                }}
              />
            ))}
          </div>
        </Labeled>

        <Labeled label="Tipo de cita">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {types.map((t) => (
              <ColorChip key={t} active={draft.type === t} label={t} onClick={() => onChange({ ...draft, type: t })} color="#1e3b5f" />
            ))}
          </div>
        </Labeled>

        <Labeled label="Consulta en línea">
          <Toggle
            active={Boolean(draft.online)}
            onToggle={() => onChange({ ...draft, online: !draft.online })}
            label={draft.online ? "Sí" : "No"}
          />
        </Labeled>

        <Labeled label="Canal de atracción">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {channels.map((c) => (
              <ColorChip
                key={c}
                active={draft.channel === c}
                label={c}
                onClick={() => onChange({ ...draft, channel: c })}
                color={chipColor(c)}
              />
            ))}
          </div>
        </Labeled>

        <Labeled label="Etiquetas">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tags.map((c) => (
              <ColorChip
                key={c}
                active={draft.tags?.includes(c)}
                label={c}
                onClick={() => {
                  const set = new Set(draft.tags || []);
                  if (set.has(c)) set.delete(c);
                  else set.add(c);
                  onChange({ ...draft, tags: Array.from(set) });
                }}
                color={chipColor(c)}
              />
            ))}
          </div>
        </Labeled>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
          {draft.id ? (
            <button
              onClick={() => onSave({ id: draft.id, cancel: true } as any)}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #dc2626",
                cursor: "pointer",
                color: "#b91c1c",
                background: "#fef2f2",
                fontWeight: 700
              }}
            >
              Cancelar cita
            </button>
          ) : null}
          <button onClick={onClose} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", cursor: "pointer" }}>
            Cancelar
          </button>
          <button
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background: "linear-gradient(120deg, #22c55e, #16a34a)",
              color: "#fff"
            }}
            onClick={() => onSave(draft)}
          >
            Iniciar la cita
          </button>
          <button
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background: "linear-gradient(120deg, #0f172a, #1e293b)",
              color: "#fff"
            }}
            onClick={() => onSave(draft)}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 700, color: "#0f172a" }}>{label}</span>
      {children}
    </label>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: active ? "1px solid #0ea5e9" : "1px solid var(--border)",
        background: active ? "#e0f2fe" : "#f8fafc",
        color: "#0f172a",
        cursor: onClick ? "pointer" : "default",
        fontWeight: 700
      }}
    >
      {label}
    </button>
  );
}

function ColorChip({ label, active, color, onClick }: { label: string; active: boolean; color: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: active ? `1px solid ${color}` : "1px solid var(--border)",
        background: active ? `${color}1a` : "#f8fafc",
        color: "#0f172a",
        cursor: onClick ? "pointer" : "default",
        fontWeight: 700
      }}
    >
      {label}
    </button>
  );
}

function Toggle({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 12,
        border: active ? "1px solid #22c55e" : "1px solid #dc2626",
        background: active ? "#dcfce7" : "#fee2e2",
        color: active ? "#166534" : "#b91c1c",
        fontWeight: 700,
        cursor: "pointer"
      }}
    >
      <span
        style={{
          width: 28,
          height: 16,
          borderRadius: 999,
          background: active ? "#22c55e" : "#e5e7eb",
          position: "relative",
          transition: "all 0.2s ease"
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -2,
            left: active ? 14 : 0,
            width: 20,
            height: 20,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease"
          }}
        />
      </span>
      {label}
    </button>
  );
}

function PatientModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Patient) => void }) {
  const [form, setForm] = useState<Partial<Patient>>({
    first_name: "",
    last_name: "",
    national_id: "",
    phone: "",
    birth_date: ""
  });
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    if (!form.first_name || !form.last_name) return;
    setSaving(true);
    try {
      const payload = {
        national_id: form.national_id || "",
        first_name: form.first_name,
        last_name: form.last_name,
        birth_date: form.birth_date || null,
        phone: form.phone || "",
        notes: ""
      };
      const p = await createPatient(payload);
      onCreated(p);
    } catch (err) {
      console.error("No se pudo crear el paciente", err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Agregar paciente</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>
          ×
        </button>
      </header>
      <div style={{ display: "grid", gap: 12 }}>
        <Labeled label="Nombre">
          <input
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
            required
          />
        </Labeled>
        <Labeled label="Apellido">
          <input
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
            required
          />
        </Labeled>
        <Labeled label="Documento">
          <input
            value={form.national_id}
            onChange={(e) => setForm({ ...form, national_id: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </Labeled>
        <Labeled label="Teléfono">
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </Labeled>
        <Labeled label="Fecha de nacimiento">
          <input
            type="date"
            value={form.birth_date || ""}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            className="glass"
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)" }}
          />
        </Labeled>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", cursor: "pointer" }}>
            Cancelar
          </button>
          <button
            disabled={saving}
            onClick={handleSave}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              background: "linear-gradient(120deg, #22c55e, #16a34a)",
              color: "#fff"
            }}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </>
  );
}
// --- utils ---
function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function withTime(date: Date, hours: number, minutes: number) {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(date: Date) {
  return `${weekdayLabel(date)} ${date.getDate()} ${monthShort(date)} ${date.getFullYear()}`;
}

function weekdayLabel(date: Date) {
  return ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"][(date.getDay() + 6) % 7];
}

function monthShort(date: Date) {
  return ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"][date.getMonth()];
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function nextWeekday(date: Date, weekday: number) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (weekday - day + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addMinutes(date: Date, minutes: number) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

function toLocalInput(date: Date) {
  const pad2 = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function parseLocalInput(value: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function newDraft(): Partial<Event> {
  const start = withTime(new Date(), 9, 0);
  return { specialist: specialists[0], location: locations[0], start, end: addMinutes(start, 30), tags: [], online: false };
}

function durationEquals(start?: Date, end?: Date, minutes?: number) {
  if (!start || !end || !minutes) return false;
  return (end.getTime() - start.getTime()) / 60000 === minutes;
}

function chipColor(label: string) {
  const map: Record<string, string> = {
    "Se requiere confirmación": "#c026d3",
    Confirmado: "#4f46e5",
    "Ausencia del paciente": "#d97706",
    "Cita Online": "#2563eb",
    "Redes sociales": "#16a34a",
    "Búsqueda en Google": "#b45309",
    "Paciente de paso": "#b91c1c",
    "Derivación médica": "#a3e635",
    Recomendación: "#d9ad26",
    Consulta: "#c084fc",
    "Familia referida": "#a78bfa",
    Prioridad: "#f97316",
    "Primera cita": "#1e3b5f",
    "Visita de control": "#1e3b5f"
  };
  return map[label] || "#0ea5e9";
}
