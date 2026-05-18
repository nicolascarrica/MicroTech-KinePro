import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-kine-blue-deep text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Zona del Logo */}
      <div className="p-6 border-b border-white/10 text-center flex items-center justify-center">
        <h2 className="text-3xl font-bold tracking-wider">
          Kine<span className="text-pro-green-light">Pro</span>
        </h2>
      </div>
      
      {/* Menú de Navegación */}
      <nav className="flex flex-col mt-8 gap-2 px-4">
        <Link 
          href="/" 
          className="px-4 py-3 rounded-lg text-gray-300 hover:bg-kine-blue hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-teal-accent"
        >
          Inicio
        </Link>
        <Link 
          href="/pacientes" 
          className="px-4 py-3 rounded-lg text-gray-300 hover:bg-kine-blue hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-teal-accent"
        >
          Pacientes
        </Link>
        <Link 
          href="/turnos" 
          className="px-4 py-3 rounded-lg text-gray-300 hover:bg-kine-blue hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-teal-accent"
        >
          Turnos
        </Link>
        <Link 
          href="/estadisticas" 
          className="px-4 py-3 rounded-lg text-gray-300 hover:bg-kine-blue hover:text-white transition-all duration-200 border-l-4 border-transparent hover:border-teal-accent"
        >
          Estadisticas
        </Link>
      </nav>
    </aside>
  );
}