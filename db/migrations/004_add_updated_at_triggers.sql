CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_eventos_guardados_actualizado_en ON eventos_guardados;
CREATE TRIGGER trg_eventos_guardados_actualizado_en
BEFORE UPDATE ON eventos_guardados
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();

DROP TRIGGER IF EXISTS trg_sesiones_voz_actualizada_en ON sesiones_voz;
CREATE TRIGGER trg_sesiones_voz_actualizada_en
BEFORE UPDATE ON sesiones_voz
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_modificacion();
