export default function RecommendationSection({ recommendations }) {
    if (!recommendations.length) return null
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resume Recommendations</h2>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="space-y-2">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs text-red-500 font-medium mb-1">Original</p>
                <p className="text-sm text-gray-700">{rec.original}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-xs text-green-600 font-medium mb-1">Improved</p>
                <p className="text-sm text-gray-700">{rec.improved}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
