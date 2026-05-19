'use client';

export default function FormularioEjemplo() {
  
  // Función que se ejecuta cuando el usuario hace clic en el botón de enviar
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Evita que la página se recargue

    // 1. Capturar los datos del formulario de forma automática
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()); 
    // 'data' ahora es un objeto tierno como este: { email: '...', password: '...' }

    try {
      // 2. Hacer la petición POST a la API
      const response = await fetch('https://api.tu-sistema.com/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data), 
      });

      
      if (response.ok) {
        const resultado = await response.json();
        alert('¡Datos enviados con éxito!');
        console.log('Respuesta del servidor:', resultado);
      } else {
        alert('Hubo un error en el servidor.');
      }
      
    } catch (error) {
      // Por si se cae la red o la API no responde
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          {/* El atributo 'name' es CLAVE, porque de ahí FormData saca la propiedad */}
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full p-2 border rounded-lg" 
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full p-2 border rounded-lg" 
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg font-medium"
        >
          Enviar Datos
        </button>
      </form>
    </div>
  );
}