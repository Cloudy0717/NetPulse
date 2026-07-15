import { Cpu, HardDrive, MemoryStick } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import StatusCard from "@/components/dashboard/StatusCard";
import TrafficCard from "@/components/dashboard/TrafficCard";
import PingCard from "@/components/dashboard/PingCard";
import CpuChart from "@/components/charts/CpuChart";
import TrafficChart from "@/components/charts/TrafficChart";
import PingChart from "@/components/charts/PingChart";

export default function DashboardPage() {
  const { data } = useWebSocket();

  const cpuPercent = data?.data?.system?.cpu_percent ?? 0;
  const ramPercent = data?.data?.system?.ram_percent ?? 0;
  const diskPercent = data?.data?.system?.disk_percent ?? 0;
  const upload = data?.data?.traffic?.upload_mbps ?? 0;
  const download = data?.data?.traffic?.download_mbps ?? 0;
  const latency = data?.data?.ping?.latency_ms ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Real-time Dashboard</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          icon={Cpu}
          title="CPU Usage"
          value={cpuPercent}
          color="text-green-400"
        />
        <StatusCard
          icon={MemoryStick}
          title="RAM Usage"
          value={ramPercent}
          color="text-purple-400"
        />
        <StatusCard
          icon={HardDrive}
          title="Disk Usage"
          value={diskPercent}
          color="text-cyan-400"
        />
      </div>

      {/* Network & Ping Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrafficCard traffic={data?.data?.traffic ?? null} />
        <PingCard ping={data?.data?.ping ?? null} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CpuChart value={cpuPercent} />
        <TrafficChart upload={upload} download={download} />
      </div>
      <div className="grid grid-cols-1">
        <PingChart latency={latency} />
      </div>
    </div>
  );
}
