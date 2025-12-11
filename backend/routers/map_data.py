# LOCONO/GDG-DevSprint/src/backend/routers/map_data.py

@router.get("/api/v1/map/incidents")
async def get_nearby_incidents(lat: float, lon: float, radius_km: int = 5):
    """
    Retrieves all detected incidents within a specified radius (using PostGIS/geospatial query).
    """
    # Use database query (e.g., PostGIS ST_DWithin) to find points within radius
    # Returns a list of incidents, e.g., [{"type": "pothole", "lat": X, "lon": Y}, ...]
    return {"incidents": []}