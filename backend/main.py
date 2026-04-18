from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routers import auth_router, events, gallery, help_req, settings

app = FastAPI(title="Elkay 2K22 API")

uploads_dir = Path(__file__).resolve().parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/v1/auth")
app.include_router(events.router, prefix="/api/v1/events")
app.include_router(gallery.router, prefix="/api/v1/gallery")
app.include_router(help_req.router, prefix="/api/v1/help-requests")
app.include_router(settings.router, prefix="/api/v1/settings")

@app.get("/")
def home():
    return {"message": "API Running"}

@app.get("/health")
def health():
    return {"message": "ok"}
