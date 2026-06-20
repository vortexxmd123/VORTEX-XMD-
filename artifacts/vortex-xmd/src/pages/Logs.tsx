import { useState, useRef, useEffect } from "react";
import { useGetLogs } from "@workspace/api-client-react";

const LEVELS = ["all", "info", "warn", "error", "debug"] as const;

const LOG_COLORS: Record<string, string> = {
  info: "text-primary",
  warn: "text-yellow-400",
  error: "text-accent",
  debug: "text-muted-foreground",
};

const LEVEL_BG: Record<string, string> = {
  info: "bg-primary/10 border-primary/30",
  warn: "bg-yellow-400/10 border-yellow-400/30",
  error: "bg-accent/10 border-accent/30",
  debug: "bg-muted/20 border-border",
};

export default function Logs() {
  const [level, setLevel] = useState<"info" | "warn" | "error" | "debug" | undefined>(undefined);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: logs } = useGetLogs(
    { limit: 200, ...(level ? { level } : {}) },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { refetchInterval: 3000 } as any }
  );

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l === "all" ? undefined : l as "info" | "warn" | "error" | "debug")}
              className={`text-xs px-3 py-1 rounded-sm border tracking-widest transition-colors ${
                (l === "all" && !level) || l === level
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="accent-primary"
          />
          AUTO-SCROLL
        </label>
      </div>

      <div className="flex-1 bg-card border border-border rounded-sm overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-border flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary pulse-glow block"></span>
          <span className="text-xs text-muted-foreground tracking-widest">{logs?.length ?? 0} ENTRIES</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
          {!logs || logs.length === 0 ? (
            <div className="text-muted-foreground">// No logs. System idle.</div>
          ) : (
            [...logs].reverse().map((log, i) => (
              <div key={i} className={`flex gap-3 border-l-2 pl-3 py-0.5 ${LEVEL_BG[log.level] ?? ""} border`}>
                <span className="text-muted-foreground shrink-0 w-20">{new Date(log.timestamp as string).toLocaleTimeString()}</span>
                <span className={`shrink-0 w-12 font-bold ${LOG_COLORS[log.level] ?? "text-foreground"}`}>[{log.level.toUpperCase().slice(0, 5)}]</span>
                {log.sessionId && <span className="text-muted-foreground shrink-0">{log.sessionId}</span>}
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
