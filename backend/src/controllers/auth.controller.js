const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Campos del usuario que se devuelven al cliente (sin password)
const CAMPOS_PUBLICOS = {
  id: true,
  nombre: true,
  email: true,
  foto: true,
  ubicacion: true,
  telefono: true,
  rol: true,
  creadoEn: true,
};

const register = async (req, res, next) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, email, password, rol, ubicacion, telefono } = req.body;

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    const hash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hash, rol, ubicacion, telefono },
      select: CAMPOS_PUBLICOS,
    });

    const token = generarToken(usuario);

    res.status(201).json({ usuario, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const { password: _, ...usuarioPublico } = usuario;
    const token = generarToken(usuarioPublico);

    res.json({ usuario: usuarioPublico, token });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: CAMPOS_PUBLICOS,
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
