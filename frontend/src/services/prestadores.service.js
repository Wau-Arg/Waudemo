import api from './api';

export const prestadoresService = {
  async buscar(filtros = {}) {
    const { data } = await api.get('/prestadores', { params: filtros });
    return data;
  },
  async perfil(id) {
    const { data } = await api.get(`/prestadores/${id}`);
    return data;
  },
};
