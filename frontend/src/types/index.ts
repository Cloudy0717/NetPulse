export interface SystemData {
  cpu_percent: number;
  ram_percent: number;
  disk_percent: number;
}

export interface TrafficData {
  upload_mbps: number;
  download_mbps: number;
  packets_sent: number;
  packets_recv: number;
}

export interface PingData {
  host: string;
  latency_ms: number | null;
  status: "online" | "timeout" | "error";
}

export interface Alert {
  type: string;
  message: string;
  severity: "warning" | "error";
}

export interface LiveUpdate {
  type: string;
  data: {
    system: SystemData;
    traffic: TrafficData;
    ping: PingData;
    alerts: Alert[];
  };
  timestamp: number;
}

export interface Settings {
  refresh_rate: number;
  theme: "dark" | "light";
  ping_target: string;
  notifications_enabled: boolean;
}

export interface SpeedTestRecord {
  id: number
  download_mbps: number
  upload_mbps: number
  latency_ms: number | null
  server: string | null
  created_at: string
}

export interface PingRecord {
  id: number
  host: string
  latency_ms: number | null
  status: string
  created_at: string
}
