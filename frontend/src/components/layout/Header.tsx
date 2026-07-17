import { RefreshCw } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import PulseRing from "../ui/PulseRing";

export default function Header() {
  const { connected } = useWebSocket();

  return (
    <header className="h-16 bg-base-surface border-b border-base-border px-6 flex items-center justify-between">
      <h2 className="font-body font-semibold text-lg">Real-time Dashboard</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <PulseRing connected={connected} />
          <span className="text-sm text-slate-400">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <button className="p-2 hover:bg-base-border rounded-lg transition-colors text-slate-400 hover:text-text-primary">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
