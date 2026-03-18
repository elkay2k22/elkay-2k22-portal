import os
import base64
import hashlib
import hmac
from datetime import datetime
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "backend" / ".env")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "elkay2k22")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

PBKDF2_ITERATIONS = 210000
PBKDF2_ALGORITHM = "sha256"
PBKDF2_SALT_BYTES = 16


def hash_password(raw_password: str) -> str:
    salt = os.urandom(PBKDF2_SALT_BYTES)
    digest = hashlib.pbkdf2_hmac(
        PBKDF2_ALGORITHM,
        raw_password.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )
    payload = {
        "alg": PBKDF2_ALGORITHM,
        "iter": PBKDF2_ITERATIONS,
        "salt": base64.b64encode(salt).decode("ascii"),
        "hash": base64.b64encode(digest).decode("ascii"),
    }
    return "pbkdf2$" + "$".join(
        [payload["alg"], str(payload["iter"]), payload["salt"], payload["hash"]]
    )


def verify_password(raw_password: str, hashed_password: str) -> bool:
    if not hashed_password.startswith("pbkdf2$"):
        return False

    try:
        _, alg, iterations, salt_b64, hash_b64 = hashed_password.split("$", 4)
        salt = base64.b64decode(salt_b64)
        expected_hash = base64.b64decode(hash_b64)
        derived_hash = hashlib.pbkdf2_hmac(
            alg,
            raw_password.encode("utf-8"),
            salt,
            int(iterations),
        )
        return hmac.compare_digest(derived_hash, expected_hash)
    except (ValueError, TypeError):
        return False


def serialize_doc(doc: Optional[dict]) -> Optional[dict]:
    if not doc:
        return None
    out = {**doc}
    out["id"] = str(out.pop("_id"))
    return out


def get_settings_doc() -> dict:
    settings = db.settings.find_one({"_id": "default"})
    if settings:
        return settings

    defaults = {
        "_id": "default",
        "fundSummary": {
            "totalCollected": 0,
            "totalUtilized": 0,
            "availableBalance": 0,
        },
        "contactInfo": {},
        "aboutContent": {},
        "downloadAccessCode": "ABCD1234",
        "updatedAt": datetime.utcnow(),
    }
    db.settings.insert_one(defaults)
    return defaults


def get_admin_by_username(username: str) -> Optional[dict]:
    return db.admin_users.find_one({"username": username})


def ensure_default_admin() -> None:
    existing_count = db.admin_users.count_documents({})
    if existing_count > 0:
        return

    db.admin_users.insert_one(
        {
            "username": ADMIN_USERNAME,
            "passwordHash": hash_password(ADMIN_PASSWORD),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }
    )


def upsert_admin_password(username: str, raw_password: str) -> None:
    db.admin_users.update_one(
        {"username": username},
        {
            "$set": {
                "passwordHash": hash_password(raw_password),
                "updatedAt": datetime.utcnow(),
            },
            "$setOnInsert": {
                "createdAt": datetime.utcnow(),
            },
        },
        upsert=True,
    )
