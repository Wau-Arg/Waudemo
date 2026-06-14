import api from './api';

export const reservasService = {
  async crear(datos) {
    const { data } = await api.post('/reservas', datos);
    return data;
  },
  async misReservas() {
    const { data } = await api.get('/reservas/mis-reservas');
    return data;
  },
  async recibidas(estado) {
    const { data } = await api.get('/reservas/recibidas', { params: { estado } });
    return data;
  },
  async actualizarEstado(id, estado) {
    const { data } = await api.patch(`/reservas/${id}/estado`, { estado });
    return data;
  },
  async crearPreferenciaPago(datos) {
    const { data } = await api.post('/pagos/preferencia', datos);
    return data;
  },
};
