import { Link } from 'react-router-dom';

const SERVICIOS = [
  { icono: '🦮', nombre: 'Paseos', desc: 'Paseadores certificados para tu perro' },
  { icono: '🏠', nombre: 'Guardería', desc: 'Cuidado diurno con amor y atención' },
  { icono: '🌙', nombre: 'Hospedaje', desc: 'Tu mascota en un hogar seguro' },
  { icono: '🎓', nombre: 'Adiestramiento', desc: 'Entrenamiento profesional adaptado' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-orange-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Los mejores cuidados<br />para tu mascota 🐾
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Conectamos dueños de mascotas con prestadores de servicios de confianza en toda Argentina.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-3 px-8">
              Buscar cuidador
            </Link>
            <Link
              to="/register?rol=PRESTADOR"
              className="btn-secondary text-base py-3 px-8"
            >
              Ser prestador
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
          ¿Qué necesitás?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICIOS.map((s) => (
            <div key={s.nombre} className="card text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{s.icono}</div>
              <h3 className="font-semibold text-lg text-gray-900">{s.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
