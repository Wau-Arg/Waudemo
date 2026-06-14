import api from './api';

export const mascotasService = {
  async listar() {
    const { data } = await api.get('/mascotas');
    return data;
  },
  async crear(datos) {
    const { data } = await api.post('/mascotas', datos);
    return data;
  },
  async eliminar(id) {
    const { data } = await api.delete(`/mascotas/${id}`);
    return data;
  },
};
