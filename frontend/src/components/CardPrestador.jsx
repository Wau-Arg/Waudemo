import { Link } from 'react-router-dom';
import Stars from './Stars';

const TIPO_LABEL = {
  PASEO: '🦮 Paseo',
  GUARDERIA: '🏠 Guardería',
  HOSPEDAJE: '🌙 Hospedaje',
  ADIESTRAMIENTO: '🎓 Adiestramiento',
};

export default function CardPrestador({ prestador, compact = false }) {
  const precioMin = prestador.servicios?.length
    ? Math.min(...prestador.servicios.map((s) => Number(s.precio)))
    : null;

  return (
    <div className={`card hover:shadow-md transition-shadow ${compact ? 'p-4' : ''}`}>
      <div className="flex items-start gap-3">
        <img
          src={prestador.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(prestador.nombre)}&background=f18c11&color=fff`}
          alt={prestador.nombre}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{prestador.nombre}</h3>
          {prestador.ubicacion && (
            <p className="text-xs text-gray-500">📍 {prestador.ubicacion}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            {prestador.rating ? (
              <>
                <Stars valor={prestador.rating} />
                <span className="text-xs text-gray-500">
                  {prestador.rating.toFixed(1)} ({prestador.totalReviews})
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400">Sin reseñas aún</span>
            )}
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1">
          {prestador.servicios?.map((s) => (
            <span key={s.id} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
              {TIPO_LABEL[s.tipo]}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        {precioMin && (
          <span className="text-sm font-semibold text-gray-800">
            Desde <span className="text-primary-500">${precioMin.toLocaleString('es-AR')}</span>
          </span>
        )}
        <Link
          to={`/prestador/${prestador.id}`}
          className="btn-primary text-xs py-1.5 px-3 ml-auto"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
