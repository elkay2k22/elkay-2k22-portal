from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter
from fastapi import File, Request, UploadFile

from backend.mongo import db, get_settings_doc

router = APIRouter()
UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

@router.get("/")
def get_settings():
    settings = get_settings_doc()
    return {
        "fundSummary": settings.get("fundSummary", {}),
        "contactInfo": settings.get("contactInfo", {}),
        "aboutContent": settings.get("aboutContent", {}),
        "downloadAccessCode": settings.get("downloadAccessCode", "ABCD1234"),
    }

@router.patch("/fund")
def update_fund(data:dict):
    total_collected = data["totalCollected"]
    total_utilized = data["totalUtilized"]
    fund_summary = {
        "totalCollected": total_collected,
        "totalUtilized": total_utilized,
        "availableBalance": total_collected - total_utilized,
    }
    db.settings.update_one(
        {"_id": "default"},
        {"$set": {"fundSummary": fund_summary}},
        upsert=True,
    )
    return fund_summary

@router.patch("/contact")
def update_contact(data:dict):
    settings = get_settings_doc()
    contact_info = settings.get("contactInfo", {})
    contact_info.update(data)
    db.settings.update_one(
        {"_id": "default"},
        {"$set": {"contactInfo": contact_info}},
        upsert=True,
    )
    return contact_info

@router.patch("/about")
def update_about(data:dict):
    settings = get_settings_doc()
    about_content = settings.get("aboutContent", {})
    about_content.update(data)
    db.settings.update_one(
        {"_id": "default"},
        {"$set": {"aboutContent": about_content}},
        upsert=True,
    )
    return about_content

@router.patch("/access-code")
def update_code(data:dict):
    db.settings.update_one(
        {"_id": "default"},
        {"$set": {"downloadAccessCode": data["code"]}},
        upsert=True,
    )
    return {"success": True}


@router.post("/upi-qr")
async def upload_upi_qr(request: Request, file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp"}:
        return {"detail": "Unsupported file type"}

    filename = f"upi-qr-{uuid4()}{ext}"
    target_path = UPLOADS_DIR / filename
    target_path.write_bytes(await file.read())

    file_url = str(request.base_url).rstrip("/") + f"/uploads/{filename}"
    settings = get_settings_doc()
    contact_info = settings.get("contactInfo", {})
    contact_info["upiQrUrl"] = file_url
    db.settings.update_one(
        {"_id": "default"},
        {"$set": {"contactInfo": contact_info}},
        upsert=True,
    )
    return {"upiQrUrl": file_url}
