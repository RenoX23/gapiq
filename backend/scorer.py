import logging
from models import ParsedResume, ParsedJD
from sentence_transformers import SentenceTransformer, util

logger = logging.getLogger(__name__)

model = SentenceTransformer("all-MiniLM-L6-v2")

SENIORITY_MAP = {
    "junior": ["intern", "junior", "entry", "graduate", "fresher", "trainee"],
    "mid": ["mid", "intermediate", "engineer", "developer", "analyst"],
    "senior": ["senior", "lead", "principal", "architect", "manager", "head"]
}

def score_overlap(list_a: list, list_b: list) -> int:
    a = set(s.lower() for s in list_a)
    b = set(s.lower() for s in list_b)
    if not b:
        return 0
    overlap = len(a.intersection(b))
    return min(100, int((overlap / len(b)) * 100))

def score_seniority(signals: list, required: str) -> int:
    required_level = required.lower()
    signal_text = " ".join(signals).lower()
    keywords = SENIORITY_MAP.get(required_level, [])
    matches = sum(1 for k in keywords if k in signal_text)
    if matches >= 2:
        return 90
    elif matches == 1:
        return 65
    else:
        return 40

def score_embedding(text_a: str, text_b: str) -> int:
    if not text_a.strip() or not text_b.strip():
        return 0
    emb_a = model.encode(text_a, convert_to_tensor=True)
    emb_b = model.encode(text_b, convert_to_tensor=True)
    similarity = util.cos_sim(emb_a, emb_b).item()
    return min(100, int(similarity * 100))

def compute_scores(resume: ParsedResume, jd: ParsedJD) -> dict:
    logger.info("Computing deterministic scores")

    technical = score_overlap(resume.skills, jd.required_skills)

    experience_text_a = " ".join(resume.experience)
    experience_text_b = " ".join(jd.required_skills + jd.nice_to_have)
    experience = score_embedding(experience_text_a, experience_text_b)

    seniority = score_seniority(resume.seniority_signals, jd.seniority)

    domain = score_overlap(resume.keywords, jd.keywords)

    language_text_a = " ".join(resume.skills + resume.keywords)
    language_text_b = " ".join(jd.required_skills + jd.keywords)
    language = score_embedding(language_text_a, language_text_b)

    scores = {
        "technical": technical,
        "experience": experience,
        "seniority": seniority,
        "domain": domain,
        "language": language
    }

    logger.info(f"Scores computed: {scores}")
    return scores
