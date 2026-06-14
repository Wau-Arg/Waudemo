const { Router } = require('express');
const { listarMios, crear, actualizar, eliminar } = require('../controllers/servicios.controller');
const { verificarToken, soloRol } = require('../middleware/auth.middleware');

const router = Router();
router.use(verificarToken, soloRol('PRESTADOR'));

router.get('/', listarMios);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;
