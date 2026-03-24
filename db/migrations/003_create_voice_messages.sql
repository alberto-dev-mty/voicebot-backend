CREATE TABLE IF NOT EXISTS mensajes_voz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id UUID NOT NULL REFERENCES sesiones_voz(id) ON DELETE CASCADE,
    rol VARCHAR(20) NOT NULL,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_mensajes_voz_rol
        CHECK (rol IN ('usuario', 'asistente', 'sistema'))
);

CREATE INDEX IF NOT EXISTS idx_mensajes_voz_sesion_id
    ON mensajes_voz (sesion_id);

CREATE INDEX IF NOT EXISTS idx_mensajes_voz_rol
    ON mensajes_voz (rol);

CREATE INDEX IF NOT EXISTS idx_mensajes_voz_creado_en
    ON mensajes_voz (creado_en DESC);
