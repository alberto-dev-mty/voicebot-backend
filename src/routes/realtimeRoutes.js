const express = require('express');
const {
  crearSesion,
  guardarMensajesSesion,
  obtenerMensajesSesion,
} = require('../controllers/realtimeController');

const router = express.Router();

router.post('/session', crearSesion);
router.get('/sessions/:sesionId/messages', obtenerMensajesSesion);
router.post('/sessions/:sesionId/messages', guardarMensajesSesion);

module.exports = router;
