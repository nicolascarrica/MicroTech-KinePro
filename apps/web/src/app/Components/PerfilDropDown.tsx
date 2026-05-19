"use client";

import React, { useState, useEffect } from 'react';


export default function PerfilDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  // Estado para guardar los datos del usuario logueado
  const [usuario, setUsuario] = useState<{ nombre: string; apellido: string; email: string } | null>(null);

  useEffect(() => {
    const userStorage = localStorage.getItem('kinepro_user');
    if (userStorage) {
      setUsuario(JSON.parse(userStorage));
    }
  }, []);


  const Logout = () => {
    localStorage.removeItem('kinepro_token');
    localStorage.removeItem('kinepro_user');
    alert('Sesión cerrada correctamente.');
    window.location.reload();
  };

  // Variables auxiliares dinámicas con fallbacks por si no hay sesión iniciada
  const nombreCompleto = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Invitado';
  const emailUsuario = usuario ? usuario.email : 'Invitado';
  const inicial = usuario ? usuario.nombre[0].toUpperCase() : 'I';

  return (
    <div className="relative inline-block text-left">
      
      {/* Botón Disparador */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none hover:opacity-90 transition-opacity"
      >
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-gray-700">{nombreCompleto}</span>
          <span className="text-xs text-gray-500">
            {usuario ? 'Paciente' : 'Sin Sesión'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg cursor-pointer border border-teal-100">
          {inicial}
        </div>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>

        
          <div className="absolute right-0 mt-3 w-72 bg-white shadow-xl border border-gray-100 z-30 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50/50 flex flex-col">
              <span className="font-semibold text-gray-800">{nombreCompleto}</span>
              <span className="text-xs text-gray-400 mt-0.5">{emailUsuario}</span>
            </div>
            <div className="border-t border-gray-100"></div>
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
            <div className="py-1">
              <button 
                onClick={Logout} 
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