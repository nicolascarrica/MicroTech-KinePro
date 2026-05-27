'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import TurnoGrid from '@/components/turnos/TurnoGrid'
import TurnoModal from '@/components/turnos/TurnoModal'
import { getTurnosByFecha, getTurnoById } from '@/services/turnosService'
import type { TurnoResumen, TurnoDetalle } from '@/types/turno'
import CrearTurnoModal from '@/components/turnos/CrearTurnoModal'
import { Plus } from 'lucide-react'
import { useRequireRole } from '@/hooks/useAuth'

// FullCalendar no soporta SSR → carga dinámica solo en cliente
const CalendarioTurnos = dynamic(() => import('@/components/turnos/CalendarioTurnos'), { ssr: false })

export default function TurnosPage() {
  const { autorizado, cargando } = useRequireRole(['ADMIN', 'OWNER'])

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null)
  const [turnos, setTurnos] = useState<TurnoResumen[]>([])
  const [loadingTurnos, setLoadingTurnos] = useState(false)

  const [turnoDetalle, setTurnoDetalle] = useState<TurnoDetalle | null>(null)
  const [loadingDetalle, setLoadingDetalle] = useState(false)

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false)

  async function handleFechaSelect(fecha: string) {
    setFechaSeleccionada(fecha)
    setTurnos([])
    setLoadingTurnos(true)
    try {
      const data = await getTurnosByFecha(fecha)
      setTurnos(data)
    } finally {
      setLoadingTurnos(false)
    }
  }

  async function handleTurnoSelect(turno: TurnoResumen) {
    setTurnoDetalle(null)
    setLoadingDetalle(true)
    try {
      const detalle = await getTurnoById(turno.id)
      setTurnoDetalle(detalle)
    } finally {
      setLoadingDetalle(false)
    }
  }

  function handleCloseModal() {
    setTurnoDetalle(null)
    setLoadingDetalle(false)
  }

  if (cargando) return <p className="p-6 text-slate-500">Cargando...</p>
  if (!autorizado) return null

  return (
    <main className="min-h-screen bg-neutral-bg/40 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-kineblue">Turnos</h1>
          <button
            onClick={() => setModalCrearAbierto(true)}
            className="bg-kine-blue hover:bg-kine-blue-deep text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear turno
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <section>
            <CalendarioTurnos
              fechaSeleccionada={fechaSeleccionada}
              onFechaSelect={handleFechaSelect}
            />
          </section>

          <section className="flex flex-col gap-4">
            <TurnoGrid
              fecha={fechaSeleccionada}
              turnos={turnos}
              loading={loadingTurnos}
              onTurnoSelect={handleTurnoSelect}
            />
          </section>
        </div>
      </div>

      <TurnoModal
        turno={turnoDetalle}
        loading={loadingDetalle}
        onClose={handleCloseModal}
      />

      <CrearTurnoModal
        abierto={modalCrearAbierto}
        fechaInicial={fechaSeleccionada}
        onClose={() => setModalCrearAbierto(false)}
        onCreado={() => {
          if (fechaSeleccionada) handleFechaSelect(fechaSeleccionada)
        }}
      />
    </main>
  )
}