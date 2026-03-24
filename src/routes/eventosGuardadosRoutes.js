const express = require('express');
const {
  listarEventosGuardados,
  listarEventosGuardadosPorSesion,
  registrarEventoGuardado,
  eliminarEventoGuardadoPorId,
} = require('../controllers/eventosGuardadosController');

const router = express.Router();

router.get('/sesion/:sesionId', listarEventosGuardadosPorSesion);
router.get('/', listarEventosGuardados);
router.post('/', registrarEventoGuardado);
router.delete('/:id', eliminarEventoGuardadoPorId);

module.exports = router;
