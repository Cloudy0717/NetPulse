import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gauge, ArrowUp, ArrowDown, Clock, Server, Loader2 } from 'lucide-react'

interface SpeedTestResult {
  download_mbps: number
  upload_mbps: number
  latency_ms: number
  server: string
}

export default function SpeedtestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const runTest = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const startRes = await fetch(`${API_URL}/api/speedtest`, { method: 'POST' })
      const { job_id } = await startRes.json()

      let done = false
      while (!done) {
        await new Promise((r) => setTimeout(r, 2000))
        const statusRes = await fetch(`${API_URL}/api/speedtest/${job_id}`)
        const status = await statusRes.json()
        if (status.status === 'done') {
          setResult(status.result)
          done = true
        } else if (status.status === 'error') {
          setError(status.error || 'Test failed')
          done = true
        }
      }
    } catch {
      setError('Failed to connect to server')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Speed Test</h1>

      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <button
          onClick={runTest}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg transition-colors text-lg font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Gauge className="w-5 h-5" />
              Run Speed Test
            </>
          )}
        </button>
        <p className="text-sm text-slate-400 mt-2">
          This may take 20-30 seconds to complete
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <ArrowDown className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Download</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{result.download_mbps} <span className="text-lg text-slate-400">Mbps</span></div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <ArrowUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Upload</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">{result.upload_mbps} <span className="text-lg text-slate-400">Mbps</span></div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Latency</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{result.latency_ms} <span className="text-lg text-slate-400">ms</span></div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Server className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Server</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">{result.server}</div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
        >
          View Speed History
        </button>
      </div>
    </div>
  )
}
