import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartData } from "@/hooks/useChartData";
import { useTheme } from "@/contexts/ThemeContext";

interface PingChartProps {
  latency: number | null;
}

export default function PingChart({ latency }: PingChartProps) {
  const { history, addPoint } = useChartData(30);
  const { theme } = useTheme();

  if (latency !== null && (history.length === 0 || history[history.length - 1].value !== latency)) {
    addPoint(latency);
  }

  const isDark = theme === "dark";

  return (
    <div className="bg-base-surface p-5 rounded-xl border border-base-border">
      <h3 className="text-slate-400 font-medium font-body mb-4">Ping Latency History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2C2936" : "#e2e8f0"} />
            <XAxis dataKey="time" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} />
            <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1A181F" : "#ffffff",
                border: `1px solid ${isDark ? "#2C2936" : "#e2e8f0"}`,
                borderRadius: "8px",
                color: isDark ? "#E4E0EC" : "#1e293b",
              }}
              labelStyle={{ color: isDark ? "#94a3b8" : "#64748b" }}
            />
            <Line type="monotone" dataKey="value" stroke="#A78BFA" strokeWidth={2} dot={false} name="Latency ms" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
