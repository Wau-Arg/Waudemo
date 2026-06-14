const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = Router();

const validarRegister = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .isIn(['DUENO', 'PRESTADOR'])
    .withMessage('El rol debe ser DUENO o PRESTADOR'),
];

const validarLogin = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

// POST /api/auth/register
router.post('/register', validarRegister, register);

// POST /api/auth/login
router.post('/login', validarLogin, login);

// GET /api/auth/me  (requiere token)
router.get('/me', verificarToken, me);

module.exports = router;
