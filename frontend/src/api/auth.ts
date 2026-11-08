import { apiFetch, setToken } from './client';

type AuthResponse = { accessToken: string };

export type Me = {
  id: string;
  role: 'USER' | 'THERAPIST' | 'ADMIN';
};

// Trimite email + parola; daca sunt corecte, salveaza token-ul primit
export async function login(email: string, password: string) {
  const { accessToken } = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(accessToken);
}

// Cine sunt eu, dupa token
export function getMe() {
  return apiFetch<Me>('/me');
}

export function logout() {
  setToken(null);
}