import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold text-primary-500">WAU</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/buscar" className="text-sm font-medium text-gray-600 hover:text-primary-500">
            Buscar
          </Link>
          {usuario ? (
            <>
              <span className="text-sm text-gray-600">Hola, {usuario.nombre}</span>
              <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-500">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-500">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
