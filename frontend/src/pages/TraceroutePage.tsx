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
      <h1 className="text-2xl font-bold">Traceroute</h1>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
        <div className="flex gap-2">
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="Enter host (e.g., google.com)"
            className="flex-1 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 text-white"
          />
          <button
            onClick={runTrace}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {loading ? 'Tracing...' : 'Trace'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">{error}</div>
      )}

      {hops.length > 0 && (
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="text-left p-3">Hop</th>
                <th className="text-left p-3">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {hops.map((hop, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="p-3 text-slate-500">{hop.hop}</td>
                  <td className="p-3 font-mono text-slate-300">{hop.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && hops.length === 0 && !error && (
        <div className="text-center text-slate-500 py-8">Enter a host and click Trace to see the route</div>
      )}
    </div>
  )
}
