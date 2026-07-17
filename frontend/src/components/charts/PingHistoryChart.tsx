import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PingRecord } from '@/types'

interface Props {
  data: PingRecord[]
}

export default function PingHistoryChart({ data }: Props) {
  const chartData = data
    .filter((r) => r.latency_ms !== null)
    .map((r) => ({
      time: new Date(r.created_at).toLocaleTimeString(),
      latency: r.latency_ms,
    }))
    .reverse()

  if (chartData.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 text-slate-400 text-center">
        No ping data available
      </div>
    )
  }

  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Ping Latency History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit=" ms" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
