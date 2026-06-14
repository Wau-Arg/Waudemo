import { useState, useEffect } from 'react';
import { prestadoresService } from '../services/prestadores.service';
import CardPrestador from '../components/CardPrestador';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import MapaPrestadores from '../components/MapaPrestadores';

export default function Busqueda() {
  const [prestadores, setPrestadores] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [cargando, setCargando] = useState(true);
  const [vistaLista, setVistaLista] = useState(false);

  const buscar = async (f) => {
    setCargando(true);
    try {
      const { prestadores } = await prestadoresService.buscar(f);
      setPrestadores(prestadores);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { buscar(filtros); }, []);

  const handleFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    buscar(nuevosFiltros);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Buscar prestadores</h1>
        <div className="card p-4">
          <FiltrosBusqueda filtros={filtros} onChange={handleFiltros} />
        </div>
      </div>

      {/* Toggle vista */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {cargando ? 'Buscando...' : `${prestadores.length} prestadores encontrados`}
        </p>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[{ label: '🗺️ Mapa', val: false }, { label: '📋 Lista', val: true }].map((v) => (
            <button
              key={String(v.val)}
              onClick={() => setVistaLista(v.val)}
              className={`px-3 py-1.5 text-sm transition-colors ${
                vistaLista === v.val ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {vistaLista ? (
        /* Vista lista */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cargando
            ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="card h-40 animate-pulse bg-gray-100" />
              ))
            : prestadores.map((p) => <CardPrestador key={p.id} prestador={p} />)}
        </div>
      ) : (
        /* Vista mapa + lista lateral */
        <div className="flex gap-4 h-[600px]">
          <div className="flex-1 rounded-xl overflow-hidden shadow">
            <MapaPrestadores prestadores={prestadores} />
          </div>
          <div className="w-80 overflow-y-auto space-y-3 pr-1">
            {cargando
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="card h-32 animate-pulse bg-gray-100" />
                ))
              : prestadores.length === 0
              ? (
                <div className="card text-center py-10 text-gray-400">
                  <p className="text-2xl mb-2">🔍</p>
                  <p>No hay prestadores con esos filtros</p>
                </div>
              )
              : prestadores.map((p) => <CardPrestador key={p.id} prestador={p} compact />)}
          </div>
        </div>
      )}
    </main>
  );
}
