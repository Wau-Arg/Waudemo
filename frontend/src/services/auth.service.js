import api from './api';

export const authService = {
  async register(datos) {
    const { data } = await api.post('/auth/register', datos);
    return data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
