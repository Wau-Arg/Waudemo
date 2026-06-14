const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crear = async (req, res, next) => {
  try {
    const { reservaId, puntuacion, comentario } = req.body;

    const reserva = await prisma.reserva.findFirst({
      where: { id: Number(reservaId), duenoId: req.usuario.id, estado: 'CONFIRMADA' },
    });
    if (!reserva) return res.status(400).json({ error: 'Solo podés reseñar reservas confirmadas' });

    const yaExiste = await prisma.review.findUnique({ where: { reservaId: Number(reservaId) } });
    if (yaExiste) return res.status(409).json({ error: 'Ya dejaste una reseña para esta reserva' });

    const review = await prisma.review.create({
      data: {
        reservaId: Number(reservaId),
        autorId: req.usuario.id,
        prestadorId: reserva.prestadorId,
        puntuacion: Number(puntuacion),
        comentario,
      },
    });
    res.status(201).json({ review });
  } catch (err) { next(err); }
};

module.exports = { crear };
