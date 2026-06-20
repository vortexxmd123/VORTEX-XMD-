import { useGetAdminMe, useGetStats } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Link } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: me, isError } = useGetAdminMe();
  const { data: stats } = useGetStats();

  useEffect(() => {
    if (isError) setLocation("/admin/login");
  }, [isError, setLocation]);

  const cards = [
    { href: "/admin/settings", label: "SETTINGS", desc: "Bot name, prefix, messages" },
    { href: "/admin/commands", label: "COMMANDS", desc: "Toggle bot commands" },
    { href: "/admin/sessions", label: "SESSIONS", desc: "Manage active sessions" },
    { href: "/admin/broadcast", label: "BROADCAST", desc: "Send to all devices" },
    { href: "/admin/logs", label: "SYSTEM LOGS", desc: "Full log history" },
    { href: "/admin/security", label: "SECURITY", desc: "Password & access control" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-primary/30 rounded-sm p-6 glow-border">
        <pre className="text-primary text-sm text-glow">{`╭━━〔 SYSTEM ACCESS GRANTED 〕━━⬣
┃ User     : ${me?.username?.toUpperCase() ?? "..."}
┃ Sessions : ${stats?.activeSessions ?? 0} active / ${stats?.totalSessions ?? 0} total
┃ Commands : ${stats?.commandsLoaded ?? 0} loaded
╰━━━━━━━━━━━━⬣`}</pre>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="bg-card border border-border rounded-sm p-5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="text-primary font-bold tracking-widest text-sm group-hover:text-glow">{card.label}</div>
              <div className="text-muted-foreground text-xs mt-1">{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
