import json
import logging
from groq import Groq
from models import ParsedResume, ParsedJD
import os
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

RESUME_EXTRACTION_PROMPT = """
You are a resume parser. Extract structured information from the resume text below.

Return ONLY valid JSON. No explanation, no markdown, no extra text.

Format:
{{
  "skills": ["list of technical and soft skills"],
  "experience": ["list of experience entries as short strings"],
  "keywords": ["important domain keywords"],
  "seniority_signals": ["signals that indicate experience level e.g. 'led a team', '3 years experience'"]
}}

Resume:
{resume_text}
"""

JD_EXTRACTION_PROMPT = """
You are a job description parser. Extract structured information from the job description below.

Return ONLY valid JSON. No explanation, no markdown, no extra text.

Format:
{{
  "required_skills": ["must-have skills both explicitly stated AND reasonably implied by the role description"],
  "nice_to_have": ["preferred but not mandatory skills"],
  "keywords": ["important domain keywords"],
  "seniority": "junior or mid or senior"
}}

Job Description:
{jd_text}
"""

def extract_resume(resume_text: str) -> ParsedResume:
    logger.info("Extracting structured data from resume")

    prompt = RESUME_EXTRACTION_PROMPT.format(resume_text=resume_text)

    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )

            raw = response.choices[0].message.content.strip()
            raw = raw.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw)
            parsed = ParsedResume(**data)
            logger.info(f"Resume extracted: {len(parsed.skills)} skills found")
            return parsed

        except (json.JSONDecodeError, Exception) as e:
            logger.warning(f"Attempt {attempt + 1} failed: {e}")
            if attempt == 1:
                raise ValueError("Failed to extract structured data from resume.")


def extract_jd(jd_text: str) -> ParsedJD:
    logger.info("Extracting structured data from JD")

    prompt = JD_EXTRACTION_PROMPT.format(jd_text=jd_text)

    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )

            raw = response.choices[0].message.content.strip()
            raw = raw.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw)
            parsed = ParsedJD(**data)
            logger.info(f"JD extracted: {len(parsed.required_skills)} required skills found")
            return parsed

        except (json.JSONDecodeError, Exception) as e:
            logger.warning(f"Attempt {attempt + 1} failed: {e}")
            if attempt == 1:
                raise ValueError("Failed to extract structured data from JD.")
