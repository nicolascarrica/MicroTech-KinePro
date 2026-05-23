export type EstadoTurno = 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO'

export interface TurnoResumen {
  id: number
  horario: string
  actividad: string
  estado: EstadoTurno
  capacidad: number
  reservasActuales: number
  espaciosLibres: number
}

export interface TurnoDetalle {
  id: number
  horario: string
  actividad: string
  reservasActuales: number
  espaciosLibres: number
}


export interface CrearTurnoInput {
  tipoActividad_id: number
  fecha: string         // formato YYYY-MM-DD
  hora_inicio: string   // formato HH:MM
  capacidad: number
}