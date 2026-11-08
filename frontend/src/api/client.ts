// Clientul pentru API-ul backend-ului. Toate cererile trec prin aici.

const TOKEN_KEY = 'inner-weather:token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // fara localStorage: utilizatorul ramane logat doar pana la refresh
  }
}

// Eroare care tine minte codul HTTP (401, 409, 500...), ca sa aratam mesaje potrivite
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    // nu am ajuns deloc la server
    throw new ApiError(0, 'Cannot reach the server');
  }

  if (!res.ok) throw new ApiError(res.status, res.statusText);

  // unele raspunsuri nu au continut (ex. 204)
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}