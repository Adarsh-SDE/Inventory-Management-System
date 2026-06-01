from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import DashboardService
from app.utils.responses import success_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    summary = DashboardService(db).get_summary()
    return success_response("Dashboard summary retrieved", DashboardSummary(**summary).model_dump())
