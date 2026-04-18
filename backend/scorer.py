import logging
from models import ParsedResume, ParsedJD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

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

def score_tfidf(text_a: str, text_b: str) -> int:
    if not text_a.strip() or not text_b.strip():
        return 0
    try:
        vectorizer = TfidfVectorizer()
        tfidf = vectorizer.fit_transform([text_a, text_b])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return min(100, int(similarity * 100))
    except Exception:
        return 0

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

def compute_scores(resume: ParsedResume, jd: ParsedJD) -> dict:
    logger.info("Computing deterministic scores")

    # Technical — overlap on skills
    technical = score_overlap(resume.skills, jd.required_skills)

    # Boost technical if partial matches exist
    if technical == 0:
        resume_skills_text = " ".join(resume.skills).lower()
        jd_skills_text = " ".join(jd.required_skills).lower()
        technical = score_tfidf(resume_skills_text, jd_skills_text)

    # Experience — TF-IDF on experience vs all JD requirements
    experience_text_a = " ".join(resume.experience + resume.skills)
    experience_text_b = " ".join(jd.required_skills + jd.nice_to_have + jd.keywords)
    experience = score_tfidf(experience_text_a, experience_text_b)

    # Seniority
    seniority = score_seniority(resume.seniority_signals, jd.seniority)

    # Domain — overlap plus TF-IDF fallback
    domain = score_overlap(resume.keywords, jd.keywords)
    if domain == 0:
        domain_text_a = " ".join(resume.keywords + resume.skills)
        domain_text_b = " ".join(jd.keywords + jd.required_skills)
        domain = min(100, int(score_tfidf(domain_text_a, domain_text_b) * 1.5))

    # Language — full profile vs full JD
    language_text_a = " ".join(resume.skills + resume.keywords + resume.experience)
    language_text_b = " ".join(jd.required_skills + jd.keywords + jd.nice_to_have)
    language = score_tfidf(language_text_a, language_text_b)

    scores = {
        "technical": min(100, technical),
        "experience": min(100, experience),
        "seniority": seniority,
        "domain": min(100, domain),
        "language": min(100, language)
    }

    # Weighted average — technical and experience matter most
    weighted = (
        scores["technical"] * 0.35 +
        scores["experience"] * 0.25 +
        scores["seniority"] * 0.15 +
        scores["domain"] * 0.15 +
        scores["language"] * 0.10
    )
    scores["overall"] = min(100, int(weighted))

    logger.info(f"Scores computed: {scores}")
    return scores
