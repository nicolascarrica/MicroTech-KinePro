'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { modificarDatosPersonales } from '@/services/usuariosService'

type UsuarioSesion = {
  id: number
  nombre: string
  apellido: string
  email: string
  dni?: string
  telefono?: string
}

export default function ModificarDatosPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('kinepro_user')
    if (!raw) {
      router.replace('/')
      return
    }
    setUsuario(JSON.parse(raw) as UsuarioSesion)
  }, [router])

  if (!usuario) {
    return <p className="text-sm text-slate-500">Cargando...</p>
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!usuario) return

    const form = new FormData(e.currentTarget)

    setGuardando(true)
    try {
      const res = await modificarDatosPersonales({
        id: usuario.id,
        nombre: String(form.get('nombre') ?? ''),
        apellido: String(form.get('apellido') ?? ''),
        email: String(form.get('email') ?? ''),
        dni: String(form.get('dni') ?? ''),
        telefono: String(form.get('telefono') ?? ''),
      })
      const actualizado = {
        ...usuario,
        nombre: String(form.get('nombre')),
        apellido: String(form.get('apellido')),
        email: String(form.get('email')),
        dni: String(form.get('dni')),
        telefono: String(form.get('telefono')),
      }
      localStorage.setItem('kinepro_user', JSON.stringify(actualizado))
      toast.success(res.message)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos'
      toast.error(msg)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-slate-800">Modificar datos personales</h1>
        <p className="mb-6 text-sm text-slate-500">Actualizá tu información de contacto.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
              <input
                name="nombre"
                defaultValue={usuario.nombre}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Apellido</label>
              <input
                name="apellido"
                defaultValue={usuario.apellido}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
            <input
              name="email"
              type="email"
              defaultValue={usuario.email}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">DNI</label>
              <input
                name="dni"
                defaultValue={usuario.dni ?? ''}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
              <input
                name="telefono"
                defaultValue={usuario.telefono ?? ''}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 rounded-lg bg-kine-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kine-blue-deep disabled:opacity-50"
            >
              {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
