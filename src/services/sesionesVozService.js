const {
  asegurarSesionVoz,
  guardarMensajeSesion,
  obtenerMensajesSesion,
  obtenerResumenSesion,
  guardarUltimoEventoConsultado: guardarUltimoEventoConsultadoModel,
  obtenerUltimoEventoConsultado: obtenerUltimoEventoConsultadoModel,
} = require('../models/sesionesVozModel');

function truncarTexto(texto, limite = 90) {
  if (!texto) {
    return '';
  }

  if (texto.length <= limite) {
    return texto;
  }

  return `${texto.slice(0, limite).trim()}...`;
}

async function inicializarSesion({ sesionId }) {
  if (!sesionId) {
    return null;
  }

  return asegurarSesionVoz({ sesionId });
}

async function registrarInteraccion({ sesionId, mensajeUsuario, respuestaAsistente }) {
  if (!sesionId) {
    return;
  }

  await asegurarSesionVoz({ sesionId });
  await guardarMensajeSesion({
    sesionId,
    rol: 'user',
    contenido: mensajeUsuario,
  });
  await guardarMensajeSesion({
    sesionId,
    rol: 'assistant',
    contenido: respuestaAsistente,
  });
}

async function obtenerHistorialSesion({ sesionId, limite = 12 }) {
  if (!sesionId) {
    return [];
  }

  await asegurarSesionVoz({ sesionId });
  return obtenerMensajesSesion({ sesionId, limite });
}

async function construirResumenSesion({ sesionId }) {
  if (!sesionId) {
    return null;
  }

  const resumen = await obtenerResumenSesion({ sesionId });

  if (!resumen || Number(resumen.total_mensajes) === 0) {
    return null;
  }

  const resumenCorto = truncarTexto(resumen.ultimo_mensaje_usuario);

  return {
    sesionId,
    totalMensajes: Number(resumen.total_mensajes),
    resumen:
      resumenCorto
        ? `Retomamos tu sesión anterior en VoiceBot. Tu última consulta fue: "${resumenCorto}". Puedes continuar desde ahí o pedirme un evento nuevo.`
        : 'Retomamos tu sesión anterior en VoiceBot. Puedes continuar donde lo dejaste o pedirme un evento nuevo.',
  };
}

async function guardarUltimoEventoConsultado({ sesionId, evento }) {
  if (!sesionId || !evento) {
    return null;
  }

  await asegurarSesionVoz({ sesionId });
  return guardarUltimoEventoConsultadoModel({ sesionId, evento });
}

async function obtenerUltimoEventoConsultado({ sesionId }) {
  if (!sesionId) {
    return null;
  }

  await asegurarSesionVoz({ sesionId });
  return obtenerUltimoEventoConsultadoModel({ sesionId });
}

module.exports = {
  inicializarSesion,
  registrarInteraccion,
  obtenerHistorialSesion,
  construirResumenSesion,
  guardarUltimoEventoConsultado,
  obtenerUltimoEventoConsultado,
};
