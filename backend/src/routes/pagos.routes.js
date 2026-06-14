const { Router } = require('express');
const { crearPreferencia, webhook } = require('../controllers/pagos.controller');
const { verificarToken, soloRol } = require('../middleware/auth.middleware');

const router = Router();

router.post('/preferencia', verificarToken, soloRol('DUENO'), crearPreferencia);
router.post('/webhook', webhook); // Público — llamado por Mercado Pago

module.exports = router;
