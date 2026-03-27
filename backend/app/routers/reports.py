from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.rate_limiter import limiter
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter(tags=["reports"])


@router.post("/reports", response_model=ReportResponse, status_code=201)
@limiter.limit("5/minute")
@limiter.limit("20/hour")
async def create_report(
    request: Request,
    report_data: ReportCreate,
    db: AsyncSession = Depends(get_db),
):
    ip = request.client.host if request.client else None

    new_report = Report(
        dni_denunciante=report_data.dni_denunciante,
        dni_denunciado=report_data.dni_denunciado,
        mesa_votacion=report_data.mesa_votacion,
        parentesco=report_data.parentesco.value,
        razon=report_data.razon.value,
        ip_address=ip,
    )

    db.add(new_report)
    await db.flush()
    await db.refresh(new_report)

    return ReportResponse(
        id=new_report.id,
        message="Denuncia registrada exitosamente. Gracias por contribuir a la integridad electoral.",
        created_at=new_report.created_at,
    )


@router.get("/stats")
@limiter.limit("30/minute")
async def get_stats(request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(Report))
    total = result.scalar_one()
    return {"total_reportes": total}
