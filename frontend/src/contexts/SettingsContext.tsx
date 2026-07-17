import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Settings } from "@/types";
import { API_URL } from "@/services/api";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {
    refresh_rate: 1,
    theme: "dark",
    ping_target: "google.com",
    notifications_enabled: true,
  },
  updateSettings: async () => {},
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    refresh_rate: 1,
    theme: "dark",
    ping_target: "google.com",
    notifications_enabled: true,
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const data = await res.json();
      setSettings(data);
    } catch {
      // keep defaults
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    const res = await fetch(`${API_URL}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    setSettings(data);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
