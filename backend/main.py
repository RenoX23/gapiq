from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from extractor import extract_resume, extract_jd
from scorer import compute_scores
from enhancer import enhance
from parser import extract_text_from_pdf
from models import AnalysisOutput, ExtractionResult
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="GapIQ API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JDInput(BaseModel):
    jd_text: str

class AnalysisInput(BaseModel):
    resume_text: str
    jd_text: str

@app.get("/health")
def health_check():
    logger.info("Health check called")
    return {"status": "ok", "service": "GapIQ API"}

@app.post("/parse/resume")
@limiter.limit("20/day")
async def parse_resume(request: Request, file: UploadFile = File(...)):
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

@app.post("/parse/jd")
@limiter.limit("20/day")
async def parse_jd(request: Request, payload: JDInput):
    if not payload.jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    cleaned = payload.jd_text.strip()
    return {"status": "ok", "text": cleaned, "char_count": len(cleaned)}

@app.post("/extract", response_model=ExtractionResult)
@limiter.limit("20/day")
async def extract(request: Request, payload: AnalysisInput):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")
    if not payload.jd_text.strip():
        raise HTTPException(status_code=400, detail="JD text is empty.")
    try:
        resume = extract_resume(payload.resume_text)
        jd = extract_jd(payload.jd_text)
        return ExtractionResult(resume=resume, jd=jd)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/score")
@limiter.limit("20/day")
async def score(request: Request, payload: AnalysisInput):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")
    if not payload.jd_text.strip():
        raise HTTPException(status_code=400, detail="JD text is empty.")
    try:
        resume = extract_resume(payload.resume_text)
        jd = extract_jd(payload.jd_text)
        scores = compute_scores(resume, jd)
        return {"status": "ok", "scores": scores}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/analyze", response_model=AnalysisOutput)
@limiter.limit("5/day")
async def analyze(request: Request, payload: AnalysisInput):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")
    if not payload.jd_text.strip():
        raise HTTPException(status_code=400, detail="JD text is empty.")
    try:
        resume = extract_resume(payload.resume_text)
        jd = extract_jd(payload.jd_text)
        scores = compute_scores(resume, jd)
        enhancement = enhance(resume, jd, scores)
        return AnalysisOutput(
            scores=scores,
            gaps=enhancement["gaps"],
            recommendations=enhancement["recommendations"],
            roadmap=enhancement["roadmap"],
            recruiter_lens=enhancement["recruiter_lens"]
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.get("/")
def root():
    return {"service": "GapIQ API", "status": "ok", "docs": "/docs"}
