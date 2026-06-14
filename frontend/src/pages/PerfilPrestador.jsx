import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { prestadoresService } from '../services/prestadores.service';
import Stars from '../components/Stars';
import { useAuth } from '../context/AuthContext';

const TIPO_LABEL = {
  PASEO: '🦮 Paseo',
  GUARDERIA: '🏠 Guardería',
  HOSPEDAJE: '🌙 Hospedaje',
  ADIESTRAMIENTO: '🎓 Adiestramiento',
};

export default function PerfilPrestador() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [prestador, setPrestador] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    prestadoresService.perfil(id)
      .then(({ prestador }) => setPrestador(prestador))
      .catch(() => navigate('/buscar'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      {Array(3).fill(0).map((_, i) => <div key={i} className="card h-32 animate-pulse bg-gray-100" />)}
    </div>
  );

  if (!prestador) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start gap-5">
          <img
            src={prestador.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(prestador.nombre)}&background=f18c11&color=fff&size=128`}
            alt={prestador.nombre}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{prestador.nombre}</h1>
                {prestador.ubicacion && (
                  <p className="text-gray-500 text-sm mt-0.5">📍 {prestador.ubicacion}</p>
                )}
              </div>
              {prestador.aprobado && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✓ Verificado
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Stars valor={prestador.rating || 0} size="lg" />
              <span className="text-sm text-gray-600">
                {prestador.rating ? `${prestador.rating.toFixed(1)} · ` : ''}
                {prestador.totalReviews} reseñas
              </span>
            </div>
            {prestador.descripcion && (
              <p className="text-gray-600 text-sm mt-3">{prestador.descripcion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 text-lg mb-4">Servicios</h2>
        {prestador.servicios.length === 0 ? (
          <p className="text-gray-400 text-sm">No tiene servicios publicados aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prestador.servicios.map((s) => (
              <div key={s.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">{TIPO_LABEL[s.tipo]}</span>
                  <span className="text-primary-500 font-bold">${Number(s.precio).toLocaleString('es-AR')}</span>
                </div>
                <p className="text-xs text-gray-500">{s.duracion} min</p>
                {s.descripcion && <p className="text-sm text-gray-600 mt-1">{s.descripcion}</p>}
                {usuario?.rol === 'DUENO' && (
                  <button
                    onClick={() => navigate(`/reservar/${prestador.id}?servicioId=${s.id}`)}
                    className="btn-primary text-xs py-1.5 px-3 mt-3 w-full"
                  >
                    Reservar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 text-lg mb-4">
          Reseñas ({prestador.totalReviews})
        </h2>
        {prestador.reviewsRecibidas.length === 0 ? (
          <p className="text-gray-400 text-sm">Todavía no tiene reseñas.</p>
        ) : (
          <div className="space-y-4">
            {prestador.reviewsRecibidas.map((r) => (
              <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={r.autor.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.autor.nombre)}&size=32`}
                    alt={r.autor.nombre}
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-800">{r.autor.nombre}</span>
                  <Stars valor={r.puntuacion} />
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(r.creadoEn).toLocaleDateString('es-AR')}
                  </span>
                </div>
                {r.comentario && <p className="text-sm text-gray-600 ml-9">{r.comentario}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
