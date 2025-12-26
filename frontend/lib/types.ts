export type Tokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
};

export type Patient = {
  id: number;
  national_id: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  phone: string;
  notes: string;
};

export type PatientPayload = {
  national_id?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string | null;
  phone?: string;
  notes?: string;
};

export type Encounter = {
  id: number;
  patient_id: number;
  created_at: string;
  chief_complaint: string;
  hpi: string;
  exam: string;
  diagnosis: string;
  plan: string;
  va_od: string;
  va_os: string;
  iop_od: string;
  iop_os: string;
};

export type EncounterPayload = {
  chief_complaint?: string;
  hpi?: string;
  exam?: string;
  diagnosis?: string;
  plan?: string;
  va_od?: string;
  va_os?: string;
  iop_od?: string;
  iop_os?: string;
};

export type Appointment = {
  id: number;
  title: string;
  specialist: string;
  location: string;
  start_at: string;
  end_at: string;
  status: string;
  type: string;
  channel: string;
  tags: string[];
  notes: string;
  patient_id: number | null;
  online: boolean;
};

export type AppointmentPayload = {
  id?: number;
  title: string;
  specialist: string;
  location: string;
  start_at: string;
  end_at: string;
  status?: string;
  type?: string;
  channel?: string;
  tags?: string[];
  notes?: string;
  patient_id?: number | null;
  online?: boolean;
};
