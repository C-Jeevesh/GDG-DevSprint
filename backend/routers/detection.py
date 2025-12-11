# LOCONO/GDG-DevSprint/src/backend/routers/detection.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal

router = APIRouter()

class IncidentDetectionData(BaseModel):
    # Latitude and Longitude of the detected incident
    latitude: float
    longitude: float
    # The type of incident (pothole, pedestrian_crossing, rash_driving)
    incident_type: Literal["pothole", "pedestrian", "rash_driving"]
    # Optional: Confidence score from the ML model
    confidence: float = 0.95 

@router.post("/api/v1/incidents/report_ml_detection")
async def report_ml_detection(data: IncidentDetectionData):
    """
    Receives and processes real-time incident data from an ML source.
    """
    # 1. Save to PostGIS/Database
    # Save data.latitude, data.longitude, and data.incident_type to the DB.

    # 2. Triage & Alert
    # Send an alert to the Police Dashboard's Real-time Alert Feed (via WebSocket)

    return {"status": "success", "message": "ML incident reported and queued for triage"}