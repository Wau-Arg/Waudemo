import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mascotasService } from '../services/mascotas.service';
import { reservasService } from '../services/reservas.service';
import { Link } from 'react-router-dom';
import Stars from '../components/Stars';

const TAMANIO_LABEL = { PEQUENO: 'Pequeño', MEDIANO: 'Mediano', GRANDE: 'Grande' };
const ESTADO_COLOR = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  CONFIRMADA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-red-100 text-red-700',
};

function DashboardDueno() {
  const [mascotas, setMascotas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [formMascota, setFormMascota] = useState({ nombre: '', raza: '', tamanio: 'MEDIANO' });
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('mascotas');

  useEffect(() => {
    mascotasService.listar().then(({ mascotas }) => setMascotas(mascotas));
    reservasService.misReservas().then(({ reservas }) => setReservas(reservas));
  }, []);

  const agregarMascota = async (e) => {
    e.preventDefault();
    const { mascota } = await mascotasService.crear(formMascota);
    setMascotas([...mascotas, mascota]);
    setShowForm(false);
    setFormMascota({ nombre: '', raza: '', tamanio: 'MEDIANO' });
  };

  const eliminarMascota = async (id) => {
    if (!confirm('¿Eliminás esta mascota?')) return;
    await mascotasService.eliminar(id);
    setMascotas(mascotas.filter((m) => m.id !== id));
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[['mascotas', '🐶 Mis mascotas'], ['reservas', '📅 Mis reservas']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === id ? 'bg-white border border-b-white border-gray-200 text-primary-600 -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'mascotas' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Mis mascotas</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-1.5 px-3">
              + Agregar mascota
            </button>
          </div>

          {showForm && (
            <form onSubmit={agregarMascota} className="card mb-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Nombre</label>
                  <input className="input" value={formMascota.nombre} onChange={(e) => setFormMascota({ ...formMascota, nombre: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Raza</label>
                  <input className="input" value={formMascota.raza} onChange={(e) => setFormMascota({ ...formMascota, raza: e.target.value })} placeholder="Opcional" />
                </div>
                <div>
                  <label className="label">Tamaño</label>
                  <select className="input" value={formMascota.tamanio} onChange={(e) => setFormMascota({ ...formMascota, tamanio: e.target.value })}>
                    <option value="PEQUENO">Pequeño</option>
                    <option value="MEDIANO">Mediano</option>
                    <option value="GRANDE">Grande</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancelar</button>
                <button type="submit" className="btn-primary text-sm">Guardar</button>
              </div>
            </form>
          )}

          {mascotas.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">🐾</p>
              <p>Todavía no registraste ninguna mascota</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mascotas.map((m) => (
                <div key={m.id} className="card flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">🐶</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{m.nombre}</p>
                    <p className="text-sm text-gray-500">{m.raza || 'Sin raza'} · {TAMANIO_LABEL[m.tamanio]}</p>
                  </div>
                  <button onClick={() => eliminarMascota(m.id)} className="text-gray-300 hover:text-red-400 text-lg">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'reservas' && (
        <div className="space-y-3">
          {reservas.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">📅</p>
              <p>No tenés reservas aún</p>
              <Link to="/buscar" className="btn-primary text-sm mt-3 inline-block">Buscar prestadores</Link>
            </div>
          ) : reservas.map((r) => (
            <div key={r.id} className="card flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {r.prestador.foto ? <img src={r.prestador.foto} className="w-full h-full object-cover" /> : '🦺'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{r.prestador.nombre}</p>
                <p className="text-sm text-gray-500">
                  {r.servicio.tipo} · {r.mascota.nombre} · {new Date(r.fecha).toLocaleDateString('es-AR')}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[r.estado]}`}>{r.estado}</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">${Number(r.precioTotal).toLocaleString('es-AR')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardPrestador() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    reservasService.recibidas(filtro || undefined).then(({ reservas }) => setReservas(reservas));
  }, [filtro]);

  const cambiarEstado = async (id, estado) => {
    await reservasService.actualizarEstado(id, estado);
    setReservas(reservas.map((r) => r.id === id ? { ...r, estado } : r));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-gray-900">Reservas recibidas</h2>
        <select className="input w-44" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="CONFIRMADA">Confirmadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </div>

      {reservas.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">📋</p>
          <p>No hay reservas {filtro ? filtro.toLowerCase() + 's' : ''} aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservas.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">🐶</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{r.dueno.nombre}</p>
                  <p className="text-sm text-gray-500">
                    {r.mascota.nombre} ({r.mascota.raza || r.mascota.tamanio}) ·{' '}
                    {r.servicio.tipo} · {new Date(r.fecha).toLocaleDateString('es-AR')}
                  </p>
                  {r.dueno.telefono && (
                    <p className="text-sm text-gray-500">📞 {r.dueno.telefono}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${Number(r.servicio.precio).toLocaleString('es-AR')}</p>
                  {r.estado === 'PENDIENTE' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => cambiarEstado(r.id, 'CONFIRMADA')} className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded font-medium">
                        Aceptar
                      </button>
                      <button onClick={() => cambiarEstado(r.id, 'CANCELADA')} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-medium">
                        Rechazar
                      </button>
                    </div>
                  )}
                  {r.estado !== 'PENDIENTE' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${r.estado === 'CONFIRMADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.estado}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { usuario } = useAuth();
  const esPrestador = usuario?.rol === 'PRESTADOR';
  const esAdmin = usuario?.rol === 'ADMIN';

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hola, {usuario?.nombre} 👋</h1>
          <p className="text-gray-500 mt-1">{esPrestador ? 'Panel de prestador' : esAdmin ? 'Panel de admin' : 'Panel de dueño'}</p>
        </div>
        {!esPrestador && !esAdmin && (
          <Link to="/buscar" className="btn-primary">🔍 Buscar prestadores</Link>
        )}
        {esAdmin && (
          <Link to="/admin" className="btn-primary">⚙️ Panel de admin</Link>
        )}
      </div>

      {esPrestador ? <DashboardPrestador /> : <DashboardDueno />}
    </main>
  );
}
