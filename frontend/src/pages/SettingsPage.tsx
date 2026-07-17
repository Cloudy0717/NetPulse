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
      <h1 className="font-display text-2xl text-text-primary">Settings</h1>

      <div className="bg-base-surface p-5 rounded-xl border border-base-border">
        <label className="block text-slate-400 font-medium mb-2 font-body">Refresh Rate</label>
        <p className="text-sm text-slate-500 mb-3 font-body">How often to fetch real-time data</p>
        <div className="flex gap-2">
          {[1, 2, 5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleChange({ ...localSettings, refresh_rate: rate })}
              className={`px-4 py-2 rounded-lg transition-colors font-body ${
                localSettings.refresh_rate === rate
                  ? "bg-accent text-black"
                  : "bg-base-border text-slate-400 hover:bg-base-border/80"
              }`}
            >
              {rate}s
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-surface p-5 rounded-xl border border-base-border">
        <label className="block text-slate-400 font-medium mb-2 font-body">Theme</label>
        <p className="text-sm text-slate-500 mb-3 font-body">Choose your preferred theme</p>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => handleChange({ ...localSettings, theme })}
              className={`px-4 py-2 rounded-lg capitalize transition-colors font-body ${
                localSettings.theme === theme
                  ? "bg-accent text-black"
                  : "bg-base-border text-slate-400 hover:bg-base-border/80"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-surface p-5 rounded-xl border border-base-border">
        <label className="block text-slate-400 font-medium mb-2 font-body">Default Ping Target</label>
        <p className="text-sm text-slate-500 mb-3 font-body">Host to ping by default</p>
        <div className="flex gap-2">
          {["google.com", "cloudflare.com", "1.1.1.1"].map((host) => (
            <button
              key={host}
              onClick={() => handleChange({ ...localSettings, ping_target: host })}
              className={`px-4 py-2 rounded-lg text-sm transition-colors font-body ${
                localSettings.ping_target === host
                  ? "bg-accent text-black"
                  : "bg-base-border text-slate-400 hover:bg-base-border/80"
              }`}
            >
              {host}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-base-surface p-5 rounded-xl border border-base-border">
        <label className="block text-slate-400 font-medium mb-2 font-body">Notifications</label>
        <p className="text-sm text-slate-500 mb-3 font-body">Enable or disable alert notifications</p>
        <button
          onClick={() =>
            handleChange({
              ...localSettings,
              notifications_enabled: !localSettings.notifications_enabled,
            })
          }
          className={`relative w-12 h-6 rounded-full transition-colors ${
            localSettings.notifications_enabled ? "bg-accent" : "bg-base-border"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-transform ${
              localSettings.notifications_enabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
        <span className="ml-3 text-sm text-slate-400 font-body">
          {localSettings.notifications_enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent/90 text-black rounded-lg transition-colors disabled:opacity-50 font-body"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2 bg-base-border hover:bg-base-border/80 text-slate-300 rounded-lg transition-colors font-body"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
