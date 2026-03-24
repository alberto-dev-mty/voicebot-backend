const pool = require('../config/db');

async function obtenerEventosGuardados() {
  const query = `
    SELECT
      id,
      titulo,
      descripcion,
      fecha_evento,
      fuente,
      url_fuente,
      nota_usuario,
      creado_en,
      actualizado_en
    FROM eventos_guardados
    ORDER BY creado_en DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
}

async function obtenerEventosGuardadosPorSesion(sesionId) {
  const query = `
    SELECT
      id,
      sesion_id,
      titulo,
      descripcion,
      fecha_evento,
      fuente,
      url_fuente,
      nota_usuario,
      creado_en,
      actualizado_en
    FROM eventos_guardados
    WHERE sesion_id = $1
    ORDER BY creado_en DESC
  `;

  const { rows } = await pool.query(query, [sesionId]);
  return rows;
}

async function crearEventoGuardado({
  sesionId = null,
  titulo,
  descripcion,
  fechaEvento,
  fuente = 'history.muffinlabs',
  urlFuente = null,
  notaUsuario = null,
}) {
  const query = `
    INSERT INTO eventos_guardados (
      sesion_id,
      titulo,
      descripcion,
      fecha_evento,
      fuente,
      url_fuente,
      nota_usuario
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      sesion_id,
      titulo,
      descripcion,
      fecha_evento,
      fuente,
      url_fuente,
      nota_usuario,
      creado_en,
      actualizado_en
  `;

  const values = [
    sesionId,
    titulo,
    descripcion,
    fechaEvento,
    fuente,
    urlFuente,
    notaUsuario,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function eliminarEventoGuardado({ id, sesionId = null }) {
  const values = sesionId ? [id, sesionId] : [id];
  const query = sesionId
    ? `
      DELETE FROM eventos_guardados
      WHERE id = $1 AND sesion_id = $2
      RETURNING
        id,
        sesion_id,
        titulo,
        descripcion,
        fecha_evento,
        fuente,
        url_fuente,
        nota_usuario,
        creado_en,
        actualizado_en
    `
    : `
      DELETE FROM eventos_guardados
      WHERE id = $1
      RETURNING
        id,
        sesion_id,
        titulo,
        descripcion,
        fecha_evento,
        fuente,
        url_fuente,
        nota_usuario,
        creado_en,
        actualizado_en
    `;

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

module.exports = {
  obtenerEventosGuardados,
  obtenerEventosGuardadosPorSesion,
  crearEventoGuardado,
  eliminarEventoGuardado,
};
