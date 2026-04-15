import { useState } from "react"
import UploadSection from "./components/UploadSection"
import ResultSection from "./components/ResultSection"

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">GapIQ</h1>
        <p className="text-sm text-gray-500">AI-Powered Career Gap Analyzer</p>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <UploadSection
          setResult={setResult}
          setLoading={setLoading}
          setError={setError}
          loading={loading}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        {result && <ResultSection result={result} />}
      </main>
    </div>
  )
}

export default App
