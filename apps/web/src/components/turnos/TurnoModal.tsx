import type { TurnoDetalle } from '@/types/turno'

interface TurnoModalProps {
  turno: TurnoDetalle | null
  loading: boolean
  onClose: () => void
}

export default function TurnoModal({ turno, loading, onClose }: TurnoModalProps) {
  if (!turno && !loading) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-gray hover:text-gray-700"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h3 className="mb-4 text-base font-semibold text-kineblue">Detalle del turno</h3>

        {loading ? (
          <p className="text-center text-sm text-neutral-gray">Cargando…</p>
        ) : turno ? (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-neutral-bg pb-2">
              <dt className="text-neutral-gray">Horario</dt>
              <dd className="font-medium text-gray-800">{turno.horario}</dd>
            </div>
            <div className="flex justify-between border-b border-neutral-bg pb-2">
              <dt className="text-neutral-gray">Actividad</dt>
              <dd className="font-medium text-gray-800">{turno.actividad}</dd>
            </div>
            <div className="flex justify-between border-b border-neutral-bg pb-2">
              <dt className="text-neutral-gray">Reservas actuales</dt>
              <dd className="font-medium text-gray-800">{turno.reservasActuales}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-gray">Espacios libres</dt>
              <dd className={`font-semibold ${turno.espaciosLibres === 0 ? 'text-red-600' : 'text-progreen'}`}>
                {turno.espaciosLibres}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  )
}
