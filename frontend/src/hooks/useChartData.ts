import { useState, useCallback } from "react";

export interface ChartPoint {
  time: string;
  value: number;
}

export interface MultiSeriesPoint {
  time: string;
  [key: string]: number | string;
}

export function useChartData(maxPoints = 30) {
  const [history, setHistory] = useState<ChartPoint[]>([]);

  const addPoint = useCallback(
    (value: number) => {
      setHistory((prev) => {
        const newPoint: ChartPoint = {
          time: new Date().toLocaleTimeString(),
          value,
        };
        return [...prev, newPoint].slice(-maxPoints);
      });
    },
    [maxPoints],
  );

  const clear = useCallback(() => setHistory([]), []);

  return { history, addPoint, clear };
}

export function useMultiSeriesData(maxPoints = 30) {
  const [history, setHistory] = useState<MultiSeriesPoint[]>([]);

  const addPoint = useCallback(
    (values: Record<string, number>) => {
      setHistory((prev) => {
        const newPoint: MultiSeriesPoint = {
          time: new Date().toLocaleTimeString(),
          ...values,
        };
        return [...prev, newPoint].slice(-maxPoints);
      });
    },
    [maxPoints],
  );

  const clear = useCallback(() => setHistory([]), []);

  return { history, addPoint, clear };
}
