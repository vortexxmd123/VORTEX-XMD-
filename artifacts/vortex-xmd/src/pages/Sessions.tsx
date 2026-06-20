import { useListSessions, useDeleteSession, useReconnectSession } from "@workspace/api-client-react";

const STATUS_STYLES: Record<string, string> = {
  connected: "text-green-400 border-green-400/40",
  connecting: "text-yellow-400 border-yellow-400/40",
  pairing: "text-primary border-primary/40",
  disconnected: "text-muted-foreground border-muted-foreground/30",
};

const STATUS_DOT: Record<string, string> = {
  connected: "bg-green-400 pulse-glow",
  connecting: "bg-yellow-400",
  pairing: "bg-primary pulse-glow",
  disconnected: "bg-muted-foreground",
};

export default function Sessions() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sessions, isLoading, refetch } = useListSessions({ query: { refetchInterval: 5000 } as any });
  const deleteMutation = useDeleteSession();
  const reconnectMutation = useReconnectSession();

  const handleDelete = async (sessionId: string) => {
    if (!confirm(`Delete session ${sessionId}?`)) return;
    await deleteMutation.mutateAsync({ sessionId });
    refetch();
  };

  const handleReconnect = async (sessionId: string) => {
    await reconnectMutation.mutateAsync({ sessionId });
    setTimeout(() => refetch(), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground tracking-widest uppercase">
          Sessions: <span className="text-primary">{sessions?.length ?? 0}</span>
        </div>
        <button
          onClick={() => refetch()}
          className="text-xs border border-border px-3 py-1 text-muted-foreground hover:text-primary hover:border-primary/40 rounded-sm transition-colors tracking-widest"
        >
          REFRESH
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground py-16 text-sm tracking-widest">LOADING SESSIONS...</div>
      )}

      {!isLoading && (!sessions || sessions.length === 0) && (
        <div className="bg-card border border-border rounded-sm p-16 text-center">
          <pre className="text-muted-foreground text-sm">{`╭━━〔 NO ACTIVE SESSIONS 〕━━⬣
┃
┃  No devices are currently paired.
┃  Go to PAIR DEVICE to get started.
┃
╰━━━━━━━━━━━━⬣`}</pre>
        </div>
      )}

      {sessions && sessions.length > 0 && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs tracking-widest uppercase">
                <th className="text-left px-4 py-3">Session ID</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Last Seen</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={s.sessionId} className={`border-b border-border/50 hover:bg-primary/5 transition-colors ${i % 2 === 0 ? "" : "bg-background/30"}`}>
                  <td className="px-4 py-3 text-primary text-glow">{s.sessionId}</td>
                  <td className="px-4 py-3 text-foreground">{s.phoneNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-2 text-xs border px-2 py-1 rounded-sm w-fit ${STATUS_STYLES[s.status] ?? STATUS_STYLES.disconnected}`}>
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s.status] ?? STATUS_DOT.disconnected}`} />
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {s.lastSeen ? new Date(s.lastSeen as string).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleReconnect(s.sessionId)}
                        disabled={reconnectMutation.isPending}
                        className="text-xs border border-primary/40 text-primary hover:bg-primary/10 px-3 py-1 rounded-sm transition-colors disabled:opacity-50"
                      >
                        RECONNECT
                      </button>
                      <button
                        onClick={() => handleDelete(s.sessionId)}
                        disabled={deleteMutation.isPending}
                        className="text-xs border border-accent/40 text-accent hover:bg-accent/10 px-3 py-1 rounded-sm transition-colors disabled:opacity-50"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
