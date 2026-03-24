function obtenerRutaFecha(fecha) {
  if (!fecha) {
    return 'date';
  }

  const match = fecha.match(/^(\d{2})-(\d{2})$/);

  if (!match) {
    throw new Error('La fecha debe tener el formato MM-DD.');
  }

  const [, mes, dia] = match;
  return `date/${Number(mes)}/${Number(dia)}`;
}

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function obtenerMesDia(fechaConsultada) {
  const hoy = new Date();
  const fallback = {
    mes: String(hoy.getMonth() + 1).padStart(2, '0'),
    dia: String(hoy.getDate()).padStart(2, '0'),
  };

  if (!fechaConsultada) {
    return fallback;
  }

  const match = fechaConsultada.match(/^(\d{1,2})\/(\d{1,2})$/);

  if (!match) {
    return fallback;
  }

  return {
    mes: match[1].padStart(2, '0'),
    dia: match[2].padStart(2, '0'),
  };
}

function construirTitulo(evento) {
  if (evento.links && evento.links.length > 0 && evento.links[0].title) {
    return evento.links[0].title;
  }

  return evento.text.slice(0, 80);
}

function mapearEvento(evento, fechaConsultada) {
  const { mes, dia } = obtenerMesDia(fechaConsultada);

  return {
    anio: evento.year,
    fechaEvento: `${evento.year}-${mes}-${dia}`,
    titulo: construirTitulo(evento),
    descripcion: evento.text,
    fuente: 'history.muffinlabs',
    urlFuente:
      evento.links && evento.links.length > 0 ? evento.links[0].link : null,
    enlaces: (evento.links || []).map((link) => ({
      titulo: link.title,
      url: link.link,
    })),
  };
}

async function consultarEventosHistoricos({
  fecha = null,
  termino = null,
  limite = 3,
}) {
  const rutaFecha = obtenerRutaFecha(fecha);
  const response = await fetch(`https://history.muffinlabs.com/${rutaFecha}`);

  if (!response.ok) {
    throw new Error('No fue posible consultar la API historica.');
  }

  const data = await response.json();
  const eventos = data?.data?.Events || [];
  const fechaConsultada = data?.date || fecha || null;
  const terminoNormalizado = termino ? normalizarTexto(termino) : null;

  const eventosFiltrados = terminoNormalizado
    ? eventos.filter((evento) =>
        normalizarTexto(`${evento.year} ${evento.text}`).includes(
          terminoNormalizado
        )
      )
    : eventos;

  const eventosSeleccionados = eventosFiltrados
    .slice(0, limite)
    .map((evento) => mapearEvento(evento, fechaConsultada));

  return {
    fechaConsultada: fechaConsultada || 'hoy',
    totalEncontrados: eventosFiltrados.length,
    eventos: eventosSeleccionados,
  };
}

module.exports = {
  consultarEventosHistoricos,
};
