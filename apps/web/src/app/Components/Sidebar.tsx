'use client'; 

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook para saber la URL actual

export default function Sidebar() {
  const pathname = usePathname(); // Contiene "/" o "/pacientes" o "/turnos", etc.

  // Función auxiliar para aplicar estilos dinámicos si la pestaña está activa
  const linkStyles = (href: string) => {
    const isActive = pathname === href;
    return `px-4 py-3 rounded-lg transition-all duration-200 border-l-4 flex items-center gap-2 ${
      isActive
        ? 'bg-kine-blue text-white border-teal-accent font-medium shadow-inner' // Estilo Activo
        : 'text-gray-300 border-transparent hover:bg-kine-blue/50 hover:text-white' // Estilo Inactivo
    }`;
  };

  return (
    <aside className="w-64 bg-kine-blue-deep text-white flex flex-col h-screen sticky top-0 shadow-2xl shrink-0">
      {/* Zona del Logo */}
      <div className="p-6 border-b border-white/10 text-center flex items-center justify-center">
        <h2 className="text-3xl font-bold tracking-wider">
          Kine<span className="text-pro-green-light">Pro</span>
        </h2>
      </div>
      
      {/* Menú de Navegación */}
      <nav className="flex flex-col mt-8 gap-2 px-4">
        <Link href="/" className={linkStyles('/')}>
           Inicio
        </Link>
        
        <Link href="/Usuarios" className={linkStyles('/usuarios')}>
           Usuarios
        </Link>
        
        <Link href="/turnos" className={linkStyles('/turnos')}>
           Turnos
        </Link>
        
        <Link href="/estadisticas" className={linkStyles('/estadisticas')}>
           Estadísticas
        </Link>
      </nav>
    </aside>
  );
}