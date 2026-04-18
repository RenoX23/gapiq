const LABELS = {
    technical: "Technical Skills",
    experience: "Experience",
    seniority: "Seniority Fit",
    domain: "Domain Relevance",
    language: "Language Alignment"
  }

  function ScoreBar({ label, value }) {
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
      </div>
    )
  }

  export default function ScoreSection({ scores }) {
    const axisScores = Object.entries(scores).filter(([k]) => k !== "overall")
    const overall = scores.overall != null
      ? scores.overall
      : Math.round(axisScores.reduce((a, [,v]) => a + v, 0) / axisScores.length)

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Match Scores</h2>
          <span className="text-3xl font-bold text-blue-600">{overall}%</span>
        </div>
        <div className="space-y-4">
          {axisScores.map(([key, value]) => (
            <ScoreBar key={key} label={LABELS[key] || key} value={value} />
          ))}
        </div>
      </div>
    )
  }
