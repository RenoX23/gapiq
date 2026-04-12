# GapIQ — Internal Data Schema

## Input
### Resume Input
```json
{
  "resume_text": "string"
}
```

### JD Input
```json
{
  "jd_text": "string"
}
```

## Intermediate (Phase 3A output)
### Parsed Resume
```json
{
  "skills": ["string"],
  "experience": ["string"],
  "keywords": ["string"],
  "seniority_signals": ["string"]
}
```

### Parsed JD
```json
{
  "required_skills": ["string"],
  "nice_to_have": ["string"],
  "keywords": ["string"],
  "seniority": "junior | mid | senior"
}
```

## Output (Phase 3C final response)
```json
{
  "scores": {
    "technical": 0,
    "experience": 0,
    "seniority": 0,
    "domain": 0,
    "language": 0
  },
  "gaps": [
    {
      "skill": "string",
      "priority": "high | medium | low",
      "reason": "string"
    }
  ],
  "recommendations": [
    {
      "original": "string",
      "improved": "string"
    }
  ],
  "roadmap": [
    {
      "skill": "string",
      "resource_type": "course | project | certification",
      "steps": ["string"]
    }
  ],
  "recruiter_lens": {
    "strengths": ["string"],
    "weaknesses": ["string"]
  }
}
```
