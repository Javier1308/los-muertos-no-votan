from sqlalchemy import Column, String, text
from sqlalchemy.dialects.postgresql import INET, TIMESTAMP, UUID
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    dni_denunciante = Column(String(8), nullable=False)
    dni_denunciado = Column(String(8), nullable=False, index=True)
    mesa_votacion = Column(String(50), nullable=False, index=True)
    parentesco = Column(String(20), nullable=False)
    ip_address = Column(INET, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("NOW()"),
        nullable=False,
        index=True,
    )
