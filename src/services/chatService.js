const {
  inicializarSesion,
  registrarInteraccion,
  guardarUltimoEventoConsultado,
  obtenerUltimoEventoConsultado,
} = require('./sesionesVozService');
const {
  evaluarAlcanceHistorico,
  RESPUESTA_FUERA_DE_AMBITO,
  RESPUESTA_SALUDO,
  RESPUESTA_ELIMINAR_FAVORITO,
} = require('./alcanceHistoricoService');
const { consultarEventosHistoricos } = require('./historiaService');
const {
  listarEventosFavoritos,
  guardarEventoFavorito,
} = require('./eventosGuardadosService');

const FRASES_BASE_HISTORIA = [
  'que paso un dia como hoy',
  'que paso hoy en la historia',
  'que paso',
  'que ocurrio',
  'dame un evento historico sobre',
  'dame un evento historico de',
  'dame un evento sobre',
  'evento historico sobre',
  'evento historico de',
  'busca un evento historico sobre',
  'busca un evento historico de',
  'hablame de',
  'cuentame de',
  'cuentame sobre',
];

function normalizarTexto(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function esSolicitudFavoritos(texto) {
  const normalizado = normalizarTexto(texto);
  return normalizado.includes('favorit');
}

function esSaludo(texto) {
  const normalizado = normalizarTexto(texto);
  return [
    'hola',
    'holi',
    'buenas',
    'buen dia',
    'buenos dias',
    'buenas tardes',
    'buenas noches',
    'hey',
  ].some((saludo) => normalizado === saludo || normalizado.startsWith(`${saludo} `));
}

function solicitaEliminarFavorito(texto) {
  const normalizado = normalizarTexto(texto);
  return (
    (normalizado.includes('elimina') ||
      normalizado.includes('eliminar') ||
      normalizado.includes('borra') ||
      normalizado.includes('borrar') ||
      normalizado.includes('quita') ||
      normalizado.includes('remueve')) &&
    normalizado.includes('favorit')
  );
}

function solicitaGuardarFavorito(texto) {
  const normalizado = normalizarTexto(texto);
  const quiereGuardar =
    normalizado.includes('guarda') ||
    normalizado.includes('guardame') ||
    normalizado.includes('guardalo') ||
    normalizado.includes('agrega') ||
    normalizado.includes('agregalo') ||
    normalizado.includes('anade') ||
    normalizado.includes('anadelo') ||
    normalizado.includes('ponlo') ||
    normalizado.includes('almacena');
  const quiereFavoritos = normalizado.includes('favorit');
  const referenciaContextual =
    normalizado.includes('este') ||
    normalizado.includes('esta') ||
    normalizado.includes('esto') ||
    normalizado.includes('ese') ||
    normalizado.includes('esa') ||
    normalizado.includes('eso') ||
    normalizado === 'lo';
  const esPeticionBreve = normalizado.split(/\s+/).filter(Boolean).length <= 3;

  return (
    (quiereGuardar && quiereFavoritos) ||
    (quiereGuardar && referenciaContextual) ||
    (quiereGuardar && esPeticionBreve)
  );
}

function extraerFecha(texto) {
  const normalizado = normalizarTexto(texto);

  const matchNumerico = normalizado.match(/\b(\d{1,2})[/-](\d{1,2})\b/);

  if (matchNumerico) {
    const mes = matchNumerico[1].padStart(2, '0');
    const dia = matchNumerico[2].padStart(2, '0');
    return `${mes}-${dia}`;
  }

  const meses = {
    enero: '01',
    febrero: '02',
    marzo: '03',
    abril: '04',
    mayo: '05',
    junio: '06',
    julio: '07',
    agosto: '08',
    septiembre: '09',
    setiembre: '09',
    octubre: '10',
    noviembre: '11',
    diciembre: '12',
  };

  const matchTexto = normalizado.match(
    /\b(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\b/
  );

  if (matchTexto) {
    const dia = matchTexto[1].padStart(2, '0');
    const mes = meses[matchTexto[2]];
    return `${mes}-${dia}`;
  }

  return null;
}

function extraerTermino(texto) {
  const normalizado = normalizarTexto(texto)
    .replace(/[¿?.,!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalizado.includes('ciencia')) {
    return 'ciencia';
  }

  const matchAnio = normalizado.match(/\b\d{3,4}\b/);

  if (matchAnio) {
    return matchAnio[0];
  }

  let termino = normalizado;

  for (const frase of FRASES_BASE_HISTORIA) {
    if (termino.startsWith(frase)) {
      termino = termino.slice(frase.length).trim();
      break;
    }
  }

  termino = termino
    .replace(/\b(un|una|de|del|la|el|los|las|sobre|hoy|historia|historico|historica)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return termino || null;
}

function formatearFechaFavorito(fecha) {
  if (!fecha) {
    return 'sin fecha';
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(fecha));
}

function construirRespuestaFavoritos(favoritos) {
  if (!favoritos.length) {
    return 'Aun no tienes favoritos guardados en esta sesion.';
  }

  const top = favoritos.slice(0, 3);
  const listado = top
    .map((favorito, index) => {
      return `${index + 1}. ${favorito.titulo} (${formatearFechaFavorito(favorito.fecha_evento)})`;
    })
    .join(' ');

  if (favoritos.length > 3) {
    return `Tienes ${favoritos.length} favoritos guardados. Estos son los primeros: ${listado}`;
  }

  return `Estos son tus favoritos guardados: ${listado}`;
}

function construirRespuestaEventos(resultado) {
  if (!resultado.eventos.length) {
    return 'No encontre hechos historicos relacionados en history.muffinlabs.com para esa consulta.';
  }

  const eventos = resultado.eventos.slice(0, 2).map((evento) => {
    return `En ${evento.anio}, ${evento.descripcion}`;
  });

  return eventos.join(' ');
}

async function procesarChat({ mensaje, historial = [], sesionId = null }) {
  await inicializarSesion({ sesionId });

  let respuesta = '';
  let meta = {};

  if (esSaludo(mensaje)) {
    respuesta = RESPUESTA_SALUDO;
  } else if (solicitaEliminarFavorito(mensaje)) {
    respuesta = RESPUESTA_ELIMINAR_FAVORITO;
  } else if (solicitaGuardarFavorito(mensaje)) {
    const ultimoEvento = await obtenerUltimoEventoConsultado({ sesionId });

    if (!ultimoEvento?.titulo || !ultimoEvento?.descripcion || !ultimoEvento?.fechaEvento) {
      respuesta =
        'Primero consulta un hecho historico y despues pide guardarlo en favoritos.';
    } else {
      const favorito = await guardarEventoFavorito({
        sesionId,
        titulo: ultimoEvento.titulo,
        descripcion: ultimoEvento.descripcion,
        fechaEvento: ultimoEvento.fechaEvento,
        fuente: ultimoEvento.fuente || 'history.muffinlabs',
        urlFuente: ultimoEvento.urlFuente ?? null,
        notaUsuario: null,
      });

      respuesta = `Listo, guarde en favoritos ${favorito.titulo}.`;
      meta = {
        favoritoGuardado: favorito,
      };
    }
  } else if (esSolicitudFavoritos(mensaje)) {
    const favoritos = await listarEventosFavoritos(sesionId);
    respuesta = construirRespuestaFavoritos(favoritos);
    meta = {
      favoritos,
    };
  } else {
    const alcance = evaluarAlcanceHistorico(mensaje);

    if (!alcance.permitido) {
      respuesta = alcance.respuesta || RESPUESTA_FUERA_DE_AMBITO;
    } else {
      const fecha = extraerFecha(mensaje);
      const termino = extraerTermino(mensaje);
      const resultado = await consultarEventosHistoricos({
        fecha,
        termino,
        limite: 2,
      });

      respuesta = construirRespuestaEventos(resultado);

      if (resultado.eventos?.length && sesionId) {
        await guardarUltimoEventoConsultado({
          sesionId,
          evento: resultado.eventos[0],
        });
        meta = {
          ultimoEventoConsultado: resultado.eventos[0],
        };
      }
    }
  }

  await registrarInteraccion({
    sesionId,
    mensajeUsuario: mensaje,
    respuestaAsistente: respuesta,
  });

  return {
    respuesta,
    responseId: null,
    sesionId,
    meta,
  };
}

module.exports = {
  procesarChat,
};
