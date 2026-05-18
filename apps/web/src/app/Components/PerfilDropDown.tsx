"use client"; // Si usas Next.js App Router, deja esta línea. Si no, puedes borrarla.

import React, { useState } from 'react';

export default function PerfilDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      
      {/* Botón Disparador: Reutiliza exactamente tu diseño actual */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none hover:opacity-90 transition-opacity"
      >
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-gray-700">Val. Blanco</span>
          <span className="text-xs text-gray-500">Administrador</span>
        </div>
        
        {/* Tu Avatar original */}
        <div className="w-10 h-10 rounded-full bg-kine-blue-light text-kine-blue-deep flex items-center justify-center font-bold text-lg cursor-pointer">
          V
        </div>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <>
          {/* Fondo invisible para cerrar al hacer clic afuera */}
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>

          {/* Caja del menú (Alineada a la derecha y con z-30 para quedar arriba del header) */}
          <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl border border-gray-100 z-30 rounded-lg overflow-hidden">
            
            {/* Cabecera interna del menú */}
            <div className="p-4 bg-gray-50/50 flex flex-col">
              <span className="font-semibold text-gray-800">Val. Blanco</span>
              <span className="text-xs text-gray-400 mt-0.5">valentinablanca@tuemail.com</span>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Opciones */}
            <div className="py-1 flex flex-col text-sm text-gray-700">
              <a href="#perfil" className="px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
                👤 Mi Perfil
              </a>
              <a href="#config" className="px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
                ⚙️ Configuración de la cuenta
              </a>
              <a href="#turnos" className="px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2">
                📅 Ver mis turnos
              </a>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Cerrar Sesión */}
            <div className="py-1">
              <button 
                onClick={() => console.log("Cerrando sesión...")}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                🚪 Cerrar sesión
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}