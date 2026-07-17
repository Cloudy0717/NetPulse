import { Wifi, WifiOff } from "lucide-react";
import { PingData } from "@/types";

interface PingCardProps {
  ping: PingData | null;
}

export default function PingCard({ ping }: PingCardProps) {
  const isOnline = ping?.status === "online";

  return (
    <div className="bg-base-surface p-5 rounded-xl border border-base-border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400 font-medium font-body text-sm">Ping</span>
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span
            className={`text-sm font-medium ${
              isOnline ? "text-green-400" : "text-red-400"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs text-slate-500">Host</span>
          <p className="font-mono text-sm text-slate-300">{ping?.host || "N/A"}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500">Latency</span>
          <p
            className={`text-2xl font-bold font-mono ${
              ping?.latency_ms && ping.latency_ms < 50
                ? "text-green-400"
                : ping?.latency_ms && ping.latency_ms < 100
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {ping?.latency_ms !== null ? `${ping?.latency_ms} ms` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
