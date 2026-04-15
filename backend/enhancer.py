import json
import logging
from groq import Groq
from models import ParsedResume, ParsedJD, SkillGap, Recommendation, RoadmapItem, RecruiterLens
import os
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

ANALYSIS_PROMPT = """
You are a career analyst. Given a candidate's parsed resume and a job description, perform a gap analysis.

Return ONLY valid JSON. No explanation, no markdown, no extra text.

Format:
{{
  "gaps": [
    {{
      "skill": "skill name",
      "priority": "high or medium or low",
      "reason": "one sentence why this gap matters for this role"
    }}
  ],
  "recommendations": [
    {{
      "original": "existing resume bullet point or skill",
      "improved": "rewritten version to better match the JD"
    }}
  ],
  "recruiter_lens": {{
    "strengths": ["top 3 things that stand out positively"],
    "weaknesses": ["top 3 things that would concern a recruiter"]
  }}
}}

Rules:
- Maximum 5 gaps
- Maximum 3 recommendations
- Exactly 3 strengths and 3 weaknesses
- Be specific, not generic

Resume Data:
Skills: {skills}
Experience: {experience}
Keywords: {keywords}

JD Data:
Required Skills: {required_skills}
Nice to Have: {nice_to_have}
Keywords: {jd_keywords}
Seniority: {seniority}

Scores:
{scores}
"""

ROADMAP_PROMPT = """
You are a career coach. Given these skill gaps, generate a learning roadmap.

Return ONLY valid JSON. No explanation, no markdown, no extra text.

Format:
{{
  "roadmap": [
    {{
      "skill": "skill name",
      "resource_type": "course or project or certification",
      "steps": ["step 1", "step 2", "step 3"]
    }}
  ]
}}

Rules:
- Only include top 3 gaps
- Maximum 3 steps per skill
- Steps must be ordered from foundational to advanced
- Be specific, not generic

Gaps:
{gaps}
"""

def enhance(resume: ParsedResume, jd: ParsedJD, scores: dict) -> dict:
    logger.info("Starting LLM enhancement - Call 1: Gap analysis")

    prompt1 = ANALYSIS_PROMPT.format(
        skills=", ".join(resume.skills),
        experience=", ".join(resume.experience),
        keywords=", ".join(resume.keywords),
        required_skills=", ".join(jd.required_skills),
        nice_to_have=", ".join(jd.nice_to_have),
        jd_keywords=", ".join(jd.keywords),
        seniority=jd.seniority,
        scores=json.dumps(scores)
    )

    gaps = []
    recommendations = []
    recruiter_lens = RecruiterLens(strengths=[], weaknesses=[])

    for attempt in range(2):
        try:
            response1 = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt1}],
                temperature=0,
            )
            raw1 = response1.choices[0].message.content.strip()
            raw1 = raw1.replace("```json", "").replace("```", "").strip()
            data1 = json.loads(raw1)

            gaps = [SkillGap(**g) for g in data1.get("gaps", [])]
            recommendations = [Recommendation(**r) for r in data1.get("recommendations", [])]
            recruiter_lens = RecruiterLens(**data1.get("recruiter_lens", {"strengths": [], "weaknesses": []}))
            logger.info(f"Call 1 success: {len(gaps)} gaps, {len(recommendations)} recommendations")
            break

        except Exception as e:
            logger.warning(f"Call 1 attempt {attempt + 1} failed: {e}")
            if attempt == 1:
                logger.error("Call 1 failed both attempts — returning scores only")
                return {
                    "gaps": [],
                    "recommendations": [],
                    "roadmap": [],
                    "recruiter_lens": {"strengths": [], "weaknesses": []}
                }

    logger.info("Starting LLM enhancement - Call 2: Roadmap")

    roadmap = []
    if gaps:
        prompt2 = ROADMAP_PROMPT.format(
            gaps=json.dumps([g.dict() for g in gaps[:3]])
        )

        for attempt in range(2):
            try:
                response2 = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": prompt2}],
                    temperature=0,
                )
                raw2 = response2.choices[0].message.content.strip()
                raw2 = raw2.replace("```json", "").replace("```", "").strip()
                data2 = json.loads(raw2)
                roadmap = [RoadmapItem(**item) for item in data2.get("roadmap", [])]
                logger.info(f"Call 2 success: {len(roadmap)} roadmap items")
                break

            except Exception as e:
                logger.warning(f"Call 2 attempt {attempt + 1} failed: {e}")
                if attempt == 1:
                    logger.warning("Call 2 failed — roadmap will be empty")

    return {
        "gaps": [g.dict() for g in gaps],
        "recommendations": [r.dict() for r in recommendations],
        "roadmap": [r.dict() for r in roadmap],
        "recruiter_lens": recruiter_lens.dict()
    }
