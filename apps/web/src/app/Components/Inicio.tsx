'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
const DNI_NUMERICO = /^\d{7,8}$/;
const TELEFONO_NUMERICO = /^\d{8,15}$/;

function validarRegistro(data: Record<string, FormDataEntryValue>): string | null {
  const nombre = String(data.nombre ?? '').trim();
  const apellido = String(data.apellido ?? '').trim();
  const dni = String(data.dni ?? '').replace(/\D/g, '');
  const telefono = String(data.telefono ?? '').replace(/\D/g, '');

  if (!nombre || !SOLO_LETRAS.test(nombre)) {
    return 'El nombre solo puede contener letras';
  }
  if (!apellido || !SOLO_LETRAS.test(apellido)) {
    return 'El apellido solo puede contener letras';
  }
  if (!DNI_NUMERICO.test(dni)) {
    return 'El DNI debe contener solo números (7 u 8 dígitos)';
  }
  if (!TELEFONO_NUMERICO.test(telefono)) {
    return 'El teléfono solo puede contener números';
  }
  return null;
}

export default function Inicio() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Estados para manejar la persistencia de sesión sin errores 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kinepro_token');
    setIsAuthenticated(!!token);
    setCargando(false);
  }, []);

  async function manejarLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resultado = await response.json();
      if (!response.ok) {
        const mensajeError = Array.isArray(resultado.message)
          ? resultado.message.join(', ')
          : resultado.message;
        throw new Error(mensajeError || 'Hubo un problema');
      }

      localStorage.setItem('kinepro_token', resultado.token);
      localStorage.setItem('kinepro_user', JSON.stringify(resultado.usuario));

      toast.success('Inicio de sesión exitoso', {
        description: `Hola de nuevo, ${resultado.usuario.nombre}.`,
      });

      setIsLoginOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error en login:', error.message);
      toast.error('Error al iniciar sesión', { description: error.message, duration: 5000 });
    }
  }

  async function manejarRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const errorValidacion = validarRegistro(raw);
    if (errorValidacion) {
      toast.error('Datos inválidos', { description: errorValidacion, duration: 5000 });
      return;
    }

    const data = {
      ...raw,
      nombre: String(raw.nombre).trim(),
      apellido: String(raw.apellido).trim(),
      dni: String(raw.dni).replace(/\D/g, ''),
      telefono: String(raw.telefono).replace(/\D/g, ''),
    };
    const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/registro`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resultado = await response.json();
      if (!response.ok) {
        const mensajeError = Array.isArray(resultado.message)
          ? resultado.message.join(', ')
          : resultado.message;
        throw new Error(mensajeError || 'Hubo un problema');
      }

      toast.success('¡Registro completado con éxito!', {
        description: 'Ya podés iniciar sesión.',
      });

      setIsRegisterOpen(false);
    } catch (error: any) {
      console.error('Error en registro:', error.message);
      toast.error('Error al crear usuario', { description: error.message, duration: 5000 });
    }
  }

  if (cargando || isAuthenticated) return null;

  return (
    <div className="mb-6 w-full">
      {/* SECCIÓN DE BIENVENIDA Y PASOS */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ¡Te damos la bienvenida a <span className="text-teal-600">KinePro</span>! 
          </h1>
          <p className="text-slate-500 text-lg mt-1">
            Tu espacio para gestionar consultas, seguir tratamientos y agendar turnos de kinesiología de forma rápida y sencilla.
          </p>
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-4">Pasos para comenzar a atenderte:</h2>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center bg-teal-50 text-teal-600 font-bold rounded-full h-8 w-8 shrink-0">1</span>
            <p className="text-lg text-slate-600 mt-1">Iniciá sesión o registrate en la plataforma con tus datos.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center bg-teal-50 text-teal-600 font-bold rounded-full h-8 w-8 shrink-0">2</span>
            <p className="text-lg text-slate-600 mt-1">Seleccioná el día disponible que mejor se adapte a tu agenda.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center bg-teal-50 text-teal-600 font-bold rounded-full h-8 w-8 shrink-0">3</span>
            <p className="text-lg text-slate-600 mt-1">Confirmá tu reserva y recibí la notificación del turno.</p>
          </div>
        </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setIsRegisterOpen(true); }}
              className="bg-white hover:bg-slate-50 text-teal-600 font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm border border-slate-200"
            >
              Registrarse
            </button>
            <button
              onClick={() => { setIsLoginOpen(true); }}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Iniciar sesión
            </button>
          </div>
      </section>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">Iniciar sesión</h3>

            <form onSubmit={manejarLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                <input type="email" name="email" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500" placeholder="ejemplo@kinepro.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input type="password" name="password" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500" placeholder="••••••••" />
              </div>

              <p className="text-right text-sm">
                <Link href="/restablecer" onClick={() => setIsLoginOpen(false)} className="text-teal-600 hover:underline">¿Olvidaste tu contraseña?</Link>
              </p>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition-colors mt-2">Ingresar</button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-4">Registrarse</h3>

            <form onSubmit={manejarRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+"
                    title="Solo letras"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    required
                    pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+"
                    title="Solo letras"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                    placeholder="Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
                  <input
                    type="text"
                    name="dni"
                    required
                    inputMode="numeric"
                    pattern="\d{7,8}"
                    maxLength={8}
                    title="7 u 8 números"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                    placeholder="12345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    inputMode="numeric"
                    pattern="\d{8,15}"
                    title="Solo números (8 a 15 dígitos)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                    placeholder="221123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de nacimiento</label>
                  <input type="date" name="fechaNacimiento" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                <input type="email" name="email" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500" placeholder="ejemplo@kinepro.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input type="password" name="password" required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500" placeholder="••••••••" />
              </div>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition-colors mt-2">Crear cuenta</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}