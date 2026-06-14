const { Router } = require('express');
const { listar, crear, actualizar, eliminar } = require('../controllers/mascotas.controller');
const { verificarToken, soloRol } = require('../middleware/auth.middleware');

const router = Router();
router.use(verificarToken, soloRol('DUENO'));

router.get('/', listar);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;
