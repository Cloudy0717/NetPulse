import { useState, useEffect } from 'react'
import { PingRecord } from '@/types'
import { fetchPingHistory } from '@/services/api'
import PingHistoryChart from '@/components/charts/PingHistoryChart'
import { Download } from 'lucide-react'
import { API_URL } from '@/services/api'

export default function PingHistoryPage() {
  const [records, setRecords] = useState<PingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [host, setHost] = useState('google.com')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchPingHistory(host, undefined, undefined, 200)
        setRecords(data.records || [])
      } catch {
        setRecords([])
      }
      setLoading(false)
    }
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [host])

  const exportCSV = () => {
    window.open(`${API_URL}/api/history/ping/export?host=${host}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-text-primary">Ping History</h2>
        <div className="flex items-center gap-3">
          <select
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="bg-base-border text-text-primary rounded-lg px-4 py-2 border border-base-border font-body"
          >
            <option value="google.com">Google (8.8.8.8)</option>
            <option value="cloudflare.com">Cloudflare (1.1.1.1)</option>
            <option value="1.1.1.1">1.1.1.1</option>
          </select>
          {records.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-base-border hover:bg-base-border/80 text-slate-300 rounded-lg transition-colors text-sm font-body"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <PingHistoryChart data={records} />

      <div className="bg-base-surface rounded-xl border border-base-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-border text-slate-400">
              <th className="text-left p-3 font-body">Time</th>
              <th className="text-left p-3 font-body">Latency</th>
              <th className="text-left p-3 font-body">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="p-3 text-center text-slate-500 font-body">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={3} className="p-3 text-center text-slate-500 font-body">No data yet. Wait for ping data to accumulate...</td></tr>
            ) : (
              records.slice(0, 50).map((r) => (
                <tr key={r.id} className="border-b border-base-border/50">
                  <td className="p-3 text-slate-300 font-body">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 font-mono">
                    {r.latency_ms !== null ? `${r.latency_ms} ms` : '---'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      r.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
