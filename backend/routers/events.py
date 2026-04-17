import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from bson import ObjectId
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from pymongo import ReturnDocument

from backend.mongo import db, serialize_doc

router = APIRouter()
UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "").strip()
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "").strip()
CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "elkay2k22/gallery").strip()
CLOUDINARY_EVENTS_FOLDER = f"{CLOUDINARY_FOLDER.rstrip('/')}/events"

CLOUDINARY_ENABLED = bool(
    CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
)

if CLOUDINARY_ENABLED:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )

@router.get("/")
def get_events(page: int = 1, limit: int = 10):
    skip = (page - 1) * limit
    # Stable sort order avoids duplicates across pages when timestamps are equal.
    cursor = db.events.find().sort([("createdAt", -1), ("_id", -1)]).skip(skip).limit(limit)
    return [serialize_doc(item) for item in cursor]


@router.get("/count")
def get_events_count():
    return {"total": db.events.count_documents({})}

@router.get("/{id}")
def get_event(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="Event not found")
    event = db.events.find_one({"_id": ObjectId(id)})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return serialize_doc(event)


@router.post("/upload-images")
async def upload_event_images(request: Request, files: list[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    urls = []
    for file in files:
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            continue

        content = await file.read()
        if CLOUDINARY_ENABLED:
            upload_result = cloudinary.uploader.upload(
                content,
                folder=CLOUDINARY_EVENTS_FOLDER,
                resource_type="image",
                use_filename=False,
                unique_filename=True,
                overwrite=False,
                filename_override=file.filename,
            )
            file_url = upload_result.get("secure_url") or upload_result.get("url")
            if not file_url:
                raise HTTPException(status_code=500, detail="Cloud image upload failed")
        else:
            filename = f"event-{uuid4()}{ext}"
            target_path = UPLOADS_DIR / filename
            target_path.write_bytes(content)
            file_url = f"/uploads/{filename}"

        urls.append(file_url)

    if not urls:
        raise HTTPException(status_code=400, detail="No valid image files uploaded")

    return {"urls": urls}

@router.post("/")
def create_event(data: dict):
    now = datetime.utcnow()
    event = {
        **data,
        "images": data.get("images", []),
        "tags": data.get("tags", []),
        "createdAt": now,
        "updatedAt": None,
    }
    inserted = db.events.insert_one(event)
    created = db.events.find_one({"_id": inserted.inserted_id})
    return serialize_doc(created)

@router.patch("/{id}")
def update_event(id: str, data: dict):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="Event not found")
    updated = db.events.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {**data, "updatedAt": datetime.utcnow()}},
        return_document=ReturnDocument.AFTER,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Event not found")
    return serialize_doc(updated)

@router.delete("/{id}")
def delete_event(id: str):
    if not ObjectId.is_valid(id):
        return {"success": False}
    deleted = db.events.delete_one({"_id": ObjectId(id)})
    return {"success": deleted.deleted_count > 0}
