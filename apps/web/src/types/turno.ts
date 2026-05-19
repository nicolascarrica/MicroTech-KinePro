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
