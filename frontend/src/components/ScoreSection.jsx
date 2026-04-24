const LABELS = {
    technical: "Technical Skills",
    experience: "Experience",
    seniority: "Seniority Fit",
    domain: "Domain Relevance",
    language: "Language Alignment"
  }

  const ROLE_FIT_CONFIG = {
    "Strong Match": { color: '#22C55E', bg: '#0D2818', border: '#166534' },
    "Moderate Match": { color: '#F59E0B', bg: '#1C1506', border: '#92400E' },
    "Weak Match": { color: '#EF4444', bg: '#1C0606', border: '#991B1B' }
  }

  function getExplanation(key, value, breakdown) {
    if (key === "technical") {
      if (breakdown?.matched?.length && breakdown?.missing?.length)
        return `Matched ${breakdown.matched.length} of ${breakdown.matched.length + breakdown.missing.length} required skills. Missing: ${breakdown.missing.slice(0, 3).join(", ")}.`
      if (breakdown?.matched?.length && !breakdown?.missing?.length)
        return "All required skills matched."
      if (!breakdown?.matched?.length && breakdown?.missing?.length)
        return `No required skills matched. JD expects: ${breakdown.missing.slice(0, 3).join(", ")}.`
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
      if (breakdown?.matched?.length && breakdown?.missing?.length)
        return `Matched ${breakdown.matched.length} domain keywords. Missing context: ${breakdown.missing.slice(0, 3).join(", ")}.`
      if (breakdown?.matched?.length && !breakdown?.missing?.length)
        return "Domain keywords strongly aligned."
      if (!breakdown?.matched?.length && breakdown?.missing?.length)
        return `Domain mismatch. JD context includes: ${breakdown.missing.slice(0, 3).join(", ")}.`
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
      <div className="mt-2 flex flex-wrap gap-1.5">
        {matched?.map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#0D2818', color: '#22C55E', border: '1px solid #166534' }}>
            ✓ {skill}
          </span>
        ))}
        {missing?.map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#1C0606', color: '#EF4444', border: '1px solid #991B1B' }}>
            ✗ {skill}
          </span>
        ))}
      </div>
    )
  }

  function ScoreBar({ label, value, breakdown, explanation }) {
    const barColor = value >= 70 ? '#22C55E' : value >= 40 ? '#F59E0B' : '#EF4444'
    return (
      <div className="py-3" style={{ borderBottom: '1px solid #1E2130' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: '#94A3B8' }}>{label}</span>
          <span className="text-sm font-bold" style={{ color: barColor }}>{value}%</span>
        </div>
        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#1E2130' }}>
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${value}%`, backgroundColor: barColor }} />
        </div>
        {explanation && (
          <p className="mt-1.5 text-xs" style={{ color: '#475569' }}>{explanation}</p>
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
    const fitConfig = ROLE_FIT_CONFIG[roleFit]
    const overallColor = overall >= 70 ? '#22C55E' : overall >= 40 ? '#F59E0B' : '#EF4444'

    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1D27', border: '1px solid #2D3148' }}>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-base font-semibold mb-1" style={{ color: '#F1F5F9' }}>Match Scores</h2>
            {fitConfig && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: fitConfig.bg, color: fitConfig.color, border: `1px solid ${fitConfig.border}` }}>
                {roleFit}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold tracking-tight" style={{ color: overallColor }}>
              {overall}%
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Overall Match</div>
          </div>
        </div>

        {/* Score Bars */}
        <div>
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
