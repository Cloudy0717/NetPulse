import { useState, useEffect, useRef } from "react";
import { LiveUpdate } from "@/types";

export function useWebSocket(host?: string) {
  const [data, setData] = useState<LiveUpdate | null>(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = host
      ? `${import.meta.env.VITE_WS_URL}/ws/live?host=${host}`
      : `${import.meta.env.VITE_WS_URL}/ws/live`;

    const connect = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => setConnected(true);
      ws.current.onclose = () => {
        setConnected(false);
        setTimeout(connect, 3000);
      };
      ws.current.onmessage = (event) => {
        const json = JSON.parse(event.data);
        setData(json);
      };
    };

    connect();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [host]);

  return { data, connected };
}
