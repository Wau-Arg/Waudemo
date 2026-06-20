import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el token JWT a cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wau_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el servidor responde 401, limpia la sesión local
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wau_token');
      localStorage.removeItem('wau_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
