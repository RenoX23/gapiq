const TYPE_CONFIG = {
    course: { color: '#4F6EF7', bg: '#0D1233', border: '#1E3A8A' },
    project: { color: '#A855F7', bg: '#130D1C', border: '#6B21A8' },
    certification: { color: '#F59E0B', bg: '#1C1506', border: '#92400E' }
  }

  export default function RoadmapSection({ roadmap }) {
    if (!roadmap.length) return null
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1D27', border: '1px solid #2D3148' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>Learning Roadmap</h2>
        <div className="space-y-3">
          {roadmap.map((item, i) => {
            const config = TYPE_CONFIG[item.resource_type] || { color: '#64748B', bg: '#1E2130', border: '#2D3148' }
            return (
              <div key={i} className="rounded-xl p-4"
                style={{ backgroundColor: '#0F1117', border: '1px solid #2D3148' }}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{item.skill}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                    {item.resource_type}
                  </span>
                </div>
                {/* Steps */}
                <ol className="space-y-2">
                  {item.steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-xs"
                      style={{ color: '#94A3B8' }}>
                      <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: '#1E2130', color: '#4F6EF7' }}>
                        {j + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
