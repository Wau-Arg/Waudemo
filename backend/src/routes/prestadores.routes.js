const { Router } = require('express');
const { buscar, perfil } = require('../controllers/prestadores.controller');

const router = Router();

router.get('/', buscar);
router.get('/:id', perfil);

module.exports = router;
