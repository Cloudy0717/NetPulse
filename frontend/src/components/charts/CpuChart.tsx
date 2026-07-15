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

interface CpuChartProps {
  value: number;
}

export default function CpuChart({ value }: CpuChartProps) {
  const { history, addPoint } = useChartData(30);
  const { theme } = useTheme();

  if (history.length === 0 || history[history.length - 1].value !== value) {
    addPoint(value);
  }

  const isDark = theme === "dark";

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-4">CPU Usage History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
            <XAxis dataKey="time" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} />
            <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                color: isDark ? "#e2e8f0" : "#1e293b",
              }}
              labelStyle={{ color: isDark ? "#94a3b8" : "#64748b" }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} name="CPU %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
