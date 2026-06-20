import { useState } from "react";
import { useAdminBroadcast, useAdminListSessions } from "@workspace/api-client-react";

export default function AdminBroadcast() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const broadcastMutation = useAdminBroadcast();
  const { data: sessions } = useAdminListSessions();

  const activeSessions = sessions?.filter((s) => s.status === "connected") ?? [];

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    await broadcastMutation.mutateAsync({ data: { message } });
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border border-border rounded-sm p-4 flex items-center gap-3">
        <span className="text-xs text-muted-foreground tracking-widest">ACTIVE TARGETS:</span>
        <span className="text-primary font-bold">{activeSessions.length}</span>
        <span className="text-muted-foreground text-xs">connected sessions</span>
      </div>

      <div className="bg-card border border-border rounded-sm">
        <div className="px-6 py-4 border-b border-border text-xs text-muted-foreground tracking-widest uppercase">BROADCAST MESSAGE</div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground tracking-widest block mb-1">MESSAGE</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Enter message to broadcast to all connected sessions..."
              className="w-full bg-background border border-input text-foreground px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono resize-none"
            />
          </div>

          {sent && (
            <div className="border border-primary/40 bg-primary/5 text-primary px-4 py-2 rounded-sm text-sm tracking-wider">
              BROADCAST TRANSMITTED SUCCESSFULLY
            </div>
          )}

          <button
            onClick={handleBroadcast}
            disabled={broadcastMutation.isPending || !message.trim()}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 transition-colors"
          >
            {broadcastMutation.isPending ? "TRANSMITTING..." : "TRANSMIT"}
          </button>
        </div>
      </div>

      <div className="text-muted-foreground text-xs border border-border/30 p-3 rounded-sm">
        Note: Broadcast logs the message to the system. Full WhatsApp delivery requires active connected sessions.
      </div>
    </div>
  );
}
