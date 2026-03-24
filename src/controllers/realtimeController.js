const { crearSesionRealtime } = require('../services/realtimeService');
const {
  inicializarSesion,
  registrarInteraccion,
  obtenerHistorialSesion,
} = require('../services/sesionesVozService');

async function crearSesion(req, res, next) {
  try {
    const { sdp, sesionId = null } = req.body;

    await inicializarSesion({ sesionId });
    const result = await crearSesionRealtime({ sdp });

    res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function guardarMensajesSesion(req, res, next) {
  try {
    const { sesionId } = req.params;
    const { mensajeUsuario, respuestaAsistente } = req.body;

    if (!sesionId || !mensajeUsuario || !respuestaAsistente) {
      return res.status(400).json({
        ok: false,
        message: 'sesionId, mensajeUsuario y respuestaAsistente son obligatorios.',
      });
    }

    await registrarInteraccion({
      sesionId,
      mensajeUsuario,
      respuestaAsistente,
    });

    return res.json({
      ok: true,
      data: {
        sesionId,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function obtenerMensajesSesion(req, res, next) {
  try {
    const { sesionId } = req.params;
    const historial = await obtenerHistorialSesion({ sesionId, limite: 50 });

    return res.json({
      ok: true,
      data: historial,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crearSesion,
  guardarMensajesSesion,
  obtenerMensajesSesion,
};
