import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMultiSeriesData } from "@/hooks/useChartData";
import { useTheme } from "@/contexts/ThemeContext";

interface TrafficChartProps {
  upload: number;
  download: number;
}

export default function TrafficChart({ upload, download }: TrafficChartProps) {
  const { history, addPoint } = useMultiSeriesData(30);
  const { theme } = useTheme();

  const lastPoint = history[history.length - 1];
  if (!lastPoint || lastPoint.upload !== upload || lastPoint.download !== download) {
    addPoint({ upload, download });
  }

  const isDark = theme === "dark";

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-4">Network Traffic History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
            <XAxis dataKey="time" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} />
            <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                borderRadius: "8px",
                color: isDark ? "#e2e8f0" : "#1e293b",
              }}
              labelStyle={{ color: isDark ? "#94a3b8" : "#64748b" }}
            />
            <Legend />
            <Line type="monotone" dataKey="upload" stroke="#22c55e" strokeWidth={2} dot={false} name="Upload MB/s" />
            <Line type="monotone" dataKey="download" stroke="#3b82f6" strokeWidth={2} dot={false} name="Download MB/s" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
