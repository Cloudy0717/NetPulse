import { useState } from 'react'
import { Globe, Loader2 } from 'lucide-react'

interface Hop {
  hop: number
  ip: string
}

export default function TraceroutePage() {
  const [host, setHost] = useState('google.com')
  const [hops, setHops] = useState<Hop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const runTrace = async () => {
    setLoading(true)
    setError('')
    setHops([])
    try {
      const res = await fetch(`${API_URL}/api/traceroute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host }),
      })
      const data = await res.json()
      setHops(data.hops || [])
    } catch {
      setError('Failed to run traceroute')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-text-primary">Traceroute</h1>

      <div className="bg-base-surface rounded-xl p-4 border border-base-border">
        <div className="flex gap-2">
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="Enter host (e.g., google.com)"
            className="flex-1 bg-base-border rounded-lg px-4 py-2 border border-base-border text-text-primary font-mono text-sm"
          />
          <button
            onClick={runTrace}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent/90 disabled:bg-base-border text-black rounded-lg transition-colors font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {loading ? 'Tracing...' : 'Trace'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 font-body">{error}</div>
      )}

      {hops.length > 0 && (
        <div className="bg-base-surface rounded-xl border border-base-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-border text-slate-400">
                <th className="text-left p-3 font-body">Hop</th>
                <th className="text-left p-3 font-body">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {hops.map((hop, i) => (
                <tr key={i} className="border-b border-base-border/50">
                  <td className="p-3 text-slate-500 font-mono">{hop.hop}</td>
                  <td className="p-3 font-mono text-slate-300">{hop.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && hops.length === 0 && !error && (
        <div className="text-center text-slate-500 py-8 font-body">Enter a host and click Trace to see the route</div>
      )}
    </div>
  )
}
