import { apiFetch } from '@/lib/api'
import type { CrearTurnoInput, RangoHorarioBackend, TurnoDetalle, TurnoResumen } from '@/types/turno'


function extractHora(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
function calcularHoraHasta(horaDesde: string): string {
  const [h, m] = horaDesde.split(':');
  const proximaHora = (parseInt(h) + 1).toString().padStart(2, '0');
  return `${proximaHora}:${m}`;
}

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

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'


export async function crearTurno(input: CrearTurnoInput): Promise<{ message: string }> {
  return apiFetch('/turnos', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
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
export async function getHorariosTurnos(fecha: string): Promise<RangoHorarioBackend[]> {
  

  const turnosPlanos = await apiFetch<any[]>(`/turnos?fecha=${fecha}`);
  const turnosAgrupados = new Map<string, RangoHorarioBackend>();

  turnosPlanos.forEach((t) => {
    if ( t.espacios_libres <= 0) return;

    const horaDesde = extractHora(t.hora_inicio);

    // Si todavía no creamos el grupo para esta hora, lo inicializamos
    if (!turnosAgrupados.has(horaDesde)) {
      turnosAgrupados.set(horaDesde, {
        idTurno: t.id,
        desde: horaDesde,
        hasta: calcularHoraHasta(horaDesde),
        actividades: [],
      });
    }

    // Metemos la actividad adentro del grupo horario correspondiente
    turnosAgrupados.get(horaDesde)!.actividades.push({
      id: t.id,
      nombre: t.actividad,  
      cuposTotales: t.capacidad,
      cuposDisponibles: t.espacios_libres,
    });
  });


  return Array.from(turnosAgrupados.values());
 
  
}

export async function getDiasDisponiblesDelMes(mes: number, anio: number): Promise<number[]> {
  
  return apiFetch<number[]>(`/turnos/dias-disponibles/${mes}/${anio}`);
}

// import type { TurnoDetalle, TurnoResumen, CrearTurnoInput } from '@/types/turno'

// const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

// async function requestTurno<T>(path: string, options?: RequestInit): Promise<T> {
//   const res = await fetch(`${API}${path}`, {
//     headers: { 'Content-Type': 'application/json' },
//     ...options,
//   })
//   const data = await res.json().catch(() => null)
//   if (!res.ok) {
//     const msg = data?.message ?? `Error ${res.status}`
//     throw new Error(Array.isArray(msg) ? msg.join(', ') : msg)
//   }
//   return data as T
// }

// // El back devuelve hora_inicio como ISO ("1970-01-01T10:00:00.000Z").
// // Extraemos solo "HH:MM" para mostrar en el front.
// function extractHora(isoString: string): string {
//   const d = new Date(isoString)
//   const h = d.getUTCHours().toString().padStart(2, '0')
//   const m = d.getUTCMinutes().toString().padStart(2, '0')
//   return `${h}:${m}`
// }

// export async function getTurnosByFecha(fecha: string): Promise<TurnoResumen[]> {
//   const data = await requestTurno<any[]>(`/turnos?fecha=${fecha}`)
//   return data.map((t) => ({
//     id: t.id,
//     horario: extractHora(t.hora_inicio),
//     actividad: t.actividad,
//     estado: t.estado,
//     capacidad: t.capacidad,
//     reservasActuales: t.cantidad_inscriptos,
//     espaciosLibres: t.espacios_libres,
//   }))
// }

// export async function getTurnoById(id: number): Promise<TurnoDetalle> {
//   const t = await requestTurno<any>(`/turnos/${id}`)
//   return {
//     id: t.id,
//     horario: extractHora(t.hora_inicio),
//     actividad: t.actividad,
//     reservasActuales: t.cantidad_reservas,
//     espaciosLibres: t.espacios_libres,
//   }
// }

// export async function crearTurno(input: CrearTurnoInput): Promise<{ message: string }> {
//   return requestTurno('/turnos', {
//     method: 'POST',
//     body: JSON.stringify(input),
//   })
// }