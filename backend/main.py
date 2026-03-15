from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import events, gallery, help_requests, settings, auth_router

app = FastAPI(title="Elkay 2K22 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/auth")
app.include_router(events.router, prefix="/events")
app.include_router(gallery.router, prefix="/gallery")
app.include_router(help_requests.router, prefix="/help-requests")
app.include_router(settings.router, prefix="/settings")

@app.get("/")
def home():
    return {"message": "API Running"}
