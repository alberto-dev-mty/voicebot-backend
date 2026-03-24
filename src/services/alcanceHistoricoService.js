const PALABRAS_CLAVE_HISTORIA = [
  'historia',
  'historico',
  'evento',
  'eventos',
  'fecha',
  'paso',
  'ocurrio',
  'personaje',
  'ciencia',
  'favorito',
  'favoritos',
  'guardar',
  'guardalo',
  'guardame',
  'muestrame',
  'archivo',
  'dia como hoy',
];

const FRASES_HISTORICAS = [
  'que paso',
  'que ocurrio',
  'un dia como hoy',
  'hoy en la historia',
  'hecho historico',
  'evento historico',
  'personaje historico',
  'mis favoritos',
  'muestrame mis favoritos',
  'cuales son mis favoritos',
  'ver mis favoritos',
];

const PALABRAS_CLAVE_FUERA_DE_AMBITO = [
  'clima',
  'temperatura',
  'lluvia',
  'pronostico',
  'receta',
  'comida',
  'cocinar',
  'pelicula',
  'series',
  'deporte',
  'futbol',
  'medicina',
  'salud',
  'programacion',
  'codigo',
  'matematica',
];

const RESPUESTA_FUERA_DE_AMBITO =
  'Puedo responder solo con datos historicos obtenidos de history.muffinlabs.com y con tus favoritos guardados. Prueba con una pregunta como "que paso un dia como hoy" o "dame un evento historico de ciencia".';

const RESPUESTA_ELIMINAR_FAVORITO =
  'Eliminar favoritos es una accion exclusiva del usuario. Si quieres borrar uno, hazlo manualmente desde el panel de favoritos.';

const RESPUESTA_SALUDO =
  'Hola, que hecho historico quieres consultar?';

function normalizarTexto(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function mensajeEsDeHistoria(texto) {
  const normalizado = normalizarTexto(texto);

  const tienePalabraHistorica = PALABRAS_CLAVE_HISTORIA.some((palabra) =>
    normalizado.includes(normalizarTexto(palabra))
  );

  const tieneFraseHistorica = FRASES_HISTORICAS.some((frase) =>
    normalizado.includes(normalizarTexto(frase))
  );

  const incluyeAnio = /\b\d{3,4}\b/.test(normalizado);

  return tienePalabraHistorica || tieneFraseHistorica || incluyeAnio;
}

function mensajeEsFueraDeAmbito(texto) {
  const normalizado = normalizarTexto(texto);
  const tieneHistoria = mensajeEsDeHistoria(normalizado);
  const tieneFueraDeAmbito = PALABRAS_CLAVE_FUERA_DE_AMBITO.some((palabra) =>
    normalizado.includes(normalizarTexto(palabra))
  );

  return tieneFueraDeAmbito || !tieneHistoria;
}

function evaluarAlcanceHistorico(texto) {
  const normalizado = normalizarTexto(texto);
  const esSaludo = [
    'hola',
    'holi',
    'buenas',
    'buen dia',
    'buenos dias',
    'buenas tardes',
    'buenas noches',
    'hey',
  ].some(
    (saludo) => normalizado === saludo || normalizado.startsWith(`${saludo} `)
  );

  if (esSaludo) {
    return {
      permitido: false,
      respuesta: RESPUESTA_SALUDO,
    };
  }

  const solicitaEliminarFavorito =
    (normalizado.includes('elimina') ||
      normalizado.includes('eliminar') ||
      normalizado.includes('borra') ||
      normalizado.includes('borrar') ||
      normalizado.includes('quita') ||
      normalizado.includes('remueve')) &&
    normalizado.includes('favorit');

  if (solicitaEliminarFavorito) {
    return {
      permitido: false,
      respuesta: RESPUESTA_ELIMINAR_FAVORITO,
    };
  }

  const fueraDeAmbito = mensajeEsFueraDeAmbito(texto);

  return {
    permitido: !fueraDeAmbito,
    respuesta: fueraDeAmbito ? RESPUESTA_FUERA_DE_AMBITO : null,
  };
}

module.exports = {
  evaluarAlcanceHistorico,
  RESPUESTA_FUERA_DE_AMBITO,
  RESPUESTA_ELIMINAR_FAVORITO,
  RESPUESTA_SALUDO,
};
