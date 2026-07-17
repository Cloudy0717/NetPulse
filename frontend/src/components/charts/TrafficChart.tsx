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
    <div className="bg-base-surface p-5 rounded-xl border border-base-border">
      <h3 className="text-slate-400 font-medium font-body mb-4">Network Traffic History</h3>
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
            <Legend />
            <Line type="monotone" dataKey="upload" stroke="#22c55e" strokeWidth={2} dot={false} name="Upload MB/s" />
            <Line type="monotone" dataKey="download" stroke="#F59E0B" strokeWidth={2} dot={false} name="Download MB/s" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
