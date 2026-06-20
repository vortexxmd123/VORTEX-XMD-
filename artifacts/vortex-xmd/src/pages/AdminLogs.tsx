import { useState, useRef, useEffect } from "react";
import { useAdminGetLogs, useClearLogs } from "@workspace/api-client-react";

const LEVELS = ["all", "info", "warn", "error", "debug"] as const;
const LOG_COLORS: Record<string, string> = {
  info: "text-primary",
  warn: "text-yellow-400",
  error: "text-accent",
  debug: "text-muted-foreground",
};

export default function AdminLogs() {
  const [level, setLevel] = useState<"info" | "warn" | "error" | "debug" | undefined>(undefined);
  const [autoScroll, setAutoScroll] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const clearMutation = useClearLogs();

  const { data: logs, refetch } = useAdminGetLogs(
    { limit: 500, ...(level ? { level } : {}) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { refetchInterval: 5000 } as any }
  );

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const handleClear = async () => {
    if (!confirm("Clear ALL logs? This cannot be undone.")) return;
    await clearMutation.mutateAsync();
    refetch();
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l === "all" ? undefined : l as "info" | "warn" | "error" | "debug")}
              className={`text-xs px-3 py-1 rounded-sm border tracking-widest transition-colors ${
                (l === "all" && !level) || l === level
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="accent-primary" />
            AUTO-SCROLL
          </label>
          <button
            onClick={handleClear}
            disabled={clearMutation.isPending}
            className="text-xs border border-accent/40 text-accent hover:bg-accent/10 px-4 py-1 rounded-sm tracking-widest disabled:opacity-50"
          >
            CLEAR ALL LOGS
          </button>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-sm overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-border flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary pulse-glow block" />
          <span className="text-xs text-muted-foreground tracking-widest">{logs?.length ?? 0} ENTRIES</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1" style={{ maxHeight: "60vh" }}>
          {!logs || logs.length === 0 ? (
            <div className="text-muted-foreground">// No logs.</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-3 py-0.5 border-b border-border/20">
                <span className="text-muted-foreground shrink-0 w-24">{new Date(log.timestamp as string).toLocaleTimeString()}</span>
                <span className={`shrink-0 w-14 font-bold ${LOG_COLORS[log.level] ?? "text-foreground"}`}>[{log.level.toUpperCase()}]</span>
                {log.sessionId && <span className="text-muted-foreground shrink-0 w-24 truncate">{log.sessionId}</span>}
                <span className="text-foreground/80">{log.message}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
