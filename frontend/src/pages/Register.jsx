import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: params.get('rol') === 'PRESTADOR' ? 'PRESTADOR' : 'DUENO',
    ubicacion: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const errores = err.response?.data?.errores;
      if (errores?.length) {
        setError(errores.map((e) => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Error al registrarse');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-3xl">🐾</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Unite a la comunidad WAU</p>
        </div>

        {/* Selector de rol */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-5">
          {[
            { value: 'DUENO', label: '🐶 Soy dueño' },
            { value: 'PRESTADOR', label: '🦺 Soy prestador' },
          ].map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => setForm({ ...form, rol: opcion.value })}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.rol === opcion.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opcion.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="input"
              placeholder="Juan García"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div>
            <label className="label">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="input"
              placeholder="Buenos Aires, CABA"
            />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="input"
              placeholder="+54 11 1234-5678"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-2.5" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-primary-500 font-medium hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
