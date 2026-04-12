import { useEffect, useState } from "react"

function App() {
  const [status, setStatus] = useState("checking...")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus("backend unreachable"))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">GapIQ</h1>
        <p className="mt-2 text-gray-500">Backend status: <span className="font-medium text-green-600">{status}</span></p>
      </div>
    </div>
  )
}

export default App
