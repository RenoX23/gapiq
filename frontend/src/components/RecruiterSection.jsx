export default function RecruiterSection({ recruiter }) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recruiter Lens</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-green-600 mb-2">Strengths</p>
            <ul className="space-y-2">
              {recruiter.strengths.map((s, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-green-500 shrink-0">✓</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-red-500 mb-2">Weaknesses</p>
            <ul className="space-y-2">
              {recruiter.weaknesses.map((w, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-red-400 shrink-0">✗</span>{w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
