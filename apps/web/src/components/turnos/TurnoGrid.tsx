'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { TurnoResumen, TurnoDetalle, EstadoTurno, EstadoReserva } from '@/types/turno'
import { getTurnoById } from '@/services/turnosService'
import { registrarPago, type MetodoPagoPresencial } from '@/services/pagosService'

interface TurnoGridProps {
  fecha: string | null
  turnos: TurnoResumen[]
  loading: boolean
  onPagoRegistrado?: () => void
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

const ESTADO_RESERVA_BADGE: Record<EstadoReserva, string> = {
  PENDIENTE:  'bg-amber-100 text-amber-700',
  CONFIRMADA: 'bg-kine-blue/15 text-kine-blue-deep',
  ASISTIO:    'bg-progreen/15 text-progreen-deep',
  AUSENTE:    'bg-red-100 text-red-700',
  CANCELADA:  'bg-neutral-bg text-neutral-gray',
}

const ESTADO_RESERVA_LABEL: Record<EstadoReserva, string> = {
  PENDIENTE:  'Pendiente',
  CONFIRMADA: 'Confirmada',
  ASISTIO:    'Asistió',
  AUSENTE:    'Ausente',
  CANCELADA:  'Cancelada',
}

function formatFecha(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export default function TurnoGrid({ fecha, turnos, loading, onPagoRegistrado }: TurnoGridProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [detalle, setDetalle] = useState<TurnoDetalle | null>(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)

  // Colapsar al cambiar de fecha
  useEffect(() => {
    setExpandedId(null)
    setDetalle(null)
  }, [fecha])

  async function handleToggle(turno: TurnoResumen) {
    if (expandedId === turno.id) {
      setExpandedId(null)
      setDetalle(null)
      return
    }
    setExpandedId(turno.id)
    setDetalle(null)
    setLoadingDetalle(true)
    try {
      setDetalle(await getTurnoById(turno.id))
    } finally {
      setLoadingDetalle(false)
    }
  }

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
            <th className="w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-bg">
          {turnos.map((turno) => {
            const expanded = expandedId === turno.id
            return (
              <>
                <tr
                  key={turno.id}
                  onClick={() => handleToggle(turno)}
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
                  <td className="px-3 py-3 text-center">
                    <ChevronDown
                      className={`mx-auto h-4 w-4 text-neutral-gray transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </td>
                </tr>

                {expanded && (
                  <tr key={`${turno.id}-detalle`}>
                    <td colSpan={6} className="bg-neutral-bg/30 px-6 py-4">
                      {loadingDetalle && !detalle ? (
                        <p className="text-center text-xs text-neutral-gray">Cargando detalle…</p>
                      ) : detalle ? (
                        <DetalleInscriptos detalle={detalle} onPagoRegistrado={onPagoRegistrado} />
                      ) : null}
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Detalle expandido ────────────────────────────────────────────────────────

interface FormPago {
  metodo: MetodoPagoPresencial | ''
  error: string
  cargando: boolean
  exito: boolean
}

const FORM_INICIAL: FormPago = { metodo: '', error: '', cargando: false, exito: false }

function DetalleInscriptos({ detalle, onPagoRegistrado }: { detalle: TurnoDetalle; onPagoRegistrado?: () => void }) {
  const [inscriptoActivo, setInscriptoActivo] = useState<number | null>(null)
  const [form, setForm] = useState<FormPago>(FORM_INICIAL)
  const [pagadosEnSesion, setPagadosEnSesion] = useState<Set<number>>(new Set())

  function abrirFormPago(reservaId: number) {
    setInscriptoActivo(reservaId)
    setForm(FORM_INICIAL)
  }

  function cerrarFormPago() {
    setInscriptoActivo(null)
    setForm(FORM_INICIAL)
  }

  async function handleSubmitPago(reservaId: number) {
    if (!form.metodo) {
      setForm((f) => ({ ...f, error: 'Seleccioná un método de pago.' }))
      return
    }
    setForm((f) => ({ ...f, cargando: true, error: '' }))
    try {
      await registrarPago({ reserva_id: reservaId, metodo: form.metodo as MetodoPagoPresencial })
      setPagadosEnSesion((prev) => new Set(prev).add(reservaId))
      setForm((f) => ({ ...f, cargando: false, exito: true }))
      onPagoRegistrado?.()
    } catch (e: any) {
      setForm((f) => ({ ...f, cargando: false, error: e.message ?? 'Error al registrar el pago.' }))
    }
  }

  if (detalle.inscriptos.length === 0) {
    return <p className="text-xs text-neutral-gray">Sin inscriptos en este turno.</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-gray mb-3">
        Inscriptos — {detalle.reservasActuales} / {detalle.capacidad}
      </p>
      {detalle.inscriptos.map((p) => {
        const pagado = p.pagado || pagadosEnSesion.has(p.id)
        const formAbierto = inscriptoActivo === p.id
        return (
          <div key={p.id} className="rounded-lg border border-neutral-bg bg-white">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-gray-800">{p.nombre} {p.apellido}</span>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_RESERVA_BADGE[p.estado]}`}>
                  {ESTADO_RESERVA_LABEL[p.estado]}
                </span>
                {pagado ? (
                  <span className="rounded-full bg-progreen/15 px-2 py-0.5 text-xs font-medium text-progreen-deep">
                    Pagado
                  </span>
                ) : !formAbierto ? (
                  <button
                    onClick={() => abrirFormPago(p.id)}
                    className="rounded-lg bg-kine-blue px-2 py-0.5 text-xs font-medium text-white hover:bg-kine-blue-deep transition-colors"
                  >
                    Registrar pago
                  </button>
                ) : null}
              </div>
            </div>

            {formAbierto && (
              <div className="border-t border-neutral-bg px-3 pb-3 pt-2 space-y-2">
                {form.exito ? (
                  <p className="text-center text-xs font-medium text-progreen">
                    Pago registrado correctamente
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-medium text-neutral-gray">Método de pago</p>
                    <div className="flex gap-2">
                      {(['EFECTIVO', 'TARJETA'] as MetodoPagoPresencial[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setForm((f) => ({ ...f, metodo: m, error: '' }))}
                          className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                            form.metodo === m
                              ? 'border-kine-blue bg-kine-blue/10 text-kine-blue'
                              : 'border-neutral-bg text-neutral-gray hover:border-kine-blue/50'
                          }`}
                        >
                          {m === 'EFECTIVO' ? 'Efectivo' : 'Posnet'}
                        </button>
                      ))}
                    </div>
                    {form.error && <p className="text-xs text-red-600">{form.error}</p>}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSubmitPago(p.id)}
                        disabled={form.cargando}
                        className="flex-1 rounded-lg bg-kine-blue py-1.5 text-xs font-semibold text-white hover:bg-kine-blue-deep disabled:opacity-50 transition-colors"
                      >
                        {form.cargando ? 'Registrando…' : 'Confirmar'}
                      </button>
                      <button
                        onClick={cerrarFormPago}
                        className="flex-1 rounded-lg border border-neutral-bg py-1.5 text-xs font-medium text-neutral-gray hover:bg-neutral-bg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
