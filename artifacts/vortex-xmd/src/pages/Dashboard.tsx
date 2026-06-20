import { useGetStats, useGetLogs } from "@workspace/api-client-react";
import { Link } from "wouter";

const LOG_COLORS: Record<string, string> = {
  info: "text-primary",
  warn: "text-yellow-400",
  error: "text-accent",
  debug: "text-muted-foreground",
};

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stats } = useGetStats({ query: { refetchInterval: 10000 } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: logs } = useGetLogs({ limit: 10 }, { query: { refetchInterval: 5000 } as any });

  const uptimeSecs = Math.floor(stats?.uptime ?? 0);
  const h = Math.floor(uptimeSecs / 3600);
  const m = Math.floor((uptimeSecs % 3600) / 60);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "ACTIVE SESSIONS", value: stats?.activeSessions ?? 0, glow: true },
          { label: "TOTAL SESSIONS", value: stats?.totalSessions ?? 0 },
          { label: "PAIR SUCCESS %", value: `${stats?.pairingSuccessRate ?? 0}%` },
          { label: "BOT UPTIME", value: `${h}h ${m}m` },
        ].map((s) => (
          <div key={s.label} className={`bg-card border border-border p-4 rounded-sm ${s.glow ? "glow-border" : ""}`}>
            <div className="text-xs text-muted-foreground tracking-widest mb-1">{s.label}</div>
            <div className={`text-3xl font-bold ${s.glow ? "text-primary text-glow" : "text-foreground"}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ASCII identity box */}
        <div className="bg-card border border-primary/30 rounded-sm p-6 glow-border">
          <pre className="text-primary text-sm leading-relaxed text-glow">{`╭━━〔 VORTEX XMD 〕━━⬣
┃ Owner     : LORD RAY
┃ Developer : GHOST
┃ Prefix    : .
┃ Commands  : ${stats?.commandsLoaded ?? 0} loaded
┃ Status    : ONLINE
╰━━━━━━━━━━━━⬣`}</pre>
        </div>

        {/* Quick actions */}
        <div className="bg-card border border-border rounded-sm p-6 space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">QUICK ACTIONS</h2>
          <Link href="/pair">
            <button className="w-full text-left px-4 py-3 border border-primary/40 text-primary hover:bg-primary/10 rounded-sm transition-colors text-sm tracking-wider">
              ⟡ PAIR NEW DEVICE
            </button>
          </Link>
          <Link href="/sessions">
            <button className="w-full text-left px-4 py-3 border border-border hover:border-primary/40 text-foreground hover:text-primary rounded-sm transition-colors text-sm tracking-wider">
              ⟡ VIEW SESSIONS
            </button>
          </Link>
          <Link href="/admin/login">
            <button className="w-full text-left px-4 py-3 border border-border hover:border-primary/40 text-foreground hover:text-primary rounded-sm transition-colors text-sm tracking-wider">
              ⟡ ADMIN PANEL
            </button>
          </Link>
          <Link href="/logs">
            <button className="w-full text-left px-4 py-3 border border-border hover:border-primary/40 text-foreground hover:text-primary rounded-sm transition-colors text-sm tracking-wider">
              ⟡ LIVE LOGS
            </button>
          </Link>
        </div>
      </div>

      {/* Live log tail */}
      <div className="bg-card border border-border rounded-sm">
        <div className="px-4 py-2 border-b border-border flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary pulse-glow block"></span>
          <span className="text-xs text-muted-foreground tracking-widest uppercase">LIVE LOG FEED</span>
        </div>
        <div className="p-4 font-mono text-xs space-y-1 min-h-[160px]">
          {!logs || logs.length === 0 ? (
            <div className="text-muted-foreground">// No logs yet. Activity will appear here.</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-muted-foreground shrink-0">{new Date(log.timestamp as string).toLocaleTimeString()}</span>
                <span className={`shrink-0 w-10 ${LOG_COLORS[log.level] ?? "text-foreground"}`}>[{log.level.toUpperCase().slice(0, 4)}]</span>
                <span className="text-foreground/80 truncate">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
