from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text_from_pdf
import logging



logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="GapIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    logger.info("Health check called")
    return {"status": "ok", "service": "GapIQ API"}

@app.post("/parse/resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    file_bytes = await file.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

    try:
        text = extract_text_from_pdf(file_bytes)
        return {"status": "ok", "text": text, "char_count": len(text)}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


from pydantic import BaseModel

class JDInput(BaseModel):
    jd_text: str

@app.post("/parse/jd")
def parse_jd(payload: JDInput):
    if not payload.jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    cleaned = payload.jd_text.strip()
    logger.info(f"JD received. Characters: {len(cleaned)}")
    return {"status": "ok", "text": cleaned, "char_count": len(cleaned)}
