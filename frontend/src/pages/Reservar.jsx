import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { prestadoresService } from '../services/prestadores.service';
import { mascotasService } from '../services/mascotas.service';
import { reservasService } from '../services/reservas.service';
import { useAuth } from '../context/AuthContext';

export default function Reservar() {
  const { prestadorId } = useParams();
  const [params] = useSearchParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [prestador, setPrestador] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    servicioId: params.get('servicioId') || '',
    mascotaId: '',
    fecha: '',
    notas: '',
  });

  useEffect(() => {
    Promise.all([
      prestadoresService.perfil(prestadorId),
      mascotasService.listar(),
    ]).then(([{ prestador }, { mascotas }]) => {
      setPrestador(prestador);
      setMascotas(mascotas);
    }).finally(() => setCargando(false));
  }, [prestadorId]);

  const servicioSeleccionado = prestador?.servicios?.find(
    (s) => s.id === Number(form.servicioId)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      // Con Mercado Pago: redirigir al checkout
      if (process.env.MP_ACCESS_TOKEN) {
        const { init_point } = await reservasService.crearPreferenciaPago({
          ...form,
          prestadorId,
        });
        window.location.href = init_point;
      } else {
        // Sin MP: crear reserva directamente (modo demo)
        await reservasService.crear({ ...form, prestadorId });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la reserva');
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="card h-64 animate-pulse bg-gray-100" />
    </div>
  );

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Reservar servicio</h1>
        <p className="text-gray-500 text-sm mb-6">Con {prestador?.nombre}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Servicio</label>
            <select
              className="input"
              value={form.servicioId}
              onChange={(e) => setForm({ ...form, servicioId: e.target.value })}
              required
            >
              <option value="">Seleccioná un servicio</option>
              {prestador?.servicios?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.tipo} — ${Number(s.precio).toLocaleString('es-AR')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Tu mascota</label>
            {mascotas.length === 0 ? (
              <p className="text-sm text-orange-600">
                No tenés mascotas registradas.{' '}
                <button type="button" onClick={() => navigate('/dashboard')} className="underline">
                  Agregá una primero
                </button>
              </p>
            ) : (
              <select
                className="input"
                value={form.mascotaId}
                onChange={(e) => setForm({ ...form, mascotaId: e.target.value })}
                required
              >
                <option value="">Seleccioná tu mascota</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre} ({m.raza || m.tamanio})</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="label">Fecha y hora</label>
            <input
              type="datetime-local"
              className="input"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Notas para el prestador (opcional)</label>
            <textarea
              className="input h-20 resize-none"
              placeholder="Ej: Mi perro es muy activo..."
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
            />
          </div>

          {servicioSeleccionado && (
            <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total a pagar</span>
                <span className="font-bold text-primary-600 text-base">
                  ${Number(servicioSeleccionado.precio).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-3"
            disabled={enviando || mascotas.length === 0}
          >
            {enviando ? 'Procesando...' : '💳 Confirmar y pagar'}
          </button>
        </form>
      </div>
    </main>
  );
}
