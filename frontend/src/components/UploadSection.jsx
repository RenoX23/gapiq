import { useState } from "react"
import axios from "axios"

const BASE_URL = "https://gapiq-backend.onrender.com"
const STEPS = ["Parsing resume...", "Analyzing job description...", "Computing scores...", "Generating insights..."]

export default function UploadSection({ setResult, setLoading, setError, loading }) {
  const [file, setFile] = useState(null)
  const [jdText, setJdText] = useState("")
  const [step, setStep] = useState("")

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
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resume (PDF only)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files[0])}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            {file ? (
              <span className="text-green-600 font-medium">{file.name}</span>
            ) : (
              <span className="text-gray-400">Click to upload your resume PDF</span>
            )}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          rows={6}
          placeholder="Paste the job description here..."
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">{jdText.length} characters</p>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? step : "Analyse"}
      </button>
    </div>
  )
}
