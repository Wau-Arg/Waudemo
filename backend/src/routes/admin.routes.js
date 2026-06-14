const { Router } = require('express');
const { metricas, listarUsuarios, listarReservas, aprobarPrestador } = require('../controllers/admin.controller');
const { verificarToken, soloRol } = require('../middleware/auth.middleware');

const router = Router();
router.use(verificarToken, soloRol('ADMIN'));

router.get('/metricas', metricas);
router.get('/usuarios', listarUsuarios);
router.get('/reservas', listarReservas);
router.patch('/prestadores/:id/aprobar', aprobarPrestador);

module.exports = router;
