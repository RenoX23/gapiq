const LABELS = {
    technical: "Technical Skills",
    experience: "Experience",
    seniority: "Seniority Fit",
    domain: "Domain Relevance",
    language: "Language Alignment"
  }

  const ROLE_FIT_STYLES = {
    "Strong Match": "bg-green-100 text-green-700",
    "Moderate Match": "bg-yellow-100 text-yellow-700",
    "Weak Match": "bg-red-100 text-red-600"
  }

  function getExplanation(key, value, breakdown) {
    if (key === "technical") {
      if (breakdown?.matched?.length && breakdown?.missing?.length) {
        return `Matched ${breakdown.matched.length} of ${breakdown.matched.length + breakdown.missing.length} required skills. Missing: ${breakdown.missing.slice(0, 3).join(", ")}.`
      }
      if (breakdown?.matched?.length && !breakdown?.missing?.length) {
        return `All required skills matched.`
      }
      if (!breakdown?.matched?.length && breakdown?.missing?.length) {
        return `No required skills matched. JD expects: ${breakdown.missing.slice(0, 3).join(", ")}.`
      }
      return value >= 70 ? "Strong skill alignment." : value >= 40 ? "Partial skill alignment." : "Low skill overlap with JD requirements."
    }

    if (key === "experience") {
      if (value >= 70) return "Experience profile closely mirrors the JD requirements."
      if (value >= 40) return "Some experience overlap with JD — strengthen role-specific bullet points."
      return "Experience section has low relevance to this JD. Reframe bullet points toward the role."
    }

    if (key === "seniority") {
      if (value >= 70) return "Seniority level aligns well with the role."
      if (value >= 40) return "Partial seniority match — you may be slightly junior or senior for this role."
      return "Seniority mismatch detected. Check if the role level matches your experience."
    }

    if (key === "domain") {
      if (breakdown?.matched?.length && breakdown?.missing?.length) {
        return `Matched ${breakdown.matched.length} domain keywords. Missing context: ${breakdown.missing.slice(0, 3).join(", ")}.`
      }
      if (breakdown?.matched?.length && !breakdown?.missing?.length) {
        return "Domain keywords strongly aligned."
      }
      if (!breakdown?.matched?.length && breakdown?.missing?.length) {
        return `Domain mismatch. JD context includes: ${breakdown.missing.slice(0, 3).join(", ")}.`
      }
      return value >= 70 ? "Strong domain alignment." : value >= 40 ? "Moderate domain overlap." : "Low domain relevance to this JD."
    }

    if (key === "language") {
      if (value >= 70) return "Resume language closely mirrors the JD tone and terminology."
      if (value >= 40) return "Moderate language alignment — consider mirroring JD phrasing more directly."
      return "Resume language diverges significantly from JD. Use the same terminology the JD uses."
    }

    return null
  }

  function SkillChips({ matched, missing }) {
    if (!matched?.length && !missing?.length) return null
    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {matched?.map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            ✓ {skill}
          </span>
        ))}
        {missing?.map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
            ✗ {skill}
          </span>
        ))}
      </div>
    )
  }

  function ScoreBar({ label, value, breakdown, explanation }) {
    const color = value >= 70 ? "bg-green-500" : value >= 40 ? "bg-yellow-400" : "bg-red-400"
    return (
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-800">{value}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
        </div>
        {explanation && (
          <p className="mt-1 text-xs text-gray-500">{explanation}</p>
        )}
        {breakdown && <SkillChips matched={breakdown.matched} missing={breakdown.missing} />}
      </div>
    )
  }

  export default function ScoreSection({ scores, breakdown }) {
    const axisScores = Object.entries(scores).filter(([k]) => k !== "overall" && k !== "role_fit")
    const overall = scores.overall != null
      ? scores.overall
      : Math.round(axisScores.reduce((a, [, v]) => a + v, 0) / axisScores.length)
    const roleFit = scores.role_fit
    const roleFitStyle = ROLE_FIT_STYLES[roleFit] || "bg-gray-100 text-gray-600"

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Match Scores</h2>
          <span className="text-3xl font-bold text-blue-600">{overall}%</span>
        </div>
        {roleFit && (
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleFitStyle}`}>
              {roleFit}
            </span>
          </div>
        )}
        <div className="space-y-4">
          {axisScores.map(([key, value]) => (
            <ScoreBar
              key={key}
              label={LABELS[key] || key}
              value={value}
              breakdown={breakdown?.[key]}
              explanation={getExplanation(key, value, breakdown?.[key])}
            />
          ))}
        </div>
      </div>
    )
  }
