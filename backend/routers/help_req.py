from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

router = APIRouter()

requests = []

@router.post("/")
def create_request(data:dict):
    req = {
        "id": str(uuid4()),
        **data,
        "status": "pending",
        "submittedAt": datetime.utcnow()
    }
    requests.append(req)
    return req

@router.get("/")
def get_requests(page:int=1, limit:int=50):
    return requests[(page-1)*limit : page*limit]

@router.patch("/{id}/status")
def update_status(id:str, data:dict):
    for r in requests:
        if r["id"] == id:
            r["status"] = data["status"]
            r["notes"] = data.get("notes")
            r["resolvedAt"] = datetime.utcnow()
            return r
