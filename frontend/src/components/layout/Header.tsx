import { RefreshCw } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function Header() {
  const { connected } = useWebSocket();

  return (
    <header className="h-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Real-time Dashboard</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
