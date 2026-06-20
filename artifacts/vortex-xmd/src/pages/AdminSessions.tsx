import { useAdminListSessions, useDeleteSession, useReconnectSession, useAdminRestartSessions } from "@workspace/api-client-react";

const STATUS_STYLES: Record<string, string> = {
  connected: "text-green-400",
  connecting: "text-yellow-400",
  pairing: "text-primary",
  disconnected: "text-muted-foreground",
};

export default function AdminSessions() {
  const { data: sessions, refetch } = useAdminListSessions();
  const deleteMutation = useDeleteSession();
  const reconnectMutation = useReconnectSession();
  const restartMutation = useAdminRestartSessions();

  const handleDelete = async (sessionId: string) => {
    if (!confirm(`Delete session ${sessionId}?`)) return;
    await deleteMutation.mutateAsync({ sessionId });
    refetch();
  };

  const handleReconnect = async (sessionId: string) => {
    await reconnectMutation.mutateAsync({ sessionId });
    setTimeout(() => refetch(), 1500);
  };

  const handleRestartAll = async () => {
    if (!confirm("Restart all sessions?")) return;
    await restartMutation.mutateAsync();
    setTimeout(() => refetch(), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground tracking-widest">
          <span className="text-primary">{sessions?.length ?? 0}</span> sessions
        </div>
        <button
          onClick={handleRestartAll}
          disabled={restartMutation.isPending}
          className="text-xs border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 px-4 py-2 rounded-sm tracking-widest disabled:opacity-50 transition-colors"
        >
          RESTART ALL
        </button>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs tracking-widest uppercase">
              <th className="text-left px-4 py-3">Session ID</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Connected</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions?.map((s, i) => (
              <tr key={s.sessionId} className={`border-b border-border/40 hover:bg-primary/5 ${i % 2 === 0 ? "" : "bg-background/30"}`}>
                <td className="px-4 py-3 text-primary text-glow text-xs">{s.sessionId}</td>
                <td className="px-4 py-3 text-foreground text-xs">{s.phoneNumber ?? "—"}</td>
                <td className={`px-4 py-3 text-xs font-bold ${STATUS_STYLES[s.status] ?? "text-muted-foreground"}`}>{s.status.toUpperCase()}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {s.connectedAt ? new Date(s.connectedAt as string).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleReconnect(s.sessionId)} className="text-xs border border-primary/40 text-primary hover:bg-primary/10 px-2 py-1 rounded-sm">RECONNECT</button>
                    <button onClick={() => handleDelete(s.sessionId)} className="text-xs border border-accent/40 text-accent hover:bg-accent/10 px-2 py-1 rounded-sm">DELETE</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!sessions || sessions.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">No sessions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
