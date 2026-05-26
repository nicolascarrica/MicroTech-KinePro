const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // 1. Armamos los headers base
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 2. Buscamos el token en el LocalStorage en el momento exacto de la petición
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kinepro_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // ¡Acá se inyecta la llave!
    }
  }
  const finalHeaders = {
    ...headers,
    ...options?.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: finalHeaders, 
  });

  const data = await res.json().catch(() => null);
  
  if (!res.ok) {
    const msg = data?.message ?? `Error ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
  }
  
  return data as T;
}