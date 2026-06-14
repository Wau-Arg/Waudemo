const { Router } = require('express');
const { crear } = require('../controllers/reviews.controller');
const { verificarToken, soloRol } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', verificarToken, soloRol('DUENO'), crear);

module.exports = router;
