'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, Rol } from '@/hooks/useAuth'

// Defino cada link con qué roles pueden verlo
type LinkConfig = {
  href: string
  label: string
  rolesPermitidos: Rol[] | 'todos'
}

const LINKS: LinkConfig[] = [
  { href: '/',              label: 'Inicio',         rolesPermitidos: 'todos' },
  { href: '/Usuarios',      label: 'Usuarios',       rolesPermitidos: ['ADMIN', 'OWNER'] },
  { href: '/actividades',   label: 'Actividades',    rolesPermitidos: ['ADMIN', 'OWNER'] },
  { href: '/turnos',        label: 'Turnos',         rolesPermitidos: ['ADMIN', 'OWNER'] },
  { href: '/mis-turnos/pendientes', label: 'Ver turnos pendientes',  rolesPermitidos: ['PACIENTE'] },
  { href: '/mis-turnos/pasados', label: 'Ver historial de turnos',  rolesPermitidos: ['PACIENTE'] },
  { href: '/estadisticas',  label: 'Estadísticas',   rolesPermitidos: ['ADMIN', 'OWNER'] },
  // Cuando hagamos el PR 3 se agrega: { href: '/usuarios/roles', label: 'Gestión de Roles', rolesPermitidos: ['OWNER'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { rol, isAuthenticated, cargando } = useAuth()

  const linkStyles = (href: string) => {
    const isActive = pathname === href
    return `px-4 py-3 rounded-lg transition-all duration-200 border-l-4 flex items-center gap-2 ${
      isActive
        ? 'bg-kine-blue text-white border-teal-accent font-medium shadow-inner'
        : 'text-gray-300 border-transparent hover:bg-kine-blue/50 hover:text-white'
    }`
  }

  // Filtrar los links según el rol del usuario
  const linksVisibles = LINKS.filter((link) => {
    if (link.rolesPermitidos === 'todos') return true
    if (!isAuthenticated || !rol) return false
    return link.rolesPermitidos.includes(rol)
  })

  return (
    <aside className="w-64 bg-kine-blue-deep text-white flex flex-col h-screen sticky top-0 shadow-2xl shrink-0">
      <div className="p-6 border-b border-white/10 text-center flex items-center justify-center">
        <Link href="/" className="block">
          <h2 className="text-3xl font-bold tracking-wider">
            Kine<span className="text-pro-green-light">Pro</span>
          </h2>
        </Link>
      </div>

      <nav className="flex flex-col mt-8 gap-2 px-4">
        {cargando ? (
          <p className="px-4 text-sm text-gray-400">Cargando...</p>
        ) : (
          linksVisibles.map((link) => (
            <Link key={link.href} href={link.href} className={linkStyles(link.href)}>
              {link.label}
            </Link>
          ))
        )}
      </nav>
    </aside>
  )
}