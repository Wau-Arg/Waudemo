import api from './api';

export const adminService = {
  async metricas() {
    const { data } = await api.get('/admin/metricas');
    return data;
  },
  async usuarios(params) {
    const { data } = await api.get('/admin/usuarios', { params });
    return data;
  },
  async reservas(params) {
    const { data } = await api.get('/admin/reservas', { params });
    return data;
  },
  async aprobarPrestador(id, aprobado) {
    const { data } = await api.patch(`/admin/prestadores/${id}/aprobar`, { aprobado });
    return data;
  },
};
