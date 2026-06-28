import os
from dotenv import load_dotenv

# Load environment variables on startup
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis

app = FastAPI(
    title="Agentic Decision Intelligence Platform API",
    description="Backend API exposing upload and analysis routes parsed by autonomic agent nodes.",
    version="1.0.0"
)

# Configure CORS so our React frontend on port 5173 can query the endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include analysis routes
app.include_router(analysis.router, tags=["Analysis"])

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "app": "Agentic Decision Intelligence Platform Backend Node",
        "version": "1.0.0"
    }
