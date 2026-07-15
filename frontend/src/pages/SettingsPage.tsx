import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Save, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (updates: typeof localSettings) => {
    setLocalSettings(updates);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(localSettings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults = {
      refresh_rate: 1,
      theme: "dark" as const,
      ping_target: "google.com",
      notifications_enabled: true,
    };
    setLocalSettings(defaults);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Refresh Rate */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <label className="block text-slate-500 dark:text-slate-400 font-medium mb-2">
          Refresh Rate
        </label>
        <p className="text-sm text-slate-500 mb-3">
          How often to fetch real-time data
        </p>
        <div className="flex gap-2">
          {[1, 2, 5].map((rate) => (
            <button
              key={rate}
              onClick={() =>
                handleChange({ ...localSettings, refresh_rate: rate })
              }
              className={`px-4 py-2 rounded-lg transition-colors ${
                localSettings.refresh_rate === rate
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {rate}s
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <label className="block text-slate-500 dark:text-slate-400 font-medium mb-2">Theme</label>
        <p className="text-sm text-slate-500 mb-3">
          Choose your preferred theme
        </p>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => handleChange({ ...localSettings, theme })}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                localSettings.theme === theme
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Ping Target */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <label className="block text-slate-500 dark:text-slate-400 font-medium mb-2">
          Default Ping Target
        </label>
        <p className="text-sm text-slate-500 mb-3">Host to ping by default</p>
        <div className="flex gap-2">
          {["google.com", "cloudflare.com", "1.1.1.1"].map((host) => (
            <button
              key={host}
              onClick={() =>
                handleChange({ ...localSettings, ping_target: host })
              }
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                localSettings.ping_target === host
                  ? "bg-blue-500 text-white"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {host}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <label className="block text-slate-500 dark:text-slate-400 font-medium mb-2">
          Notifications
        </label>
        <p className="text-sm text-slate-500 mb-3">
          Enable or disable alert notifications
        </p>
        <button
          onClick={() =>
            handleChange({
              ...localSettings,
              notifications_enabled: !localSettings.notifications_enabled,
            })
          }
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localSettings.notifications_enabled ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              localSettings.notifications_enabled
                ? "translate-x-7"
                : "translate-x-1"
            }`}
          />
        </button>
        <span className="ml-3 text-sm text-slate-500 dark:text-slate-400">
          {localSettings.notifications_enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
