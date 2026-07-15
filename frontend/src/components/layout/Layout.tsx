import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastContainer, { useToasts } from "@/components/notifications/Toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Alert } from "@/types";

export default function Layout() {
  const { data } = useWebSocket();
  const { toasts, addToast, removeToast } = useToasts();
  const prevAlertsRef = useRef<string>("");

  useEffect(() => {
    if (data?.data?.alerts) {
      const alertsKey = JSON.stringify(data.data.alerts);
      if (alertsKey !== prevAlertsRef.current && data.data.alerts.length > 0) {
        data.data.alerts.forEach((alert: Alert) => {
          addToast(alert);
        });
      }
      prevAlertsRef.current = alertsKey;
    }
  }, [data, addToast]);

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
