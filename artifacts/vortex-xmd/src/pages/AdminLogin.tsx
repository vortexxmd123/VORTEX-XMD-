import { useState } from "react";
import { useAdminLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const loginMutation = useAdminLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginMutation.mutateAsync({ data: { username, password } });
      localStorage.setItem("vortex_admin_token", res.token);
      setLocation("/admin");
    } catch {
      setError("ACCESS DENIED — Invalid credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-primary/30 rounded-sm p-8 glow-border">
        <div className="text-center mb-8">
          <pre className="text-primary text-sm text-glow leading-relaxed">{`╭━━〔 ADMIN TERMINAL 〕━━⬣
┃   VORTEX XMD CONTROL PANEL
┃   Authorized Personnel Only
╰━━━━━━━━━━━━⬣`}</pre>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-widest block mb-1">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-background border border-input text-foreground px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground tracking-widest block mb-1">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-background border border-input text-foreground px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
            />
          </div>

          {error && (
            <div className="border border-accent/40 bg-accent/5 text-accent px-4 py-3 rounded-sm text-sm tracking-wider">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 transition-colors"
          >
            {loginMutation.isPending ? "AUTHENTICATING..." : "AUTHENTICATE"}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-xs mt-6">VORTEX XMD Admin Panel</p>
      </div>
    </div>
  );
}
