'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ListaTurnosPasados from '@/components/turnos/ListaTurnosPasados'
import { getTurnosPasadosMock } from '@/data/turnosPacienteMock'

export default function TurnosPasadosPage() {
  const router = useRouter()
  const [listo, setListo] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('kinepro_user')) {
      router.replace('/')
      return
    }
    setListo(true)
  }, [router])

  const turnos = getTurnosPasadosMock()

  if (!listo) {
    return <p className="text-sm text-slate-500">Cargando...</p>
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-teal-600 hover:underline">
          ← Volver al inicio
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Historial de turnos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Consultá tus turnos anteriores y el registro de asistencia.
        </p>
      </div>
      <ListaTurnosPasados turnos={turnos} />
    </div>
  )
}
