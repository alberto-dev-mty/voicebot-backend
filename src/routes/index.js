const express = require('express');
const eventosGuardadosRoutes = require('./eventosGuardadosRoutes');
const chatRoutes = require('./chatRoutes');
const vozRoutes = require('./vozRoutes');
const realtimeRoutes = require('./realtimeRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Backend funcionando correctamente.',
  });
});

router.use('/eventos-guardados', eventosGuardadosRoutes);
router.use('/chat', chatRoutes);
router.use('/voz', vozRoutes);
router.use('/realtime', realtimeRoutes);

module.exports = router;
