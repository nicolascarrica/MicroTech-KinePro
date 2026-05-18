import React from 'react';

import NotificacionesDropdown from './NotificacionesDropdown'; // Importamos el nuevo panel
import PerfilDropdown from './PerfilDropDown';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Sección Izquierda: Título o Breadcrumbs */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Panel de Control</h1>
      </div>

      {/* Sección Derecha: Acciones y Usuario */}
      <div className="flex items-center gap-6">
        
        {/* Reemplazamos tu botón viejo por este dinámico */}
        <NotificacionesDropdown />
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <PerfilDropdown />
        </div>
      </div>
    </header>
  );
}