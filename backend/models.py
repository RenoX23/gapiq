from pydantic import BaseModel
from typing import List, Optional

class ParsedResume(BaseModel):
    skills: List[str]
    experience: List[str]
    keywords: List[str]
    seniority_signals: List[str]

class ParsedJD(BaseModel):
    required_skills: List[str]
    nice_to_have: List[str]
    keywords: List[str]
    seniority: str

class ExtractionResult(BaseModel):
    resume: ParsedResume
    jd: ParsedJD
