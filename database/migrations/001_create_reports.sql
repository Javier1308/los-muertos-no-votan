CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dni_denunciante VARCHAR(8)  NOT NULL,
    dni_denunciado  VARCHAR(8)  NOT NULL,
    mesa_votacion   VARCHAR(50) NOT NULL,
    parentesco      VARCHAR(20) NOT NULL CHECK (parentesco IN ('familiar', 'amigo', 'conocido')),
    razon           VARCHAR(20) NOT NULL CHECK (razon IN ('discapacidad', 'fallecido')),
    ip_address      INET,
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT dni_denunciante_format CHECK (dni_denunciante ~ '^\d{8}$'),
    CONSTRAINT dni_denunciado_format  CHECK (dni_denunciado  ~ '^\d{8}$'),
    CONSTRAINT dni_diferente          CHECK (dni_denunciante <> dni_denunciado)
);

CREATE INDEX idx_reports_dni_denunciado ON reports(dni_denunciado);
CREATE INDEX idx_reports_created_at    ON reports(created_at DESC);
CREATE INDEX idx_reports_mesa          ON reports(mesa_votacion);

CREATE VIEW report_stats AS
SELECT
    COUNT(*)                      AS total_reportes,
    COUNT(DISTINCT mesa_votacion) AS mesas_afectadas,
    razon,
    DATE_TRUNC('day', created_at) AS fecha
FROM reports
GROUP BY razon, DATE_TRUNC('day', created_at);
