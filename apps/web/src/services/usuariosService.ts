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

export async function modificarContrasena(payload: {
  email: string
  passwordActual: string
  passwordNueva: string
}): Promise<{ message: string }> {
  return request('/usuarios/modificarcontraseña', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function solicitarRestablecimiento(email: string): Promise<{ message: string }> {
  return request('/usuarios/llamadarestablecimiento', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  })
}

export async function restablecerContrasena(payload: {
  token: string
  passwordNueva: string
}): Promise<{ message: string }> {
  return request('/usuarios/restablecimiento', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function desbloquearCuenta(token: string): Promise<{ message: string }> {
  return request('/usuarios/desbloqueo', {
    method: 'PUT',
    body: JSON.stringify({ token }),
  })
}

export async function modificarDatosPersonales(payload: {
  id: number
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  dni?: string
}): Promise<{ message: string }> {
  return request('/usuarios/modificacion', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
