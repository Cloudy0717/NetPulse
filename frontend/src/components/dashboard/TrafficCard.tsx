import { ArrowUp, ArrowDown } from "lucide-react";
import { TrafficData } from "@/types";

interface TrafficCardProps {
  traffic: TrafficData | null;
}

export default function TrafficCard({ traffic }: TrafficCardProps) {
  return (
    <div className="bg-base-surface p-5 rounded-xl border border-base-border">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-400 font-medium font-body text-sm">Network Traffic</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-500">Upload</span>
          </div>
          <span className="text-lg font-bold font-mono text-green-400">
            {traffic?.upload_mbps.toFixed(2) || "0.00"} MB/s
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowDown className="w-4 h-4 text-accent" />
            <span className="text-xs text-slate-500">Download</span>
          </div>
          <span className="text-lg font-bold font-mono text-accent">
            {traffic?.download_mbps.toFixed(2) || "0.00"} MB/s
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-base-border">
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
