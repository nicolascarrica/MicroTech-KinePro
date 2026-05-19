import { apiFetch } from '@/lib/api'
import type { TurnoDetalle, TurnoResumen } from '@/types/turno'

// --- Mock data: eliminar cuando la API esté lista ---
const MOCK_TURNOS: TurnoResumen[] = [
  {
    id: 1,
    horario: '09:00',
    actividad: 'Kinesiología General',
    estado: 'DISPONIBLE',
    capacidad: 5,
    reservasActuales: 2,
    espaciosLibres: 3,
  },
  {
    id: 2,
    horario: '10:30',
    actividad: 'Rehabilitación Deportiva',
    estado: 'DISPONIBLE',
    capacidad: 3,
    reservasActuales: 3,
    espaciosLibres: 0,
  },
  {
    id: 3,
    horario: '12:00',
    actividad: 'Masoterapia',
    estado: 'CANCELADO',
    capacidad: 4,
    reservasActuales: 0,
    espaciosLibres: 0,
  },
  {
    id: 4,
    horario: '14:00',
    actividad: 'Hidroterapia',
    estado: 'DISPONIBLE',
    capacidad: 6,
    reservasActuales: 1,
    espaciosLibres: 5,
  },
]
// --- Fin mock data ---

export async function getTurnosByFecha(fecha: string): Promise<TurnoResumen[]> {
  // TODO: reemplazar mock por → return apiFetch<TurnoResumen[]>(`/turnos?fecha=${fecha}`)
  void apiFetch // evita warning de import no usado hasta conectar la API
  const FECHA_CON_DATOS = '2026-05-05'
  return Promise.resolve(fecha === FECHA_CON_DATOS ? MOCK_TURNOS : [])
}

export async function getTurnoById(id: number): Promise<TurnoDetalle> {
  // TODO: reemplazar mock por → return apiFetch<TurnoDetalle>(`/turnos/${id}`)
  const turno = MOCK_TURNOS.find((t) => t.id === id)
  if (!turno) throw new Error(`Turno ${id} no encontrado`)
  return Promise.resolve({
    id: turno.id,
    horario: turno.horario,
    actividad: turno.actividad,
    reservasActuales: turno.reservasActuales,
    espaciosLibres: turno.espaciosLibres,
  })
}
