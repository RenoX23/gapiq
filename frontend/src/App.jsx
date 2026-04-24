import { useState } from "react"
import UploadSection from "./components/UploadSection"
import ResultSection from "./components/ResultSection"

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1117' }}>

      {/* Navbar */}
      <header style={{ backgroundColor: '#0F1117', borderBottom: '1px solid #1E2130' }}
        className="px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#4F6EF7' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L6 7L9 10L12 4" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="4" r="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#F1F5F9' }}>
              Gap<span style={{ color: '#4F6EF7' }}>IQ</span>
            </span>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: '#1A1D27', color: '#64748B', border: '1px solid #2D3148' }}>
          AI-Powered · Career Gap Analysis
        </span>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
          style={{ backgroundColor: '#1A1D27', color: '#4F6EF7', border: '1px solid #2D3148' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#4F6EF7' }}></span>
          Powered by Llama 3.3 · 70B
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4" style={{ color: '#F1F5F9' }}>
          Know exactly where you<br />
          <span style={{ color: '#4F6EF7' }}>stand for any role.</span>
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: '#64748B' }}>
          Upload your resume, paste a job description — get a multi-axis match score,
          skill gap breakdown, and a personalized learning roadmap in seconds.
        </p>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 pb-16">
        <UploadSection
          setResult={setResult}
          setLoading={setLoading}
          setError={setError}
          loading={loading}
        />
        {error && (
          <div className="mt-4 p-4 rounded-xl text-sm"
            style={{ backgroundColor: '#1A1D27', border: '1px solid #EF4444', color: '#EF4444' }}>
            {error}
          </div>
        )}
        {result && <ResultSection result={result} />}
      </main>

    </div>
  )
}

export default App
