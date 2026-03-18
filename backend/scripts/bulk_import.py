import argparse
import re
import shutil
import uuid
from datetime import datetime
from pathlib import Path
import sys

import json
import json5

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.mongo import db

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
MEDIA_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS


def extract_array_from_mock(mock_file: Path, export_name: str):
    content = mock_file.read_text(encoding="utf-8")
    pattern = rf"export\\s+const\\s+{re.escape(export_name)}[^=]*=\\s*(\\[.*?\\])\\s*;"
    match = re.search(pattern, content, flags=re.DOTALL)
    if not match:
        raise ValueError(f"Could not find export array '{export_name}' in {mock_file}")
    array_literal = match.group(1)
    return json5.loads(array_literal)


def load_events(events_file: Path | None, mock_file: Path | None):
    if events_file:
        raw = json.loads(events_file.read_text(encoding="utf-8"))
        if not isinstance(raw, list):
            raise ValueError("Events file must contain a JSON array")
        return raw
    if mock_file:
        return extract_array_from_mock(mock_file, "MOCK_EVENTS")
    return []


def load_gallery_from_mock(mock_file: Path | None):
    if not mock_file:
        return []
    return extract_array_from_mock(mock_file, "MOCK_GALLERY")


def event_doc(event: dict):
    return {
        "title": event.get("title", "Untitled Event"),
        "date": event.get("date", datetime.utcnow().date().isoformat()),
        "location": event.get("location", ""),
        "description": event.get("description", ""),
        "amountSpent": float(event.get("amountSpent", 0)),
        "images": event.get("images", []),
        "tags": event.get("tags", []),
        "createdAt": datetime.fromisoformat(event["createdAt"].replace("Z", "+00:00")) if event.get("createdAt") else datetime.utcnow(),
        "updatedAt": datetime.fromisoformat(event["updatedAt"].replace("Z", "+00:00")) if event.get("updatedAt") else None,
    }


def gallery_doc_from_url(item: dict):
    uploaded_at = item.get("uploadedAt")
    parsed_uploaded_at = (
        datetime.fromisoformat(uploaded_at.replace("Z", "+00:00"))
        if uploaded_at
        else datetime.utcnow()
    )
    return {
        "title": item.get("title", "Untitled Media"),
        "type": item.get("type", "image"),
        "url": item.get("url", ""),
        "thumbnailUrl": item.get("thumbnailUrl", item.get("url", "")),
        "accessCodeRequired": bool(item.get("accessCodeRequired", True)),
        "uploadedAt": parsed_uploaded_at,
    }


def gallery_doc_from_file(file_path: Path, uploads_dir: Path, base_url: str, access_code_required: bool):
    ext = file_path.suffix.lower()
    media_type = "video" if ext in VIDEO_EXTENSIONS else "image"
    target_name = f"{uuid.uuid4()}{ext}"
    target_path = uploads_dir / target_name
    shutil.copy2(file_path, target_path)
    file_url = f"{base_url.rstrip('/')}/uploads/{target_name}"
    return {
        "title": file_path.stem,
        "type": media_type,
        "url": file_url,
        "thumbnailUrl": file_url,
        "accessCodeRequired": access_code_required,
        "uploadedAt": datetime.utcnow(),
    }


def main():
    parser = argparse.ArgumentParser(description="Bulk import events and gallery data into MongoDB")
    parser.add_argument("--events-file", type=str, help="Path to events JSON array file")
    parser.add_argument("--photos-dir", type=str, help="Path to local photos/videos directory")
    parser.add_argument("--mock-file", type=str, default="frontend/src/mocks/mockData.ts", help="Path to mockData.ts")
    parser.add_argument("--import-mock-events", action="store_true", help="Import MOCK_EVENTS from mockData.ts")
    parser.add_argument("--import-mock-gallery", action="store_true", help="Import MOCK_GALLERY URLs from mockData.ts")
    parser.add_argument("--base-url", type=str, default="http://localhost:8000", help="Backend base URL used for generated uploads URLs")
    parser.add_argument("--access-code-required", action="store_true", help="Mark imported local files as access-code protected")
    parser.add_argument("--clear-events", action="store_true", help="Delete existing events before importing")
    parser.add_argument("--clear-gallery", action="store_true", help="Delete existing gallery items before importing")
    args = parser.parse_args()

    root_dir = Path(__file__).resolve().parents[2]
    mock_file = (root_dir / args.mock_file) if args.mock_file else None
    events_file = Path(args.events_file).resolve() if args.events_file else None
    photos_dir = Path(args.photos_dir).resolve() if args.photos_dir else None
    uploads_dir = root_dir / "backend" / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    events_to_insert = []
    if events_file:
        events_to_insert.extend(load_events(events_file, None))
    if args.import_mock_events:
        if not mock_file or not mock_file.exists():
            raise FileNotFoundError(f"mock file not found: {mock_file}")
        events_to_insert.extend(load_events(None, mock_file))

    gallery_to_insert = []
    if args.import_mock_gallery:
        if not mock_file or not mock_file.exists():
            raise FileNotFoundError(f"mock file not found: {mock_file}")
        gallery_to_insert.extend(load_gallery_from_mock(mock_file))

    if photos_dir:
        if not photos_dir.exists() or not photos_dir.is_dir():
            raise FileNotFoundError(f"photos directory not found: {photos_dir}")
        media_files = [
            p
            for p in photos_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in MEDIA_EXTENSIONS
        ]
        media_files.sort()
        for media_file in media_files:
            gallery_to_insert.append(
                gallery_doc_from_file(
                    media_file,
                    uploads_dir,
                    args.base_url,
                    args.access_code_required,
                )
            )

    if args.clear_events:
        db.events.delete_many({})
    if args.clear_gallery:
        db.gallery.delete_many({})

    inserted_events = 0
    inserted_gallery = 0

    if events_to_insert:
        event_docs = [event_doc(item) for item in events_to_insert]
        result = db.events.insert_many(event_docs)
        inserted_events = len(result.inserted_ids)

    if gallery_to_insert:
        gallery_docs = []
        for item in gallery_to_insert:
            if "uploadedAt" in item and isinstance(item["uploadedAt"], str):
                gallery_docs.append(gallery_doc_from_url(item))
            elif "url" in item and "type" in item and "uploadedAt" in item:
                gallery_docs.append(item)
            else:
                gallery_docs.append(gallery_doc_from_url(item))

        result = db.gallery.insert_many(gallery_docs)
        inserted_gallery = len(result.inserted_ids)

    print(f"Imported events: {inserted_events}")
    print(f"Imported gallery items: {inserted_gallery}")


if __name__ == "__main__":
    main()
