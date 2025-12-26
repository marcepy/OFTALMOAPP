"use client";

import { API_URL, clearTokens, getAccessToken, refreshTokens } from "./auth";
import { Encounter, EncounterPayload, Patient, PatientPayload, Tokens, User } from "./types";

async function parseError(res: Response) {
  try {
    const data = await res.json();
    if (data?.detail) return Array.isArray(data.detail) ? data.detail[0].msg || res.statusText : data.detail;
    if (data?.message) return data.message;
  } catch (_) {
    const text = await res.text();
    if (text) return text;
  }
  return res.statusText || "Error desconocido";
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const buildHeaders = (token?: string) => {
    const headers = new Headers(init.headers || {});
    if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  };

  const doRequest = async (token?: string) =>
    fetch(url, {
      ...init,
      headers: buildHeaders(token)
    });

  let access = getAccessToken();
  let res = await doRequest(access || undefined);

  if (res.status === 401) {
    try {
      const tokens: Tokens = await refreshTokens();
      access = tokens.access_token;
      res = await doRequest(access);
    } catch (_) {
      clearTokens();
      throw new Error("Sesión expirada, vuelve a iniciar.");
    }
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const fetchCurrentUser = () => apiFetch<User>("/me");

export const fetchPatients = (q?: string) =>
  apiFetch<Patient[]>(q ? `/patients?q=${encodeURIComponent(q)}` : "/patients");

export const createPatient = (payload: PatientPayload) =>
  apiFetch<Patient>("/patients", { method: "POST", body: JSON.stringify(payload) });

export const updatePatient = (id: number, payload: PatientPayload) =>
  apiFetch<Patient>(`/patients/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const fetchPatient = (id: number) => apiFetch<Patient>(`/patients/${id}`);

export const fetchEncounters = (patientId: number) =>
  apiFetch<Encounter[]>(`/patients/${patientId}/encounters`);

export const createEncounter = (patientId: number, payload: EncounterPayload) =>
  apiFetch<Encounter>(`/patients/${patientId}/encounters`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
