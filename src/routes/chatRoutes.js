const express = require('express');
const {
  responderChat,
  obtenerResumenDeSesion,
} = require('../controllers/chatController');

const router = express.Router();

router.get('/sesion/:sesionId/resumen', obtenerResumenDeSesion);
router.post('/', responderChat);

module.exports = router;
