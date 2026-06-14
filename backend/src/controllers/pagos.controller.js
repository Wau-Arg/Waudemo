const { MercadoPagoConfig, Preference } = require('mercadopago');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const crearPreferencia = async (req, res, next) => {
  try {
    const { servicioId, prestadorId, mascotaId, fecha, notas } = req.body;

    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(servicioId) },
      include: { prestador: { select: { nombre: true } } },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    const preference = new Preference(mp);
    const resultado = await preference.create({
      body: {
        items: [{
          title: `WAU - ${servicio.tipo} con ${servicio.prestador.nombre}`,
          quantity: 1,
          unit_price: Number(servicio.precio),
          currency_id: 'ARS',
        }],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/reserva/exito`,
          failure: `${process.env.FRONTEND_URL}/reserva/error`,
          pending: `${process.env.FRONTEND_URL}/reserva/pendiente`,
        },
        auto_return: 'approved',
        metadata: { servicioId, prestadorId, mascotaId, fecha, notas, duenoId: req.usuario.id },
        notification_url: `${process.env.BACKEND_URL}/api/pagos/webhook`,
      },
    });

    res.json({ init_point: resultado.init_point, preferenceId: resultado.id });
  } catch (err) { next(err); }
};

// Webhook de Mercado Pago: crea la reserva cuando el pago se aprueba
const webhook = async (req, res, next) => {
  try {
    const { type, data } = req.body;
    if (type !== 'payment') return res.sendStatus(200);

    const { Payment } = require('mercadopago');
    const payment = new Payment(mp);
    const pago = await payment.get({ id: data.id });

    if (pago.status === 'approved') {
      const meta = pago.metadata;
      const servicio = await prisma.servicio.findUnique({ where: { id: Number(meta.servicio_id) } });

      await prisma.reserva.create({
        data: {
          duenoId: Number(meta.dueno_id),
          prestadorId: Number(meta.prestador_id),
          mascotaId: Number(meta.mascota_id),
          servicioId: Number(meta.servicio_id),
          fecha: new Date(meta.fecha),
          notas: meta.notas || null,
          precioTotal: servicio.precio,
          estado: 'CONFIRMADA',
        },
      });
    }

    res.sendStatus(200);
  } catch (err) { next(err); }
};

module.exports = { crearPreferencia, webhook };
