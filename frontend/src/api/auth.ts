import { apiFetch, setToken } from './client';

type AuthResponse = { accessToken: string };

// Trimite email + parola; daca sunt corecte, salveaza token-ul primit
export async function login(email: string, password: string) {
  const { accessToken } = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(accessToken);
}

export type AccountType = 'USER' | 'CLIENT' | 'THERAPIST';

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
  therapistCode?: string; // doar pentru CLIENT
  licenseNumber?: string; // doar pentru THERAPIST
};

// Creeaza contul; backend-ul raspunde cu un token, ca la login
export async function register(data: RegisterData) {
  const { accessToken } = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setToken(accessToken);
}

export type Me = {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'CLIENT' | 'THERAPIST' | 'ADMIN';
  therapistStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  inviteCode: string | null;
};

// Cine sunt eu, dupa token
export function getMe() {
  return apiFetch<Me>('/me');
}

export function logout() {
  setToken(null);
}