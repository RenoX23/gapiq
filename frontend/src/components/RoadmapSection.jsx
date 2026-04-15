const TYPE_COLORS = {
    course: "bg-blue-100 text-blue-700",
    project: "bg-purple-100 text-purple-700",
    certification: "bg-orange-100 text-orange-700"
  }

  export default function RoadmapSection({ roadmap }) {
    if (!roadmap.length) return null
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Learning Roadmap</h2>
        <div className="space-y-4">
          {roadmap.map((item, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-medium text-gray-800 text-sm">{item.skill}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[item.resource_type] || "bg-gray-100 text-gray-600"}`}>
                  {item.resource_type}
                </span>
              </div>
              <ol className="space-y-1">
                {item.steps.map((step, j) => (
                  <li key={j} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-blue-500 font-medium shrink-0">{j + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    )
  }
