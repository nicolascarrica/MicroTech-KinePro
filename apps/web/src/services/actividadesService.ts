import type { Actividad, ActividadInput } from '@/types/actividad'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
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

export async function getActividades(): Promise<Actividad[]> {
  return request<Actividad[]>('/actividades')
}

export async function crearActividad(input: ActividadInput): Promise<{ message: string }> {
  return request('/actividades', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function modificarActividad(id: number, input: ActividadInput): Promise<{ message: string }> {
  return request(`/actividades/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function eliminarActividad(id: number): Promise<{ message: string }> {
  return request(`/actividades/${id}`, { method: 'DELETE' })
}