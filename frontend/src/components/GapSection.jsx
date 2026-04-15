const PRIORITY_COLORS = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700"
  }

  export default function GapSection({ gaps }) {
    if (!gaps.length) return null
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Skill Gaps</h2>
        <div className="space-y-3">
          {gaps.map((gap, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${PRIORITY_COLORS[gap.priority]}`}>
                {gap.priority}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800">{gap.skill}</p>
                <p className="text-xs text-gray-500 mt-0.5">{gap.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
