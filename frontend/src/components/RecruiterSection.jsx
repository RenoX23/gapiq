export default function RecruiterSection({ recruiter }) {
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1D27', border: '1px solid #2D3148' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>Recruiter Lens</h2>
        <div className="grid grid-cols-2 gap-3">

          {/* Strengths */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#0D2818', border: '1px solid #166534' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
              <p className="text-xs font-semibold tracking-wide" style={{ color: '#22C55E' }}>STRENGTHS</p>
            </div>
            <ul className="space-y-2.5">
              {recruiter.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs" style={{ color: '#94A3B8' }}>
                  <span className="shrink-0 mt-0.5" style={{ color: '#22C55E' }}>✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#1C0606', border: '1px solid #991B1B' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF4444' }}></span>
              <p className="text-xs font-semibold tracking-wide" style={{ color: '#EF4444' }}>WEAKNESSES</p>
            </div>
            <ul className="space-y-2.5">
              {recruiter.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-xs" style={{ color: '#94A3B8' }}>
                  <span className="shrink-0 mt-0.5" style={{ color: '#EF4444' }}>✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    )
  }
