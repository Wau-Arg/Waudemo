import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, restaura la sesión si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem('wau_token');
    const usuarioGuardado = localStorage.getItem('wau_usuario');

    if (token && usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem('wau_usuario');
      }
    }
    setCargando(false);
  }, []);

  const login = async (email, password) => {
    const { usuario, token } = await authService.login(email, password);
    localStorage.setItem('wau_token', token);
    localStorage.setItem('wau_usuario', JSON.stringify(usuario));
    setUsuario(usuario);
    return usuario;
  };

  const register = async (datos) => {
    const { usuario, token } = await authService.register(datos);
    localStorage.setItem('wau_token', token);
    localStorage.setItem('wau_usuario', JSON.stringify(usuario));
    setUsuario(usuario);
    return usuario;
  };

  const logout = () => {
    localStorage.removeItem('wau_token');
    localStorage.removeItem('wau_usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
