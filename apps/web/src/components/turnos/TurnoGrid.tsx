import type { TurnoResumen, EstadoTurno } from '@/types/turno'

interface TurnoGridProps {
  fecha: string | null
  turnos: TurnoResumen[]
  loading: boolean
  onTurnoSelect: (turno: TurnoResumen) => void
}

const ESTADO_BADGE: Record<EstadoTurno, string> = {
  DISPONIBLE: 'bg-progreen/15 text-progreen-deep',
  RESERVADO:  'bg-kineblue/15 text-kineblue-deep',
  CANCELADO:  'bg-red-100 text-red-700',
}

const ESTADO_LABEL: Record<EstadoTurno, string> = {
  DISPONIBLE: 'Disponible',
  RESERVADO:  'Reservado',
  CANCELADO:  'Cancelado',
}

function formatFecha(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export default function TurnoGrid({ fecha, turnos, loading, onTurnoSelect }: TurnoGridProps) {
  if (!fecha) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-neutral-gray/40 bg-neutral-bg/50 text-neutral-gray">
        Seleccioná una fecha en el calendario para ver los turnos.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-neutral-bg bg-white">
        <span className="text-neutral-gray">Cargando turnos…</span>
      </div>
    )
  }

  if (turnos.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-neutral-bg bg-white text-neutral-gray">
        No existen turnos creados en la fecha seleccionada.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-bg bg-white shadow-sm">
      <div className="border-b border-neutral-bg px-4 py-3">
        <h2 className="text-sm font-semibold text-kineblue">
          Turnos del {formatFecha(fecha)}
        </h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-neutral-bg/60 text-xs uppercase text-neutral-gray">
          <tr>
            <th className="px-4 py-2 text-left">Horario</th>
            <th className="px-4 py-2 text-left">Actividad</th>
            <th className="px-4 py-2 text-center">Reservas</th>
            <th className="px-4 py-2 text-center">Libres</th>
            <th className="px-4 py-2 text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-bg">
          {turnos.map((turno) => (
            <tr
              key={turno.id}
              onClick={() => onTurnoSelect(turno)}
              className="cursor-pointer transition-colors hover:bg-kineblue/5"
            >
              <td className="px-4 py-3 font-medium text-kineblue">{turno.horario}</td>
              <td className="px-4 py-3 text-gray-700">{turno.actividad}</td>
              <td className="px-4 py-3 text-center text-gray-700">{turno.reservasActuales}</td>
              <td className="px-4 py-3 text-center text-gray-700">{turno.espaciosLibres}</td>
              <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[turno.estado]}`}>
                  {ESTADO_LABEL[turno.estado]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
