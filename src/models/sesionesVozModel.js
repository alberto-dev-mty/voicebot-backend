const pool = require('../config/db');

function mapearRolParaBd(rol) {
  if (rol === 'user') {
    return 'usuario';
  }

  if (rol === 'assistant') {
    return 'asistente';
  }

  return 'sistema';
}

function mapearRolDesdeBd(rol) {
  if (rol === 'usuario') {
    return 'user';
  }

  if (rol === 'asistente') {
    return 'assistant';
  }

  return 'system';
}

async function asegurarSesionVoz({ sesionId, codigoIdioma = 'es-MX' }) {
  const query = `
    INSERT INTO sesiones_voz (id, codigo_idioma, estado)
    VALUES ($1, $2, 'activa')
    ON CONFLICT (id) DO UPDATE
    SET codigo_idioma = EXCLUDED.codigo_idioma
    RETURNING id, codigo_idioma, estado, creada_en, actualizada_en
  `;

  const { rows } = await pool.query(query, [sesionId, codigoIdioma]);
  return rows[0];
}

async function guardarMensajeSesion({ sesionId, rol, contenido }) {
  const query = `
    INSERT INTO mensajes_voz (sesion_id, rol, contenido)
    VALUES ($1, $2, $3)
    RETURNING id, sesion_id, rol, contenido, creado_en
  `;

  const { rows } = await pool.query(query, [
    sesionId,
    mapearRolParaBd(rol),
    contenido,
  ]);

  return rows[0];
}

async function obtenerMensajesSesion({ sesionId, limite = 12 }) {
  const query = `
    SELECT rol, contenido, creado_en
    FROM (
      SELECT rol, contenido, creado_en
      FROM mensajes_voz
      WHERE sesion_id = $1
      ORDER BY creado_en DESC
      LIMIT $2
    ) mensajes
    ORDER BY creado_en ASC
  `;

  const { rows } = await pool.query(query, [sesionId, limite]);

  return rows.map((row) => ({
    rol: mapearRolDesdeBd(row.rol),
    contenido: row.contenido,
    creadoEn: row.creado_en,
  }));
}

async function obtenerResumenSesion({ sesionId }) {
  const query = `
    SELECT
      s.id,
      s.creada_en,
      COUNT(m.id) AS total_mensajes,
      MAX(CASE WHEN m.rol = 'usuario' THEN m.contenido END) AS ultimo_mensaje_usuario
    FROM sesiones_voz s
    LEFT JOIN mensajes_voz m ON m.sesion_id = s.id
    WHERE s.id = $1
    GROUP BY s.id, s.creada_en
  `;

  const { rows } = await pool.query(query, [sesionId]);

  return rows[0] || null;
}

async function guardarUltimoEventoConsultado({ sesionId, evento }) {
  const query = `
    UPDATE sesiones_voz
    SET ultimo_evento_consultado = $2::jsonb,
        actualizada_en = NOW()
    WHERE id = $1
    RETURNING id, ultimo_evento_consultado
  `;

  const { rows } = await pool.query(query, [sesionId, JSON.stringify(evento)]);
  return rows[0] || null;
}

async function obtenerUltimoEventoConsultado({ sesionId }) {
  const query = `
    SELECT ultimo_evento_consultado
    FROM sesiones_voz
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [sesionId]);
  return rows[0]?.ultimo_evento_consultado || null;
}

module.exports = {
  asegurarSesionVoz,
  guardarMensajeSesion,
  obtenerMensajesSesion,
  obtenerResumenSesion,
  guardarUltimoEventoConsultado,
  obtenerUltimoEventoConsultado,
};
