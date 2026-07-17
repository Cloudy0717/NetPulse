import { useState, useEffect } from 'react'
import { SpeedTestRecord } from '@/types'
import { fetchSpeedHistory } from '@/services/api'
import { Download } from 'lucide-react'

export default function HistoryPage() {
  const [records, setRecords] = useState<SpeedTestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchSpeedHistory(50)
        setRecords(data.records || [])
      } catch {
        setRecords([])
      }
      setLoading(false)
    }
    load()
  }, [])

  const exportCSV = () => {
    window.open(`${API_URL}/api/history/speed/export`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-text-primary">Speed Test History</h2>
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
      <div className="bg-base-surface rounded-xl border border-base-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-base-border text-slate-400">
              <th className="text-left p-3 font-body">Date</th>
              <th className="text-left p-3 font-body">Download</th>
              <th className="text-left p-3 font-body">Upload</th>
              <th className="text-left p-3 font-body">Latency</th>
              <th className="text-left p-3 font-body">Server</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500 font-body">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500 font-body">No speed tests yet. Run one from the Speed Test page!</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-b border-base-border/50">
                  <td className="p-3 text-slate-300 font-body">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-3 text-accent font-mono">{r.download_mbps} Mbps</td>
                  <td className="p-3 text-green-400 font-mono">{r.upload_mbps} Mbps</td>
                  <td className="p-3 font-mono">{r.latency_ms !== null ? `${r.latency_ms} ms` : '---'}</td>
                  <td className="p-3 text-slate-400 font-mono">{r.server || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
