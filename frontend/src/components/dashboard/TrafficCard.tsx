import { ArrowUp, ArrowDown } from "lucide-react";
import { TrafficData } from "@/types";

interface TrafficCardProps {
  traffic: TrafficData | null;
}

export default function TrafficCard({ traffic }: TrafficCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Network Traffic</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Upload */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-500">Upload</span>
          </div>
          <span className="text-lg font-bold text-green-400">
            {traffic?.upload_mbps.toFixed(2) || "0.00"} MB/s
          </span>
        </div>

        {/* Download */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowDown className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-500">Download</span>
          </div>
          <span className="text-lg font-bold text-blue-400">
            {traffic?.download_mbps.toFixed(2) || "0.00"} MB/s
          </span>
        </div>
      </div>

      {/* Packets info */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            Packets Sent: {traffic?.packets_sent.toLocaleString() || "0"}
          </span>
          <span>
            Packets Recv: {traffic?.packets_recv.toLocaleString() || "0"}
          </span>
        </div>
      </div>
    </div>
  );
}
