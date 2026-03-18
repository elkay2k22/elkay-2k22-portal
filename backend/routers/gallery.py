from pathlib import Path
from uuid import uuid4
from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, RedirectResponse

from backend.mongo import db, get_settings_doc, serialize_doc

router = APIRouter()

UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

@router.get("/")
def get_gallery(page:int=1, limit:int=20):
    skip = (page - 1) * limit
    cursor = db.gallery.find().sort("uploadedAt", -1).skip(skip).limit(limit)
    return {
        "items": [serialize_doc(item) for item in cursor],
        "total": db.gallery.count_documents({}),
    }

@router.post("/verify")
def verify(data:dict):
    settings = get_settings_doc()
    access_code = settings.get("downloadAccessCode", "ABCD1234")
    return {"valid": data.get("code", "") == access_code}

@router.post("/")
async def upload_media(
    request: Request,
    file: UploadFile = File(...),
    title: str = Form(...),
    type: str = Form(...),
    accessCodeRequired: bool = Form(True),
):
    ext = Path(file.filename or "").suffix
    safe_ext = ext if ext else ".bin"
    filename = f"{uuid4()}{safe_ext}"
    file_path = UPLOADS_DIR / filename

    content = await file.read()
    file_path.write_bytes(content)

    file_url = str(request.base_url).rstrip("/") + f"/uploads/{filename}"

    item = {
        "title": title,
        "type": type,
        "url": file_url,
        "thumbnailUrl": file_url,
        "accessCodeRequired": accessCodeRequired,
        "uploadedAt": datetime.utcnow(),
    }
    inserted = db.gallery.insert_one(item)
    created = db.gallery.find_one({"_id": inserted.inserted_id})
    return serialize_doc(created)

@router.delete("/{id}")
def delete_media(id:str):
    if not ObjectId.is_valid(id):
        return {"success": False}
    existing = db.gallery.find_one({"_id": ObjectId(id)})
    if not existing:
        return {"success": False}

    media_url = existing.get("url", "")
    if "/uploads/" in media_url:
        filename = media_url.split("/uploads/")[-1]
        file_path = UPLOADS_DIR / filename
        if file_path.exists():
            file_path.unlink()

    deleted = db.gallery.delete_one({"_id": ObjectId(id)})
    return {"success": deleted.deleted_count > 0}


@router.get("/{id}/download")
def download_media(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="Media not found")

    media = db.gallery.find_one({"_id": ObjectId(id)})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    media_url = media.get("url", "")
    if "/uploads/" not in media_url:
        # External media URLs can only be redirected; local uploads are served as attachments.
        return RedirectResponse(media_url)

    filename = media_url.split("/uploads/")[-1].split("?")[0]
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    ext = file_path.suffix
    title = str(media.get("title", "media")).strip() or "media"
    safe_title = "".join(ch for ch in title if ch.isalnum() or ch in ("-", "_", " ")).strip() or "media"
    download_name = f"{safe_title}{ext}"

    return FileResponse(
        path=str(file_path),
        filename=download_name,
        media_type="application/octet-stream",
    )
