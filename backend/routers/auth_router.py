from fastapi import APIRouter, HTTPException

router = APIRouter()

ADMIN_USER = "admin"
ADMIN_PASS = "admin123"

@router.post("/login")
def login(data: dict):
    if data["username"] == ADMIN_USER and data["password"] == ADMIN_PASS:
        return {"access_token": "jwt-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
