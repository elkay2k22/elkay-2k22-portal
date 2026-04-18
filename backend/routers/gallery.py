import os
from pathlib import Path
from uuid import uuid4
from datetime import datetime
from urllib.parse import urlparse
from urllib.request import urlopen

from bson import ObjectId
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, Response

from backend.mongo import db, get_settings_doc, serialize_doc

router = APIRouter()

ALLOWED_MEDIA_TYPES = {"image", "video"}
ALLOWED_CATEGORIES = {"school_diaries", "farewell", "gatherings"}

UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "").strip()
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "").strip()
CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "elkay2k22/gallery").strip()

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


def _build_local_upload(request: Request, file: UploadFile, content: bytes) -> tuple[str, str]:
    ext = Path(file.filename or "").suffix
    safe_ext = ext if ext else ".bin"
    filename = f"{uuid4()}{safe_ext}"
    file_path = UPLOADS_DIR / filename
    file_path.write_bytes(content)
    file_url = str(request.base_url).rstrip("/") + f"/uploads/{filename}"
    return file_url, file_url


def _build_cloudinary_upload(file: UploadFile, content: bytes) -> tuple[str, str, str]:
    upload_result = cloudinary.uploader.upload(
        content,
        folder=CLOUDINARY_FOLDER,
        resource_type="auto",
        use_filename=False,
        unique_filename=True,
        overwrite=False,
        filename_override=file.filename,
    )

    url = upload_result.get("secure_url") or upload_result.get("url")
    if not url:
        raise HTTPException(status_code=500, detail="Cloud upload failed")

    media_type = (upload_result.get("resource_type") or "").lower()
    if media_type == "image":
        thumbnail = cloudinary.CloudinaryImage(upload_result["public_id"]).build_url(
            secure=True,
            width=400,
            crop="limit",
            quality="auto",
            fetch_format="auto",
        )
    else:
        thumbnail = url

    return url, thumbnail, upload_result["public_id"]


def _delete_cloudinary_asset(public_id: str) -> None:
    for resource_type in ("image", "video", "raw"):
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        if result.get("result") in {"ok", "not found"}:
            return


def _build_download_name(title: str, ext: str) -> str:
    normalized_ext = ext if ext else ".bin"
    safe_title = "".join(ch for ch in title if ch.isalnum() or ch in ("-", "_", " ")).strip() or "media"
    return f"{safe_title}{normalized_ext}"


def _clean_optional(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned if cleaned else None

@router.get("/")
def get_gallery(page: int = 1, limit: int = 20, category: str | None = None):
    if category and category not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=422, detail="Invalid gallery category")

    skip = (page - 1) * limit

    query = {}
    # Backward compatibility for old rows with no category.
    if category == "school_diaries":
        query = {"$or": [{"category": "school_diaries"}, {"category": {"$exists": False}}]}
    elif category:
        query = {"category": category}

    cursor = db.gallery.find(query).sort("uploadedAt", -1).skip(skip).limit(limit)
    return {
        "items": [serialize_doc(item) for item in cursor],
        "total": db.gallery.count_documents(query),
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
    category: str = Form("school_diaries"),
    isImportantGathering: bool = Form(False),
    gatheringDate: str | None = Form(None),
    description: str | None = Form(None),
    accessCodeRequired: bool = Form(True),
):
    if type not in ALLOWED_MEDIA_TYPES:
        raise HTTPException(status_code=422, detail="Invalid media type")

    if category not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=422, detail="Invalid gallery category")

    cleaned_date = _clean_optional(gatheringDate)
    cleaned_description = _clean_optional(description)

    if category != "gatherings":
        isImportantGathering = False
        cleaned_date = None
        cleaned_description = None
    elif isImportantGathering and (not cleaned_date or not cleaned_description):
        raise HTTPException(
            status_code=422,
            detail="Important gathering requires date and description",
        )

    content = await file.read()

    cloudinary_public_id = None
    if CLOUDINARY_ENABLED:
        file_url, thumbnail_url, cloudinary_public_id = _build_cloudinary_upload(file, content)
    else:
        file_url, thumbnail_url = _build_local_upload(request, file, content)

    item = {
        "title": title,
        "type": type,
        "category": category,
        "isImportantGathering": isImportantGathering,
        "gatheringDate": cleaned_date,
        "description": cleaned_description,
        "url": file_url,
        "thumbnailUrl": thumbnail_url,
        "accessCodeRequired": accessCodeRequired,
        "uploadedAt": datetime.utcnow(),
    }
    if cloudinary_public_id:
        item["cloudinaryPublicId"] = cloudinary_public_id

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

    cloudinary_public_id = existing.get("cloudinaryPublicId")
    if cloudinary_public_id and CLOUDINARY_ENABLED:
        _delete_cloudinary_asset(cloudinary_public_id)

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
    title = str(media.get("title", "media")).strip() or "media"

    if "/uploads/" not in media_url:
        parsed = urlparse(media_url)
        ext = Path(parsed.path).suffix
        download_name = _build_download_name(title, ext)

        try:
            with urlopen(media_url, timeout=20) as remote:
                content = remote.read()
        except Exception:
            raise HTTPException(status_code=404, detail="File not found")

        return Response(
            content=content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
        )

    filename = media_url.split("/uploads/")[-1].split("?")[0]
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    ext = file_path.suffix
    download_name = _build_download_name(title, ext)

    return FileResponse(
        path=str(file_path),
        filename=download_name,
        media_type="application/octet-stream",
    )
