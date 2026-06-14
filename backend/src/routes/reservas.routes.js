const { Router } = require('express');
const { crear, listarDueno, listarPrestador, actualizarEstado } = require('../controllers/reservas.controller');
const { verificarToken, soloRol } = require('../middleware/auth.middleware');

const router = Router();
router.use(verificarToken);

router.post('/', soloRol('DUENO'), crear);
router.get('/mis-reservas', soloRol('DUENO'), listarDueno);
router.get('/recibidas', soloRol('PRESTADOR'), listarPrestador);
router.patch('/:id/estado', soloRol('PRESTADOR'), actualizarEstado);

module.exports = router;
