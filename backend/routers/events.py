from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

router = APIRouter()

events = []

@router.get("/")
def get_events(page: int = 1, limit: int = 10):
    return events[(page-1)*limit : page*limit]

@router.get("/{id}")
def get_event(id: str):
    for e in events:
        if e["id"] == id:
            return e

@router.post("/")
def create_event(data: dict):
    event = {
        "id": str(uuid4()),
        **data,
        "createdAt": datetime.utcnow()
    }
    events.append(event)
    return event

@router.patch("/{id}")
def update_event(id: str, data: dict):
    for e in events:
        if e["id"] == id:
            e.update(data)
            e["updatedAt"] = datetime.utcnow()
            return e

@router.delete("/{id}")
def delete_event(id: str):
    global events
    events = [e for e in events if e["id"] != id]
    return {"success": True}
