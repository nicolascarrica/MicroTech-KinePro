'use client';

import { useEffect, useState } from 'react';
import TablaGenerica, { Columna } from './TablaGenerica'; // <-- Ajustá esta ruta según dónde guardaste la tabla genérica

interface Usuario {
  id: number | string; 
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  rol: string;
  fecha_registro: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const respuesta = await fetch(`${API}/usuarios`);
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar los usuarios');
        }

        const json = await respuesta.json();
        setUsuarios(json.data || []);
        
      } catch (e: any) {
        setError(e.message);
        setUsuarios([]); 
      } finally {
        setCargando(false); 
      }
    };
    cargarUsuarios();
  }, []);


  const handleModificar = (id?: number | string) => {
    alert(`Abrir modal o redirigir para modificar usuario ID: ${id}`);
  };

  const handleBaja = (id?: number | string) => {
    if (confirm('¿Estás seguro de que deseas dar de baja a este usuario?')) {
      alert(`Ejecutar PATCH/DELETE para dar de baja ID: ${id}`);
    }
  };


  // Acá le decimos a la Tabla Genérica qué datos mostrar y cómo renderizarlos
  const columnasConfig: Columna<Usuario>[] = [
    { 
      encabezado: 'Nombre y Apellido', 
      render: (u) => <span className="font-medium text-slate-800">{u.nombre} {u.apellido}</span> 
    },
    { 
      encabezado: 'DNI', 
      render: (u) => <span className="text-slate-500 font-mono">{u.dni}</span> 
    },
    { 
      encabezado: 'Email', 
      accessor: 'email' 
    },
    { 
      encabezado: 'Teléfono', 
      render: (u) => <span className="text-slate-500">{u.telefono || '-'}</span> 
    },
    { 
      encabezado: 'Acciones', 
      render: (u) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleModificar(u.id)}
            className="bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-200 hover:border-teal-200"
          >
            ✏️ Modificar
          </button>
          <button
            onClick={() => handleBaja(u.id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-red-100"
          >
            🗑️ Dar de Baja
          </button>
        </div>
      )
    }
  ];

  if (cargando) {
    return <p className="text-center text-slate-500 text-sm p-8">Cargando usuarios...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Encabezado de la sección (Se mantiene igual) */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Listado de Usuarios</h2>
          <p className="text-xs text-slate-400 mt-0.5">Gestión y control de cuentas registradas</p>
        </div>
        <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full">
          Total: {usuarios.length}
        </span>
      </div>

      {/* Reemplazamos todo el HTML gigante por nuestro componente genérico */}
      <TablaGenerica 
        datos={usuarios} 
        columnas={columnasConfig} 
        mensajeVacio="No hay usuarios registrados en el sistema." 
      />
      
    </div>
  );
}