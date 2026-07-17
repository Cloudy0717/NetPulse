import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowDown, Clock, Server } from 'lucide-react'
import { API_URL } from '@/services/api'
import WaveScan from '@/components/charts/WaveScan'

interface SpeedTestResult {
  download_mbps: number
  upload_mbps: number
  latency_ms: number
  server: string
}

export default function SpeedtestPage() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'testing' | 'complete'>('idle')
  const [speed, setSpeed] = useState(0)
  const [phase, setPhase] = useState('')
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const pollRef = useRef<ReturnType<typeof setInterval>>()

  const runTest = useCallback(async () => {
    setStatus('connecting')
    setResult(null)
    setError('')
    setSpeed(0)

    try {
      const startRes = await fetch(`${API_URL}/api/speedtest`, { method: 'POST' })
      const { job_id } = await startRes.json()

      setStatus('testing')

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`${API_URL}/api/speedtest/${job_id}`)
          const data = await statusRes.json()

          if (data.phase) setPhase(data.phase)
          if (data.phase?.includes('upload') && data.upload_speed !== undefined) {
            setSpeed(data.upload_speed)
          } else if (data.download_speed !== undefined) {
            setSpeed(data.download_speed)
          }

          if (data.status === 'done') {
            clearInterval(pollRef.current)
            setResult(data.result)
            setSpeed(data.result.download_mbps)
            setStatus('complete')
          } else if (data.status === 'error') {
            clearInterval(pollRef.current)
            setError(data.error || 'Test failed')
            setStatus('complete')
          }
        } catch {
          clearInterval(pollRef.current)
          setError('Failed to connect to server')
          setStatus('complete')
        }
      }, 600)
    } catch {
      setError('Failed to connect to server')
      setStatus('complete')
    }
  }, [API_URL])

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const handleRestart = () => {
    setStatus('idle')
    setResult(null)
    setError('')
    setSpeed(0)
  }

  const scanStatus = status === 'connecting' ? 'testing'
    : status === 'complete' && error ? 'idle'
    : status === 'complete' && result ? 'complete'
    : status

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-text-primary">Speed Test</h1>

      <WaveScan
        status={scanStatus}
        speed={speed}
        phase={phase}
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
