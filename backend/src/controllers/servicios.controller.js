const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listarMios = async (req, res, next) => {
  try {
    const servicios = await prisma.servicio.findMany({
      where: { prestadorId: req.usuario.id },
    });
    res.json({ servicios });
  } catch (err) { next(err); }
};

const crear = async (req, res, next) => {
  try {
    const { tipo, precio, duracion, descripcion } = req.body;
    const servicio = await prisma.servicio.create({
      data: { tipo, precio, duracion: Number(duracion), descripcion, prestadorId: req.usuario.id },
    });
    res.status(201).json({ servicio });
  } catch (err) { next(err); }
};

const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await prisma.servicio.findFirst({
      where: { id: Number(id), prestadorId: req.usuario.id },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    const actualizado = await prisma.servicio.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json({ servicio: actualizado });
  } catch (err) { next(err); }
};

const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servicio = await prisma.servicio.findFirst({
      where: { id: Number(id), prestadorId: req.usuario.id },
    });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    await prisma.servicio.delete({ where: { id: Number(id) } });
    res.json({ mensaje: 'Servicio eliminado' });
  } catch (err) { next(err); }
};

module.exports = { listarMios, crear, actualizar, eliminar };
