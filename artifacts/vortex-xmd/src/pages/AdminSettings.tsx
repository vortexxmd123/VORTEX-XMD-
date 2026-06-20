import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSettings, useUpdateApiKeys } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const { data: settings, isError } = useGetSettings();
  const updateMutation = useUpdateSettings();
  const apiKeysMutation = useUpdateApiKeys();

  const [form, setForm] = useState<Record<string, string>>({});
  const [apiKeys, setApiKeys] = useState({ openai_api_key: "", weather_api_key: "" });
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { if (isError) setLocation("/admin/login"); }, [isError, setLocation]);
  useEffect(() => { if (settings) setForm(settings as Record<string, string>); }, [settings]);

  const FIELDS = [
    { key: "bot_name", label: "BOT NAME" },
    { key: "owner_name", label: "OWNER NAME" },
    { key: "developer_name", label: "DEVELOPER NAME" },
    { key: "owner_contact", label: "OWNER CONTACT" },
    { key: "owner_number", label: "OWNER NUMBER" },
    { key: "prefix", label: "BOT PREFIX" },
    { key: "menu_footer", label: "MENU FOOTER" },
    { key: "welcome_message", label: "WELCOME MESSAGE" },
    { key: "goodbye_message", label: "GOODBYE MESSAGE" },
  ];

  const handleSave = async () => {
    await updateMutation.mutateAsync({ data: form as Parameters<typeof updateMutation.mutateAsync>[0]["data"] });
    setSaved("settings");
    setTimeout(() => setSaved(null), 3000);
  };

  const handleSaveKeys = async () => {
    await apiKeysMutation.mutateAsync({ data: apiKeys });
    setSaved("keys");
    setTimeout(() => setSaved(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-card border border-border rounded-sm">
        <div className="px-6 py-4 border-b border-border text-xs text-muted-foreground tracking-widest uppercase">BOT SETTINGS</div>
        <div className="p-6 space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground tracking-widest block mb-1">{f.label}</label>
              <input
                type="text"
                value={form[f.key] ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-background border border-input text-foreground px-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 text-sm"
          >
            {updateMutation.isPending ? "SAVING..." : saved === "settings" ? "SAVED!" : "SAVE SETTINGS"}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm">
        <div className="px-6 py-4 border-b border-border text-xs text-muted-foreground tracking-widest uppercase">API KEYS (SENSITIVE)</div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-widest block mb-1">OPENAI API KEY</label>
            <input
              type="password"
              value={apiKeys.openai_api_key}
              onChange={(e) => setApiKeys((p) => ({ ...p, openai_api_key: e.target.value }))}
              placeholder="sk-..."
              className="w-full bg-background border border-input text-foreground px-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground tracking-widest block mb-1">WEATHER API KEY</label>
            <input
              type="password"
              value={apiKeys.weather_api_key}
              onChange={(e) => setApiKeys((p) => ({ ...p, weather_api_key: e.target.value }))}
              placeholder="OpenWeatherMap key"
              className="w-full bg-background border border-input text-foreground px-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
            />
          </div>
          <button
            onClick={handleSaveKeys}
            disabled={apiKeysMutation.isPending}
            className="px-6 py-2 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 text-sm"
          >
            {apiKeysMutation.isPending ? "SAVING..." : saved === "keys" ? "SAVED!" : "SAVE API KEYS"}
          </button>
        </div>
      </div>
    </div>
  );
}
