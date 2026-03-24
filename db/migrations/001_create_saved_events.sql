CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS eventos_guardados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_evento DATE NOT NULL,
    fuente TEXT NOT NULL DEFAULT 'history.muffinlabs',
    url_fuente TEXT,
    nota_usuario TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_guardados_fecha_evento
    ON eventos_guardados (fecha_evento DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_eventos_guardados_titulo_fecha
    ON eventos_guardados (titulo, fecha_evento);
