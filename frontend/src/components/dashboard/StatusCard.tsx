import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  unit?: string;
  color: string;
  subtitle?: string;
}

const COLOR_MAP: Record<string, { bar: string; text: string }> = {
  "text-green-400": { bar: "bg-green-400", text: "text-green-400" },
  "text-purple-400": { bar: "bg-purple-400", text: "text-purple-400" },
  "text-cyan-400": { bar: "bg-cyan-400", text: "text-cyan-400" },
};

export default function StatusCard({
  icon: Icon,
  title,
  value,
  unit = "%",
  color,
  subtitle,
}: StatusCardProps) {
  const mapped = COLOR_MAP[color] ?? { bar: "bg-blue-400", text: "text-blue-400" };
  const barColor = value > 90 ? "bg-red-500" : value > 70 ? "bg-yellow-500" : mapped.bar;
  const textColor = value > 90 ? "text-red-500" : value > 70 ? "text-yellow-500" : mapped.text;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${textColor}`} />
          <span className="text-slate-500 dark:text-slate-400 font-medium">{title}</span>
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${textColor}`}>
            {unit === "%" ? Math.round(value) : value}
            {unit}
          </span>
          {subtitle && (
            <span className="text-xs text-slate-500 block">{subtitle}</span>
          )}
        </div>
      </div>
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
