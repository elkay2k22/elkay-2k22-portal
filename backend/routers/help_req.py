from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo import ReturnDocument

from backend.mongo import db, serialize_doc

router = APIRouter()

@router.post("/")
def create_request(data:dict):
    req = {
        **data,
        "status": "pending",
        "submittedAt": datetime.utcnow(),
        "resolvedAt": None,
        "notes": None,
    }
    inserted = db.help_requests.insert_one(req)
    created = db.help_requests.find_one({"_id": inserted.inserted_id})
    return serialize_doc(created)

@router.get("/")
def get_requests(page:int=1, limit:int=50):
    skip = (page - 1) * limit
    cursor = db.help_requests.find().sort("submittedAt", -1).skip(skip).limit(limit)
    return [serialize_doc(item) for item in cursor]

@router.patch("/{id}/status")
def update_status(id:str, data:dict):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="Request not found")

    updated = db.help_requests.find_one_and_update(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "status": data["status"],
                "notes": data.get("notes"),
                "resolvedAt": datetime.utcnow(),
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Request not found")
    return serialize_doc(updated)
