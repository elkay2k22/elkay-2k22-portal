from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

router = APIRouter()

gallery = []
ACCESS_CODE = "ABCD1234"

@router.get("/")
def get_gallery(page:int=1, limit:int=20):
    return {
        "items": gallery[(page-1)*limit : page*limit],
        "total": len(gallery)
    }

@router.post("/verify")
def verify(data:dict):
    return {"valid": data["code"] == ACCESS_CODE}

@router.post("/")
def upload_media(data:dict):
    item = {
        "id": str(uuid4()),
        **data,
        "uploadedAt": datetime.utcnow()
    }
    gallery.append(item)
    return item

@router.delete("/{id}")
def delete_media(id:str):
    global gallery
    gallery = [g for g in gallery if g["id"] != id]
    return {"success": True}
