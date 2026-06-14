const SERVICIOS = [
  { value: '', label: 'Todos los servicios' },
  { value: 'PASEO', label: '🦮 Paseo' },
  { value: 'GUARDERIA', label: '🏠 Guardería' },
  { value: 'HOSPEDAJE', label: '🌙 Hospedaje' },
  { value: 'ADIESTRAMIENTO', label: '🎓 Adiestramiento' },
];

export default function FiltrosBusqueda({ filtros, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="label">Servicio</label>
        <select
          className="input w-48"
          value={filtros.tipo || ''}
          onChange={(e) => onChange({ ...filtros, tipo: e.target.value || undefined })}
        >
          {SERVICIOS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Precio máximo</label>
        <input
          type="number"
          className="input w-36"
          placeholder="Ej: 5000"
          value={filtros.precioMax || ''}
          onChange={(e) => onChange({ ...filtros, precioMax: e.target.value || undefined })}
        />
      </div>
      <div>
        <label className="label">Ubicación</label>
        <input
          type="text"
          className="input w-48"
          placeholder="Ej: Palermo"
          value={filtros.ubicacion || ''}
          onChange={(e) => onChange({ ...filtros, ubicacion: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
