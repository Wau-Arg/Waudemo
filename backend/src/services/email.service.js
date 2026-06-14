const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarEmailReserva = async (reserva) => {
  if (!process.env.RESEND_API_KEY) return; // Skip si no está configurado

  await resend.emails.send({
    from: 'WAU <noreply@wau.com.ar>',
    to: reserva.prestador.email,
    subject: `Nueva solicitud de reserva - WAU`,
    html: `
      <h2>¡Tenés una nueva solicitud!</h2>
      <p><strong>${reserva.dueno.nombre}</strong> quiere reservar un servicio para su mascota <strong>${reserva.mascota.nombre}</strong>.</p>
      <ul>
        <li>Servicio: ${reserva.servicio.tipo}</li>
        <li>Fecha: ${new Date(reserva.fecha).toLocaleDateString('es-AR')}</li>
        <li>Precio: $${reserva.precioTotal}</li>
      </ul>
      <p>Ingresá a WAU para confirmar o rechazar la reserva.</p>
    `,
  });
};

module.exports = { enviarEmailReserva };
