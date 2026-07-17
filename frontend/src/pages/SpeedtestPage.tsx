import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowDown, Clock, Server } from 'lucide-react'
import WaveScan from '@/components/charts/WaveScan'

interface SpeedTestResult {
  download_mbps: number
  upload_mbps: number
  latency_ms: number
  server: string
}

const PHASES = [
  { text: 'Finding optimal server...', duration: 3000 },
  { text: 'Testing download speed...', duration: 10000 },
  { text: 'Testing upload speed...', duration: 8000 },
  { text: 'Measuring latency...', duration: 3000 },
]

export default function SpeedtestPage() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'testing' | 'complete'>('idle')
  const [speed, setSpeed] = useState(0)
  const [phase, setPhase] = useState('')
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const speedRef = useRef(0)

  const runTest = useCallback(async () => {
    setStatus('connecting')
    setResult(null)
    setError('')
    setSpeed(0)
    speedRef.current = 0

    try {
      const startRes = await fetch(`${API_URL}/api/speedtest`, { method: 'POST' })
      const { job_id } = await startRes.json()

      setStatus('testing')
      setPhase(PHASES[0].text)

      const phaseTimer = setInterval(() => {
        setPhase(prev => {
          const idx = PHASES.findIndex(p => p.text === prev)
          const next = Math.min(idx + 1, PHASES.length - 1)
          return PHASES[next].text
        })
      }, 6000)

      const speedSim = setInterval(() => {
        speedRef.current = Math.min(speedRef.current + Math.random() * 8 + 2, 150)
        setSpeed(Math.round(speedRef.current * 10) / 10)
      }, 1500)

      let done = false
      while (!done) {
        await new Promise((r) => setTimeout(r, 2000))
        const statusRes = await fetch(`${API_URL}/api/speedtest/${job_id}`)
        const data = await statusRes.json()
        if (data.status === 'done') {
          clearInterval(phaseTimer)
          clearInterval(speedSim)
          setResult(data.result)
          setSpeed(data.result.download_mbps)
          setStatus('complete')
          done = true
        } else if (data.status === 'error') {
          clearInterval(phaseTimer)
          clearInterval(speedSim)
          setError(data.error || 'Test failed')
          setStatus('complete')
          done = true
        }
      }
    } catch {
      setError('Failed to connect to server')
      setStatus('complete')
    }
  }, [API_URL])

  const handleRestart = () => {
    setStatus('idle')
    setResult(null)
    setError('')
    setSpeed(0)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-text-primary">Speed Test</h1>

      <WaveScan
        status={status === 'connecting' ? 'testing' : status === 'complete' && error ? 'idle' : status === 'complete' && result ? 'complete' : status === 'testing' ? 'testing' : status}
        speed={status === 'idle' || status === 'connecting' ? 0 : speed}
        phase={status === 'connecting' ? 'Initializing...' : phase}
        onStart={runTest}
        onRestart={result && !error ? handleRestart : undefined}
      />

      {status === 'complete' && error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 font-body">
          {error}
          <button onClick={handleRestart} className="ml-3 underline text-sm">Try again</button>
        </div>
      )}

      {result && status === 'complete' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-surface rounded-xl p-5 border border-base-border">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <ArrowDown className="w-4 h-4 text-accent" />
                <span className="text-sm font-body">Download</span>
              </div>
              <div className="text-3xl font-bold font-mono text-accent">
                {result.download_mbps} <span className="text-lg text-slate-400">Mbps</span>
              </div>
            </div>
            <div className="bg-base-surface rounded-xl p-5 border border-base-border">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-body">Upload</span>
              </div>
              <div className="text-3xl font-bold font-mono text-green-400">
                {result.upload_mbps} <span className="text-lg text-slate-400">Mbps</span>
              </div>
            </div>
            <div className="bg-base-surface rounded-xl p-5 border border-base-border">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Clock className="w-4 h-4 text-accent-secondary" />
                <span className="text-sm font-body">Latency</span>
              </div>
              <div className="text-3xl font-bold font-mono text-accent-secondary">
                {result.latency_ms} <span className="text-lg text-slate-400">ms</span>
              </div>
            </div>
            <div className="bg-base-surface rounded-xl p-5 border border-base-border">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Server className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-body">Server</span>
              </div>
              <div className="text-lg font-bold font-mono text-yellow-400">{result.server}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 px-4 py-2 bg-base-border hover:bg-base-border/80 text-slate-300 rounded-lg transition-colors text-sm font-body"
            >
              View Speed History
            </button>
          </div>
        </>
      )}
    </div>
  )
}
