export default function RecommendationSection({ recommendations }) {
    if (!recommendations.length) return null
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#1A1D27', border: '1px solid #2D3148' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#F1F5F9' }}>Resume Recommendations</h2>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid #2D3148' }}>
              {/* Original */}
              <div className="p-4" style={{ backgroundColor: '#1C0606', borderBottom: '1px solid #2D3148' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#EF4444' }}></span>
                  <p className="text-xs font-semibold tracking-wide" style={{ color: '#EF4444' }}>ORIGINAL</p>
                </div>
                <p className="text-sm" style={{ color: '#94A3B8' }}>{rec.original}</p>
              </div>
              {/* Arrow indicator */}
              <div className="flex items-center justify-center py-1.5"
                style={{ backgroundColor: '#0F1117' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="#4F6EF7" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Improved */}
              <div className="p-4" style={{ backgroundColor: '#0D2818' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22C55E' }}></span>
                  <p className="text-xs font-semibold tracking-wide" style={{ color: '#22C55E' }}>IMPROVED</p>
                </div>
                <p className="text-sm" style={{ color: '#F1F5F9' }}>{rec.improved}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
