const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listar = async (req, res, next) => {
  try {
    const mascotas = await prisma.mascota.findMany({
      where: { duenoId: req.usuario.id },
    });
    res.json({ mascotas });
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { nombre, raza, tamanio, foto } = req.body;
    const mascota = await prisma.mascota.create({
      data: { nombre, raza, tamanio, foto, duenoId: req.usuario.id },
    });
    res.status(201).json({ mascota });
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mascota = await prisma.mascota.findFirst({
      where: { id: Number(id), duenoId: req.usuario.id },
    });
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    const actualizada = await prisma.mascota.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json({ mascota: actualizada });
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mascota = await prisma.mascota.findFirst({
      where: { id: Number(id), duenoId: req.usuario.id },
    });
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    await prisma.mascota.delete({ where: { id: Number(id) } });
    res.json({ mensaje: 'Mascota eliminada' });
  } catch (err) { next(err); }
};

module.exports = { listar, crear, actualizar, eliminar };
