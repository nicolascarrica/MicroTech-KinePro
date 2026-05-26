const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

async function requestTurno<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message ?? `Error ${res.status}`
    throw new Error(Array.isArray(msg) ? msg.join(', ') : msg)
  }
  return data as T
}


