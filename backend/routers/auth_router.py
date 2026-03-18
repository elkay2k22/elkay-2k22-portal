from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import uuid4

from backend.mongo import ensure_default_admin, get_admin_by_username, verify_password

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    ensure_default_admin()
    admin = get_admin_by_username(data.username)

    if admin and verify_password(data.password, admin.get("passwordHash", "")):
        return {"access_token": f"admin-{uuid4()}"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
