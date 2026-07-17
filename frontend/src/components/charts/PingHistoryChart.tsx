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
      <div className="bg-base-surface rounded-xl p-6 border border-base-border text-slate-400 text-center font-body">
        No ping data available
      </div>
    )
  }

  return (
    <div className="bg-base-surface rounded-xl p-4 border border-base-border">
      <h3 className="text-sm font-medium text-slate-400 mb-4 font-body">Ping Latency History</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C2936" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit=" ms" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1A181F', border: '1px solid #2C2936' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
