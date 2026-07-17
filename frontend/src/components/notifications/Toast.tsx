import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, XCircle, X } from "lucide-react";
import { Alert } from "@/types";

interface Toast extends Alert {
  id: number;
}

let toastId = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((alert: Alert) => {
    toastId++;
    setToasts((prev) => [...prev, { ...alert, id: toastId }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => setToasts([]), []);

  return { toasts, addToast, removeToast, clearAll };
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export default function ToastContainer({
  toasts,
  onRemove,
}: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
  };

  const bgColors = {
    warning: "border-yellow-500/50 bg-yellow-500/10",
    error: "border-red-500/50 bg-red-500/10",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border bg-base-surface animate-in slide-in-from-right ${bgColors[toast.severity]}`}
    >
      {icons[toast.severity]}
      <div className="flex-1">
        <p className="font-medium text-sm font-body">{toast.type}</p>
        <p className="text-sm text-slate-400">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
