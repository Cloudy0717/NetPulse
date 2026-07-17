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
        <h2 className="text-2xl font-bold">Speed Test History</h2>
        {records.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Download</th>
              <th className="text-left p-3">Upload</th>
              <th className="text-left p-3">Latency</th>
              <th className="text-left p-3">Server</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} className="p-3 text-center text-slate-500">No speed tests yet. Run one from the Speed Test page!</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-b border-slate-800/50">
                  <td className="p-3 text-slate-300">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-3 text-blue-400">{r.download_mbps} Mbps</td>
                  <td className="p-3 text-emerald-400">{r.upload_mbps} Mbps</td>
                  <td className="p-3">{r.latency_ms !== null ? `${r.latency_ms} ms` : '---'}</td>
                  <td className="p-3 text-slate-400">{r.server || 'Unknown'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
