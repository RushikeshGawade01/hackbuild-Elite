# backend/main.py (FastAPI)
import os, requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend during dev
    allow_methods=["*"],
    allow_headers=["*"],
)

PLACID_API_KEY = os.getenv("PLACID_API_KEY")
PLACID_TEMPLATE_ID = os.getenv("PLACID_TEMPLATE_ID")

class CreativeRequest(BaseModel):
    data: dict

@app.post("/generate-ad")
def generate_ad(req: CreativeRequest):
    url = f"https://api.placid.app/api/rest/templates/{PLACID_TEMPLATE_ID}/render"
    headers = {"Authorization": f"Bearer {PLACID_API_KEY}"}
    response = requests.post(url, headers=headers, json={"data": req.data})

    return response.json()
