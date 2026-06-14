import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Busqueda from './pages/Busqueda';
import PerfilPrestador from './pages/PerfilPrestador';
import Reservar from './pages/Reservar';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

const RutaProtegida = ({ children, roles }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="flex items-center justify-center h-screen text-gray-400">Cargando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/dashboard" replace />;
  return children;
};

const RutaPublica = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="flex items-center justify-center h-screen text-gray-400">Cargando...</div>;
  return !usuario ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Busqueda />} />
        <Route path="/prestador/:id" element={<PerfilPrestador />} />
        <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
        <Route path="/register" element={<RutaPublica><Register /></RutaPublica>} />
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/reservar/:prestadorId" element={<RutaProtegida roles={['DUENO']}><Reservar /></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida roles={['ADMIN']}><Admin /></RutaProtegida>} />
        <Route path="/reserva/exito" element={<div className="flex items-center justify-center h-screen"><div className="card text-center"><p className="text-4xl mb-3">🎉</p><h2 className="text-xl font-bold">¡Reserva confirmada!</h2><p className="text-gray-500 mt-1">Te avisamos por email cuando el prestador confirme.</p></div></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
