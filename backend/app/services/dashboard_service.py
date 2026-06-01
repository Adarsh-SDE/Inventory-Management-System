from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    def __init__(self, db: Session):
        self.repository = DashboardRepository(db)

    def get_summary(self) -> dict[str, int]:
        return self.repository.summary(low_stock_threshold=10)
