const express = require('express');
const eventosGuardadosRoutes = require('./eventosGuardadosRoutes');
const chatRoutes = require('./chatRoutes');
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
router.use('/realtime', realtimeRoutes);

module.exports = router;
