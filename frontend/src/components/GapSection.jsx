const PRIORITY_CONFIG = {
    high: { color: '#EF4444', bg: '#1C0606', border: '#991B1B', label: 'High' },
    medium: { color: '#F59E0B', bg: '#1C1506', border: '#92400E', label: 'Medium' },
    low: { color: '#22C55E', bg: '#0D2818', border: '#166534', label: 'Low' }
  }

  export default function GapSection({ gaps }) {
    if (!gaps.length) return null
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1D27', border: '1px solid #2D3148' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>Skill Gaps</h2>
        <div className="space-y-2">
          {gaps.map((gap, i) => {
            const config = PRIORITY_CONFIG[gap.priority] || PRIORITY_CONFIG.low
            return (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                style={{ backgroundColor: '#0F1117', border: '1px solid #2D3148' }}>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 mt-0.5"
                  style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                  {config.label}
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{gap.skill}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{gap.reason}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
