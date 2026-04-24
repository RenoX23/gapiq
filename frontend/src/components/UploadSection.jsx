import { useState } from "react"
import axios from "axios"

const BASE_URL = "https://gapiq-backend.onrender.com"
const STEPS = ["Parsing resume...", "Analyzing job description...", "Computing scores...", "Generating insights..."]

export default function UploadSection({ setResult, setLoading, setError, loading }) {
  const [file, setFile] = useState(null)
  const [jdText, setJdText] = useState("")
  const [step, setStep] = useState("")
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === "application/pdf") setFile(dropped)
  }

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload a resume PDF.")
    if (!jdText.trim()) return setError("Please paste a job description.")

    setError(null)
    setResult(null)
    setLoading(true)

    try {
      setStep(STEPS[0])
      const formData = new FormData()
      formData.append("file", file)
      const parseRes = await axios.post(`${BASE_URL}/parse/resume`, formData, {
        timeout: 60000
      })
      const resumeText = parseRes.data.text

      setStep(STEPS[1])
      await new Promise(r => setTimeout(r, 500))

      setStep(STEPS[2])
      await new Promise(r => setTimeout(r, 500))

      setStep(STEPS[3])
      const analyzeRes = await axios.post(`${BASE_URL}/analyze`, {
        resume_text: resumeText,
        jd_text: jdText
      }, {
        timeout: 120000
      })

      setResult(analyzeRes.data)
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. The server may be waking up — please try again in 30 seconds.")
      } else {
        setError(err.response?.data?.detail || "Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
      setStep("")
    }
  }

  return (
    <div className="rounded-2xl p-6 space-y-5"
      style={{ backgroundColor: '#1A1D27', border: '1px solid #2D3148' }}>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#94A3B8' }}>
          Resume <span style={{ color: '#4F6EF7' }}>·</span> PDF only
        </label>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="rounded-xl p-8 text-center transition-all"
          style={{
            border: dragging
              ? '2px dashed #4F6EF7'
              : file
              ? '2px dashed #22C55E'
              : '2px dashed #2D3148',
            backgroundColor: dragging ? '#1E2340' : '#0F1117'
          }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files[0])}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {file ? (
              <>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#0D2818' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#22C55E' }}>{file.name}</span>
                <span className="text-xs" style={{ color: '#64748B' }}>Click to change file</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#1E2130' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="#4F6EF7" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 15V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15"
                      stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-sm font-medium" style={{ color: '#94A3B8' }}>
                  Drop your PDF here or <span style={{ color: '#4F6EF7' }}>browse</span>
                </span>
                <span className="text-xs" style={{ color: '#475569' }}>PDF files only · Max 10MB</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* JD Input */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#94A3B8' }}>
          Job Description <span style={{ color: '#4F6EF7' }}>·</span> Paste from any job board
        </label>
        <textarea
          rows={6}
          placeholder="Paste the full job description here — including required skills, responsibilities, and qualifications..."
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          className="w-full rounded-xl p-4 text-sm resize-none focus:outline-none transition-all"
          style={{
            backgroundColor: '#0F1117',
            border: jdText.length > 0 ? '1px solid #4F6EF7' : '1px solid #2D3148',
            color: '#F1F5F9',
            caretColor: '#4F6EF7'
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#475569' }}>
            {jdText.length < 100 && jdText.length > 0
              ? 'Add more detail for better analysis'
              : jdText.length >= 100
              ? '✓ Good length'
              : ''}
          </span>
          <span className="text-xs" style={{ color: '#475569' }}>{jdText.length} characters</span>
        </div>
      </div>

      {/* Analyse Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
        style={{
          backgroundColor: loading ? '#2D3148' : '#4F6EF7',
          color: loading ? '#64748B' : '#ffffff',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#4F6EF7" strokeWidth="3"
                strokeLinecap="round"/>
            </svg>
            {step}
          </span>
        ) : (
          "Analyse →"
        )}
      </button>
    </div>
  )
}
