'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ListaTurnosPendientes from '@/components/turnos/ListaTurnosPendientes'
import { obtenerMisReservas } from '@/services/turnosPacientesService'

export default  function TurnosPendientesPage() {
  const router = useRouter()
  const [listo, setListo] = useState(false)
  const [turnosConfirmados, setTurnosConfirmados] = useState<any[]>([]);
 
  
  useEffect(() => { 
    if (!localStorage.getItem('kinepro_user')) {
      router.replace('/')
      return
    }
    setListo(true)
     
  }, [router])
  
  useEffect(() => {
    obtenerMisReservas("CONFIRMADA")
      .then(data => setTurnosConfirmados(data))
      .catch(err => console.error("Error al traer los turnos:", err));
  }, []);
  

  if (!listo) {
    return <p className="text-sm text-slate-500">Cargando...</p>
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-teal-600 hover:underline">
          ← Volver al inicio
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">Turnos pendientes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestioná tus próximas reservas. Podés cancelar o reprogramar cada turno.
        </p>
      </div>
      <ListaTurnosPendientes turnos={turnosConfirmados} />
    </div>
  )
}
