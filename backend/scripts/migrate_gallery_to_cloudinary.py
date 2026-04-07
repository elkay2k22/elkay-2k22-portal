import os
from pathlib import Path

import cloudinary
import cloudinary.uploader

from backend.mongo import db


UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "").strip()
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "").strip()
CLOUDINARY_FOLDER = os.getenv("CLOUDINARY_FOLDER", "elkay2k22/gallery").strip()


def _require_cloudinary_config() -> None:
    if not (CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET):
        raise RuntimeError(
            "Cloudinary env is missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
        )

    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )


def _build_thumbnail(public_id: str, resource_type: str, fallback_url: str) -> str:
    if resource_type != "image":
        return fallback_url

    return cloudinary.CloudinaryImage(public_id).build_url(
        secure=True,
        width=400,
        crop="limit",
        quality="auto",
        fetch_format="auto",
    )


def migrate() -> None:
    _require_cloudinary_config()

    query = {
        "url": {"$regex": "/uploads/"},
        "$or": [
            {"cloudinaryPublicId": {"$exists": False}},
            {"cloudinaryPublicId": None},
            {"cloudinaryPublicId": ""},
        ],
    }

    cursor = db.gallery.find(query)

    total = 0
    migrated = 0
    missing = 0
    failed = 0

    for doc in cursor:
        total += 1
        media_url = str(doc.get("url", ""))
        filename = media_url.split("/uploads/")[-1].split("?")[0].strip()
        if not filename:
            failed += 1
            print(f"[FAILED] {doc.get('_id')} has invalid local URL: {media_url}")
            continue

        local_path = UPLOADS_DIR / filename
        if not local_path.exists():
            missing += 1
            print(f"[MISSING] {doc.get('_id')} missing file: {local_path}")
            continue

        try:
            upload_result = cloudinary.uploader.upload(
                str(local_path),
                folder=CLOUDINARY_FOLDER,
                resource_type="auto",
                use_filename=False,
                unique_filename=True,
                overwrite=False,
            )
            public_id = upload_result["public_id"]
            cloud_url = upload_result.get("secure_url") or upload_result.get("url")
            if not cloud_url:
                raise RuntimeError("Cloudinary did not return a URL")

            resource_type = (upload_result.get("resource_type") or "").lower()
            thumb_url = _build_thumbnail(public_id, resource_type, cloud_url)

            db.gallery.update_one(
                {"_id": doc["_id"]},
                {
                    "$set": {
                        "url": cloud_url,
                        "thumbnailUrl": thumb_url,
                        "cloudinaryPublicId": public_id,
                    }
                },
            )
            migrated += 1
            print(f"[OK] {doc.get('_id')} -> {public_id}")
        except Exception as ex:
            failed += 1
            print(f"[FAILED] {doc.get('_id')} upload error: {ex}")

    print("--- Migration Summary ---")
    print(f"Scanned: {total}")
    print(f"Migrated: {migrated}")
    print(f"Missing local file: {missing}")
    print(f"Failed: {failed}")


if __name__ == "__main__":
    migrate()
