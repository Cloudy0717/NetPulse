import { useState } from 'react'
import { API_URL } from '@/services/api'

interface OpenPort {
  port: number
  open: boolean
}

const commonPorts: Record<number, string> = {
  21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP',
  53: 'DNS', 80: 'HTTP', 110: 'POP3', 143: 'IMAP',
  443: 'HTTPS', 3306: 'MySQL', 3389: 'RDP',
  5432: 'PostgreSQL', 6379: 'Redis', 8080: 'HTTP-Alt',
  8443: 'HTTPS-Alt', 27017: 'MongoDB',
}

export default function PortScannerPage() {
  const [host, setHost] = useState('127.0.0.1')
  const [startPort, setStartPort] = useState(1)
  const [endPort, setEndPort] = useState(100)
  const [results, setResults] = useState<OpenPort[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const scan = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/portscan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, start_port: startPort, end_port: endPort }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Scan failed')
        setResults([])
      } else {
        setResults(data.open_ports || [])
      }
    } catch {
      setError('Failed to connect to server')
      setResults([])
    }
    setLoading(false)
  }

  return (
    <div className="p-4 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-display text-2xl text-text-primary">Port Scanner</h2>
      </div>

      <div className="bg-base-surface rounded-xl p-4 border border-base-border space-y-4 mb-6">
        <div>
          <label className="text-sm text-slate-400 mb-1 block font-body">Target Host</label>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full bg-base-border rounded-lg px-4 py-2 border border-base-border text-text-primary font-mono"
            placeholder="127.0.0.1"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-slate-400 mb-1 block font-body">Start Port</label>
            <input
              type="number"
              value={startPort}
              onChange={(e) => setStartPort(Number(e.target.value))}
              min={1} max={65535}
              className="w-full bg-base-border rounded-lg px-4 py-2 border border-base-border text-text-primary font-mono"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-slate-400 mb-1 block font-body">End Port</label>
            <input
              type="number"
              value={endPort}
              onChange={(e) => setEndPort(Number(e.target.value))}
              min={1} max={65535}
              className="w-full bg-base-border rounded-lg px-4 py-2 border border-base-border text-text-primary font-mono"
            />
          </div>
        </div>
        <button
          onClick={scan}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 disabled:bg-base-border disabled:text-slate-500 text-black py-3 rounded-lg font-medium transition-colors font-body"
        >
          {loading ? 'Scanning...' : 'Scan Ports'}
        </button>
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-3 font-body">{error}</div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-base-surface rounded-xl border border-base-border overflow-hidden">
          <div className="px-4 py-3 border-b border-base-border text-sm text-slate-400 font-body">
            Found {results.length} open port{results.length > 1 ? 's' : ''}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-border text-slate-400">
                <th className="text-left p-3 font-body">Port</th>
                <th className="text-left p-3 font-body">Service</th>
                <th className="text-left p-3 font-body">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr key={p.port} className="border-b border-base-border/50">
                  <td className="p-3 font-mono text-slate-300">{p.port}</td>
                  <td className="p-3 text-slate-400 font-mono">{commonPorts[p.port] || 'Unknown'}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 font-mono">
                      Open
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center text-slate-500 py-8 font-body">
          No open ports found. Try a different range.
        </div>
      )}
    </div>
  )
}
