import { useHealthCheck, useGetStats, useListSessions } from "@workspace/api-client-react";

export default function Status() {
  const { data: health } = useHealthCheck();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stats } = useGetStats({ query: { refetchInterval: 10000 } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sessions } = useListSessions({ query: { refetchInterval: 5000 } as any });

  const uptimeSecs = Math.floor(stats?.uptime ?? 0);
  const h = Math.floor(uptimeSecs / 3600);
  const m = Math.floor((uptimeSecs % 3600) / 60);
  const s = uptimeSecs % 60;

  const connected = sessions?.filter((s) => s.status === "connected").length ?? 0;
  const disconnected = sessions?.filter((s) => s.status === "disconnected").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Health indicator */}
      <div className={`bg-card border rounded-sm p-6 glow-border flex items-center gap-4 ${health?.status === "ok" ? "border-primary/40" : "border-accent/40"}`}>
        <span className={`w-4 h-4 rounded-full pulse-glow ${health?.status === "ok" ? "bg-primary" : "bg-accent"}`} />
        <div>
          <div className={`text-2xl font-bold tracking-widest ${health?.status === "ok" ? "text-primary text-glow" : "text-accent"}`}>
            {health?.status === "ok" ? "SYSTEM ONLINE" : "SYSTEM ERROR"}
          </div>
          <div className="text-muted-foreground text-sm">API health check: {health?.status ?? "checking..."}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "UPTIME", value: `${h}h ${m}m ${s}s` },
          { label: "ACTIVE SESSIONS", value: stats?.activeSessions ?? 0 },
          { label: "TOTAL SESSIONS", value: stats?.totalSessions ?? 0 },
          { label: "COMMANDS LOADED", value: stats?.commandsLoaded ?? 0 },
          { label: "PAIR SUCCESS RATE", value: `${stats?.pairingSuccessRate ?? 0}%` },
          { label: "TOTAL LOGS", value: stats?.totalLogs ?? 0 },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-sm p-4">
            <div className="text-xs text-muted-foreground tracking-widest mb-1">{item.label}</div>
            <div className="text-2xl font-bold text-primary">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Session status breakdown */}
      {sessions && sessions.length > 0 && (
        <div className="bg-card border border-border rounded-sm">
          <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground tracking-widest uppercase">SESSION STATUS</div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {sessions.map((session) => (
              <div key={session.sessionId} className={`border rounded-sm p-3 text-xs space-y-1 ${
                session.status === "connected" ? "border-green-400/40 bg-green-400/5" :
                session.status === "connecting" ? "border-yellow-400/40 bg-yellow-400/5" :
                session.status === "pairing" ? "border-primary/40 bg-primary/5" :
                "border-border"
              }`}>
                <div className="text-primary font-bold truncate">{session.sessionId}</div>
                <div className="text-muted-foreground">{session.phoneNumber ?? "No phone"}</div>
                <div className={`${
                  session.status === "connected" ? "text-green-400" :
                  session.status === "connecting" ? "text-yellow-400" :
                  session.status === "pairing" ? "text-primary" :
                  "text-muted-foreground"
                } uppercase`}>{session.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
