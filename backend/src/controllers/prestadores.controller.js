const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Búsqueda pública de prestadores con filtros
const buscar = async (req, res, next) => {
  try {
    const { tipo, precioMax, ubicacion } = req.query;

    const where = {
      rol: 'PRESTADOR',
      aprobado: true,
      servicios: {
        some: {
          activo: true,
          ...(tipo && { tipo }),
          ...(precioMax && { precio: { lte: Number(precioMax) } }),
        },
      },
      ...(ubicacion && {
        ubicacion: { contains: ubicacion, mode: 'insensitive' },
      }),
    };

    const prestadores = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        foto: true,
        ubicacion: true,
        lat: true,
        lng: true,
        servicios: {
          where: { activo: true },
          select: { id: true, tipo: true, precio: true, duracion: true },
        },
        reviewsRecibidas: {
          select: { puntuacion: true },
        },
      },
    });

    // Calcular promedio de reviews
    const resultado = prestadores.map((p) => {
      const reviews = p.reviewsRecibidas;
      const promedio =
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.puntuacion, 0) / reviews.length
          : null;
      return { ...p, reviewsRecibidas: undefined, rating: promedio, totalReviews: reviews.length };
    });

    res.json({ prestadores: resultado });
  } catch (err) { next(err); }
};

// Perfil público de un prestador
const perfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prestador = await prisma.usuario.findFirst({
      where: { id: Number(id), rol: 'PRESTADOR' },
      select: {
        id: true,
        nombre: true,
        foto: true,
        ubicacion: true,
        telefono: true,
        descripcion: true,
        lat: true,
        lng: true,
        aprobado: true,
        creadoEn: true,
        servicios: {
          where: { activo: true },
          select: { id: true, tipo: true, precio: true, duracion: true, descripcion: true },
        },
        reviewsRecibidas: {
          orderBy: { creadoEn: 'desc' },
          take: 20,
          select: {
            id: true,
            puntuacion: true,
            comentario: true,
            creadoEn: true,
            autor: { select: { id: true, nombre: true, foto: true } },
          },
        },
      },
    });

    if (!prestador) return res.status(404).json({ error: 'Prestador no encontrado' });

    const reviews = prestador.reviewsRecibidas;
    const rating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.puntuacion, 0) / reviews.length
        : null;

    res.json({ prestador: { ...prestador, rating, totalReviews: reviews.length } });
  } catch (err) { next(err); }
};

module.exports = { buscar, perfil };
