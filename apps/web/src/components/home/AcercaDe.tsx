'use client'

export default function AcercaDe() {
  return (
    <section id="acerca-de" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 scroll-mt-20">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">ℹ️ Acerca de nosotros</h2>
        <p className="text-sm text-slate-500 mt-1">Conocé más sobre nuestro centro de kinesiología</p>
      </div>

      <div className="space-y-6">
        {/* Historia */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Nuestra historia</h3>
          <p className="text-slate-600 leading-relaxed">
            El centro fue fundado hace 15 años por Laura y José, kinesiólogos con una visión clara: 
            brindar excelente atención con un equipo de buenos profesionales que se dedican 
            a mejorar la calidad de vida de nuestros pacientes.
          </p>
        </div>

        {/* Servicios */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Nuestros servicios</h3>
          <p className="text-slate-600 mb-3">
            Ofrecemos sesiones de kinesiología organizadas por <strong>zonas de tratamiento</strong>:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">1</span>
              <span className="text-slate-600">Tren inferior</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">2</span>
              <span className="text-slate-600">Tren medio</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 font-bold text-sm">3</span>
              <span className="text-slate-600">Tren superior</span>
            </li>
          </ul>
        </div>

        {/* Gestión de Turnos */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Cómo gestionamos tus turnos</h3>
          <p className="text-slate-600 mb-3">
            Ofrecemos dos modalidades de atención para que elijas la que mejor se adapte a tu necesidad:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-800 mb-1">📅 Turnos fijos</p>
              <p className="text-sm text-slate-600">Para pacientes regulares que requieren un seguimiento continuo.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-800 mb-1">⏰ Turnos por demanda</p>
              <p className="text-sm text-slate-600">Para consultas puntuales o cuando lo necesites.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
