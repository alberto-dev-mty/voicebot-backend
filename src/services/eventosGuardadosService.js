const {
  obtenerEventosGuardados,
  obtenerEventosGuardadosPorSesion,
  crearEventoGuardado,
  eliminarEventoGuardado,
} = require('../models/eventosGuardadosModel');
const { inicializarSesion } = require('./sesionesVozService');

async function guardarEventoFavorito(payload) {
  if (payload?.sesionId) {
    await inicializarSesion({ sesionId: payload.sesionId });
  }

  return crearEventoGuardado(payload);
}

async function listarEventosFavoritos(sesionId = null) {
  if (sesionId) {
    return obtenerEventosGuardadosPorSesion(sesionId);
  }

  return obtenerEventosGuardados();
}

async function eliminarEventoFavorito({ id, sesionId = null }) {
  const eventoEliminado = await eliminarEventoGuardado({ id, sesionId });

  if (!eventoEliminado) {
    const error = new Error('No fue posible encontrar el favorito a eliminar.');
    error.statusCode = 404;
    throw error;
  }

  return eventoEliminado;
}

module.exports = {
  guardarEventoFavorito,
  listarEventosFavoritos,
  eliminarEventoFavorito,
};
