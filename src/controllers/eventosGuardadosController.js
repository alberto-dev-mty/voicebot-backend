const {
  guardarEventoFavorito,
  listarEventosFavoritos,
  eliminarEventoFavorito,
} = require('../services/eventosGuardadosService');

async function listarEventosGuardados(req, res, next) {
  try {
    const eventos = await listarEventosFavoritos();
    res.json({
      ok: true,
      data: eventos,
    });
  } catch (error) {
    next(error);
  }
}

async function listarEventosGuardadosPorSesion(req, res, next) {
  try {
    const { sesionId } = req.params;
    const eventos = await listarEventosFavoritos(sesionId);
    res.json({
      ok: true,
      data: eventos,
    });
  } catch (error) {
    next(error);
  }
}

async function registrarEventoGuardado(req, res, next) {
  try {
    const {
      sesionId = null,
      titulo,
      descripcion,
      fechaEvento,
      fuente = 'history.muffinlabs',
      urlFuente = null,
      notaUsuario = null,
    } = req.body;

    if (!titulo || !descripcion || !fechaEvento) {
      return res.status(400).json({
        ok: false,
        message:
          'Los campos titulo, descripcion y fechaEvento son obligatorios.',
      });
    }

    const evento = await guardarEventoFavorito({
      sesionId,
      titulo,
      descripcion,
      fechaEvento,
      fuente,
      urlFuente,
      notaUsuario,
    });

    return res.status(201).json({
      ok: true,
      data: evento,
    });
  } catch (error) {
    next(error);
  }
}

async function eliminarEventoGuardadoPorId(req, res, next) {
  try {
    const { id } = req.params;
    const { sesionId = null } = req.query;

    const evento = await eliminarEventoFavorito({ id, sesionId });

    return res.json({
      ok: true,
      data: evento,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarEventosGuardados,
  listarEventosGuardadosPorSesion,
  registrarEventoGuardado,
  eliminarEventoGuardadoPorId,
};
