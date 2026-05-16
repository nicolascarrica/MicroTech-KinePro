'use client';

import { useEffect, useState } from 'react';

interface Health {
  ok: boolean;
  service: string;
  uptimeSeconds: number;
  now: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

/**
 * Landing del scaffold: consulta /api/health para confirmar
 * que el backend levantó y se ve desde el navegador.
 */
export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-kineblue-deep">
          KinePro <span className="text-progreen">scaffold</span>
        </h1>
        <p className="text-neutral-gray mt-4">
          MicroTech · Ingeniería de Software II · UNLP 2026
        </p>

        <div className="mt-10 rounded-xl bg-white border border-neutral-200 shadow-sm p-6 text-left">
          <h2 className="text-lg font-semibold text-kineblue-deep mb-3">
            Estado del backend
          </h2>
          {error ? (
            <p className="text-red-600 text-sm">
              No se pudo conectar a {API}/health. ¿Está corriendo el back en otra
              terminal?
            </p>
          ) : !health ? (
            <p className="text-neutral-gray text-sm">Consultando…</p>
          ) : (
            <ul className="text-sm text-neutral-700 space-y-1">
              <li>
                Estado:{' '}
                <span className="text-progreen-deep font-semibold">OK ✅</span>
              </li>
              <li>Servicio: <strong>{health.service}</strong></li>
              <li>Uptime: {health.uptimeSeconds}s</li>
              <li className="text-xs text-neutral-gray">{health.now}</li>
            </ul>
          )}
        </div>

        <p className="text-xs text-neutral-gray mt-8">
          Si arriba ves "OK ✅", el ambiente está listo. Ya pueden empezar a
          implementar las HU.
        </p>
      </div>
    </main>
  );
}
