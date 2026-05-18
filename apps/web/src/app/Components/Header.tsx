export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Sección Izquierda: Título o Breadcrumbs */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Panel de Control</h1>
      </div>

      {/* Sección Derecha: Acciones y Usuario */}
      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-teal-accent transition-colors">
          {/* Un ícono de campanita falso por ahora */}
          🔔 Notificaciones
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-700">Val. Blanco</span>
            <span className="text-xs text-gray-500">Administrador</span>
          </div>
          {/* Avatar del usuario con los colores de tu marca */}
          <div className="w-10 h-10 rounded-full bg-kine-blue-light text-kine-blue-deep flex items-center justify-center font-bold text-lg">
            U
          </div>
        </div>
      </div>
    </header>
  );
}