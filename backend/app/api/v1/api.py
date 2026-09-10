from fastapi import APIRouter
from app.api.v1.endpoints import auth, patients, triage, sync, referrals, dispatch, teleconsult, queue, metrics, followups, tasks

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(triage.router, prefix="/triage", tags=["Triage"])
api_router.include_router(sync.router, prefix="/sync", tags=["Offline Sync"])
api_router.include_router(referrals.router, prefix="/referrals", tags=["Referrals"])
api_router.include_router(dispatch.router, prefix="/dispatch", tags=["108 Ambulance Dispatch"])
api_router.include_router(teleconsult.router, prefix="/teleconsult", tags=["Teleconsultation"])
api_router.include_router(queue.router, prefix="/queue", tags=["Hospital Queue"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["DHO Metrics"])
api_router.include_router(followups.router, prefix="/followups", tags=["Follow-ups"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Reminders / Tasks"])

