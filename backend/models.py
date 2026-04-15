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

class SkillGap(BaseModel):
    skill: str
    priority: str
    reason: str

class Recommendation(BaseModel):
    original: str
    improved: str

class RoadmapItem(BaseModel):
    skill: str
    resource_type: str
    steps: List[str]

class RecruiterLens(BaseModel):
    strengths: List[str]
    weaknesses: List[str]

class AnalysisOutput(BaseModel):
    scores: dict
    gaps: List[SkillGap]
    recommendations: List[Recommendation]
    roadmap: List[RoadmapItem]
    recruiter_lens: RecruiterLens
