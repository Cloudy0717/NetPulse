import { useState, useEffect } from 'react'
import { SpeedTestRecord } from '@/types'
import { fetchSpeedHistory } from '@/services/api'

export default function HistoryPage() {
  const [records, setRecords] = useState<SpeedTestRecord[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Speed Test History</h2>
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
