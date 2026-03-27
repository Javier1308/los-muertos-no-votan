import re
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class Parentesco(str, Enum):
    familiar = "familiar"
    amigo = "amigo"
    conocido = "conocido"


class ReportCreate(BaseModel):
    dni_denunciante: str
    dni_denunciado: str
    mesa_votacion: str
    parentesco: Parentesco

    @field_validator("dni_denunciante", "dni_denunciado")
    @classmethod
    def validate_dni(cls, v: str) -> str:
        if not re.match(r"^\d{8}$", v):
            raise ValueError("El DNI debe tener exactamente 8 dígitos numéricos")
        return v

    @field_validator("dni_denunciado")
    @classmethod
    def dni_diferente(cls, v: str, info) -> str:
        if "dni_denunciante" in info.data and v == info.data["dni_denunciante"]:
            raise ValueError("El DNI del denunciado no puede ser igual al del denunciante")
        return v

    @field_validator("mesa_votacion")
    @classmethod
    def validate_mesa(cls, v: str) -> str:
        v = v.strip().upper()
        if len(v) < 3 or len(v) > 50:
            raise ValueError("La mesa de votación debe tener entre 3 y 50 caracteres")
        return v


class ReportResponse(BaseModel):
    id: UUID
    message: str
    created_at: datetime

    model_config = {"from_attributes": True}
