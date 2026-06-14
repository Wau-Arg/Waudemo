const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { enviarEmailReserva } = require('../services/email.service');

const crear = async (req, res, next) => {
  try {
    const { prestadorId, mascotaId, servicioId, fecha, notas } = req.body;

    const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    const reserva = await prisma.reserva.create({
      data: {
        duenoId: req.usuario.id,
        prestadorId: Number(prestadorId),
        mascotaId: Number(mascotaId),
        servicioId: Number(servicioId),
        fecha: new Date(fecha),
        notas,
        precioTotal: servicio.precio,
        estado: 'PENDIENTE',
      },
      include: {
        dueno: { select: { nombre: true, email: true } },
        prestador: { select: { nombre: true, email: true } },
        mascota: { select: { nombre: true } },
        servicio: { select: { tipo: true } },
      },
    });

    // Notificar al prestador por email (no bloqueante)
    enviarEmailReserva(reserva).catch(console.error);

    res.status(201).json({ reserva });
  } catch (err) { next(err); }
};

const listarDueno = async (req, res, next) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { duenoId: req.usuario.id },
      orderBy: { fecha: 'desc' },
      include: {
        prestador: { select: { nombre: true, foto: true } },
        mascota: { select: { nombre: true } },
        servicio: { select: { tipo: true } },
        review: true,
      },
    });
    res.json({ reservas });
  } catch (err) { next(err); }
};

const listarPrestador = async (req, res, next) => {
  try {
    const { estado } = req.query;
    const reservas = await prisma.reserva.findMany({
      where: {
        prestadorId: req.usuario.id,
        ...(estado && { estado }),
      },
      orderBy: { fecha: 'desc' },
      include: {
        dueno: { select: { nombre: true, foto: true, telefono: true } },
        mascota: { select: { nombre: true, raza: true, tamanio: true } },
        servicio: { select: { tipo: true, precio: true } },
      },
    });
    res.json({ reservas });
  } catch (err) { next(err); }
};

const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const reserva = await prisma.reserva.findFirst({
      where: { id: Number(id), prestadorId: req.usuario.id },
    });
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado },
    });
    res.json({ reserva: actualizada });
  } catch (err) { next(err); }
};

module.exports = { crear, listarDueno, listarPrestador, actualizarEstado };
