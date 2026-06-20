import { useState } from "react";
import { useAdminChangePassword } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export default function AdminSecurity() {
  const [, setLocation] = useLocation();
  const changePwMutation = useAdminChangePassword();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmNew: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.newPassword !== form.confirmNew) {
      setError("New passwords do not match.");
      return;
    }
    try {
      await changePwMutation.mutateAsync({
        data: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmNew: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Password change failed. Check your current password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vortex_admin_token");
    setLocation("/admin/login");
  };

  return (
    <div className="max-w-md space-y-6">
      <div className="bg-card border border-border rounded-sm">
        <div className="px-6 py-4 border-b border-border text-xs text-muted-foreground tracking-widest uppercase">CHANGE PASSWORD</div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          {[
            { key: "currentPassword", label: "CURRENT PASSWORD" },
            { key: "newPassword", label: "NEW PASSWORD" },
            { key: "confirmNew", label: "CONFIRM NEW PASSWORD" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground tracking-widest block mb-1">{f.label}</label>
              <input
                type="password"
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-background border border-input text-foreground px-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
              />
            </div>
          ))}

          {error && (
            <div className="border border-accent/40 bg-accent/5 text-accent px-4 py-2 rounded-sm text-sm">{error}</div>
          )}
          {success && (
            <div className="border border-primary/40 bg-primary/5 text-primary px-4 py-2 rounded-sm text-sm">
              PASSWORD CHANGED SUCCESSFULLY
            </div>
          )}

          <button
            type="submit"
            disabled={changePwMutation.isPending}
            className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 text-sm"
          >
            {changePwMutation.isPending ? "UPDATING..." : "CHANGE PASSWORD"}
          </button>
        </form>
      </div>

      <div className="bg-card border border-accent/20 rounded-sm">
        <div className="px-6 py-4 border-b border-accent/20 text-xs text-muted-foreground tracking-widest uppercase">SESSION</div>
        <div className="p-6">
          <p className="text-muted-foreground text-sm mb-4">Logging out will clear your admin token and return you to the login page.</p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 border border-accent/40 text-accent hover:bg-accent/10 font-bold tracking-widest rounded-sm text-sm transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
