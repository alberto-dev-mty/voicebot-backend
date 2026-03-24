CREATE TABLE IF NOT EXISTS sesiones_voz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etiqueta_sesion TEXT,
    codigo_idioma VARCHAR(10) NOT NULL DEFAULT 'es-MX',
    estado VARCHAR(20) NOT NULL DEFAULT 'activa',
    ultimo_evento_consultado JSONB,
    iniciada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finalizada_en TIMESTAMPTZ,
    creada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizada_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_sesiones_voz_estado
        CHECK (estado IN ('activa', 'completada', 'cancelada'))
);

CREATE INDEX IF NOT EXISTS idx_sesiones_voz_estado
    ON sesiones_voz (estado);

CREATE INDEX IF NOT EXISTS idx_sesiones_voz_iniciada_en
    ON sesiones_voz (iniciada_en DESC);
