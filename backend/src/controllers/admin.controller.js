const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const metricas = async (req, res, next) => {
  try {
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [totalUsuarios, totalPrestadores, totalReservas, reservasMes, ingresosMes] =
      await Promise.all([
        prisma.usuario.count({ where: { rol: 'DUENO' } }),
        prisma.usuario.count({ where: { rol: 'PRESTADOR' } }),
        prisma.reserva.count(),
        prisma.reserva.count({ where: { creadoEn: { gte: inicioMes } } }),
        prisma.reserva.aggregate({
          where: { estado: 'CONFIRMADA', creadoEn: { gte: inicioMes } },
          _sum: { precioTotal: true },
        }),
      ]);

    res.json({
      metricas: {
        totalUsuarios,
        totalPrestadores,
        totalReservas,
        reservasMes,
        ingresosMes: ingresosMes._sum.precioTotal || 0,
      },
    });
  } catch (err) { next(err); }
};

const listarUsuarios = async (req, res, next) => {
  try {
    const { rol, page = 1 } = req.query;
    const take = 20;
    const usuarios = await prisma.usuario.findMany({
      where: { ...(rol && { rol }) },
      select: {
        id: true, nombre: true, email: true, rol: true,
        ubicacion: true, aprobado: true, creadoEn: true,
        _count: { select: { reservasDueno: true, reservasPrestador: true } },
      },
      orderBy: { creadoEn: 'desc' },
      take,
      skip: (Number(page) - 1) * take,
    });
    const total = await prisma.usuario.count({ where: { ...(rol && { rol }) } });
    res.json({ usuarios, total, paginas: Math.ceil(total / take) });
  } catch (err) { next(err); }
};

const listarReservas = async (req, res, next) => {
  try {
    const { estado, page = 1 } = req.query;
    const take = 20;
    const reservas = await prisma.reserva.findMany({
      where: { ...(estado && { estado }) },
      include: {
        dueno: { select: { nombre: true, email: true } },
        prestador: { select: { nombre: true, email: true } },
        servicio: { select: { tipo: true } },
        mascota: { select: { nombre: true } },
      },
      orderBy: { creadoEn: 'desc' },
      take,
      skip: (Number(page) - 1) * take,
    });
    const total = await prisma.reserva.count({ where: { ...(estado && { estado }) } });
    res.json({ reservas, total, paginas: Math.ceil(total / take) });
  } catch (err) { next(err); }
};

const aprobarPrestador = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { aprobado } = req.body;
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { aprobado },
      select: { id: true, nombre: true, aprobado: true },
    });
    res.json({ usuario });
  } catch (err) { next(err); }
};

module.exports = { metricas, listarUsuarios, listarReservas, aprobarPrestador };
