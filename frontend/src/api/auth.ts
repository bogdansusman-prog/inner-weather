import { apiFetch, getRefreshToken, setRefreshToken, setToken } from './client';

// backend-ul trimite doua token-uri: unul pentru cereri, unul pentru logout / reinnoire
type AuthResponse = { accessToken: string; refreshToken: string };

// salveaza amandoua token-urile primite de la server
function saveTokens({ accessToken, refreshToken }: AuthResponse) {
  setToken(accessToken);
  setRefreshToken(refreshToken);
}

// Trimite email + parola; daca sunt corecte, salveaza token-urile primite
export async function login(email: string, password: string) {
  const tokens = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveTokens(tokens);
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

// Creeaza contul; backend-ul raspunde cu token-uri, ca la login
export async function register(data: RegisterData) {
  const tokens = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  saveTokens(tokens);
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

// Iesire din cont: anuleaza refresh token-ul pe server, apoi sterge totul din browser
export async function logout() {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch {
    // daca serverul nu raspunde, iesim oricum din cont pe acest calculator
  }
  setToken(null);
  setRefreshToken(null);
}