const { procesarChat } = require('../services/chatService');
const { construirResumenSesion } = require('../services/sesionesVozService');

async function responderChat(req, res, next) {
  try {
    const { mensaje, historial = [], sesionId = null } = req.body;

    if (!mensaje) {
      return res.status(400).json({
        ok: false,
        message: 'El campo mensaje es obligatorio.',
      });
    }

    const resultado = await procesarChat({ mensaje, historial, sesionId });

    return res.json({
      ok: true,
      data: resultado,
    });
  } catch (error) {
    next(error);
  }
}

async function obtenerResumenDeSesion(req, res, next) {
  try {
    const { sesionId } = req.params;

    const resumen = await construirResumenSesion({ sesionId });

    return res.json({
      ok: true,
      data: resumen,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  responderChat,
  obtenerResumenDeSesion,
};
