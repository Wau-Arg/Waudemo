import { useState, useEffect } from 'react';
import { adminService } from '../services/admin.service';

const ESTADOS = ['', 'PENDIENTE', 'CONFIRMADA', 'CANCELADA'];

export default function Admin() {
  const [tab, setTab] = useState('metricas');
  const [metricas, setMetricas] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    adminService.metricas().then(({ metricas }) => setMetricas(metricas)).catch(console.error);
  }, []);

  useEffect(() => {
    if (tab === 'usuarios') {
      setCargando(true);
      adminService.usuarios({ rol: filtroRol || undefined })
        .then(({ usuarios }) => setUsuarios(usuarios))
        .finally(() => setCargando(false));
    }
    if (tab === 'reservas') {
      setCargando(true);
      adminService.reservas({ estado: filtroEstado || undefined })
        .then(({ reservas }) => setReservas(reservas))
        .finally(() => setCargando(false));
    }
  }, [tab, filtroEstado, filtroRol]);

  const aprobar = async (id, aprobado) => {
    await adminService.aprobarPrestador(id, aprobado);
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, aprobado } : u));
  };

  const TABS = [
    { id: 'metricas', label: '📊 Métricas' },
    { id: 'usuarios', label: '👥 Usuarios' },
    { id: 'reservas', label: '📅 Reservas' },
  ];

  const ESTADO_COLOR = {
    PENDIENTE: 'bg-yellow-100 text-yellow-700',
    CONFIRMADA: 'bg-green-100 text-green-700',
    CANCELADA: 'bg-red-100 text-red-700',
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de administración</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.id
                ? 'bg-white border border-b-white border-gray-200 text-primary-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Métricas */}
      {tab === 'metricas' && metricas && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Dueños', valor: metricas.totalUsuarios, icono: '🐶' },
            { label: 'Prestadores', valor: metricas.totalPrestadores, icono: '🦺' },
            { label: 'Reservas totales', valor: metricas.totalReservas, icono: '📋' },
            { label: 'Reservas este mes', valor: metricas.reservasMes, icono: '📅' },
            {
              label: 'Ingresos este mes',
              valor: `$${Number(metricas.ingresosMes).toLocaleString('es-AR')}`,
              icono: '💰',
            },
          ].map((m) => (
            <div key={m.label} className="card text-center">
              <div className="text-3xl mb-1">{m.icono}</div>
              <div className="text-2xl font-bold text-gray-900">{m.valor}</div>
              <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Usuarios */}
      {tab === 'usuarios' && (
        <>
          <div className="flex gap-3 mb-4">
            <select className="input w-40" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
              <option value="">Todos los roles</option>
              <option value="DUENO">Dueños</option>
              <option value="PRESTADOR">Prestadores</option>
            </select>
          </div>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nombre', 'Email', 'Rol', 'Ubicación', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cargando
                  ? Array(5).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                    ))
                  : usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{u.nombre}</td>
                        <td className="px-4 py-3 text-gray-500">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.rol === 'PRESTADOR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.ubicacion || '—'}</td>
                        <td className="px-4 py-3">
                          {u.rol === 'PRESTADOR' && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.aprobado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {u.aprobado ? 'Aprobado' : 'Pendiente'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {u.rol === 'PRESTADOR' && (
                            <button
                              onClick={() => aprobar(u.id, !u.aprobado)}
                              className={`text-xs px-2 py-1 rounded font-medium ${u.aprobado ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                            >
                              {u.aprobado ? 'Rechazar' : 'Aprobar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Reservas */}
      {tab === 'reservas' && (
        <>
          <div className="flex gap-3 mb-4">
            <select className="input w-44" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              {ESTADOS.map((e) => <option key={e} value={e}>{e || 'Todos los estados'}</option>)}
            </select>
          </div>
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['ID', 'Dueño', 'Prestador', 'Mascota', 'Servicio', 'Fecha', 'Estado', 'Total'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cargando
                  ? Array(5).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                    ))
                  : reservas.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400">#{r.id}</td>
                        <td className="px-4 py-3 font-medium">{r.dueno.nombre}</td>
                        <td className="px-4 py-3">{r.prestador.nombre}</td>
                        <td className="px-4 py-3">{r.mascota.nombre}</td>
                        <td className="px-4 py-3">{r.servicio.tipo}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(r.fecha).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_COLOR[r.estado]}`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          ${Number(r.precioTotal).toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
