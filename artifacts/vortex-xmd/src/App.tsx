import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "wouter";
import { Activity, Terminal, Shield, Link as LinkIcon, List, Settings, Command, Radio, Key, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/Dashboard";
import Pair from "@/pages/Pair";
import Sessions from "@/pages/Sessions";
import Logs from "@/pages/Logs";
import Status from "@/pages/Status";
import AdminLogin from "@/pages/AdminLogin";
import Admin from "@/pages/Admin";
import AdminSettings from "@/pages/AdminSettings";
import AdminCommands from "@/pages/AdminCommands";
import AdminSessions from "@/pages/AdminSessions";
import AdminBroadcast from "@/pages/AdminBroadcast";
import AdminLogs from "@/pages/AdminLogs";
import AdminSecurity from "@/pages/AdminSecurity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

const PAGE_TITLES: Record<string, string> = {
  "/": "DASHBOARD",
  "/pair": "PAIR DEVICE",
  "/sessions": "SESSIONS",
  "/logs": "LIVE LOGS",
  "/status": "SYSTEM STATUS",
  "/admin/login": "ADMIN LOGIN",
  "/admin": "ADMIN OVERVIEW",
  "/admin/settings": "SETTINGS",
  "/admin/commands": "COMMANDS",
  "/admin/sessions": "MANAGE SESSIONS",
  "/admin/broadcast": "BROADCAST",
  "/admin/logs": "SYSTEM LOGS",
  "/admin/security": "SECURITY",
};

function Clock() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{time}</span>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const active = location === href;
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-2 my-0.5 rounded-sm transition-all text-sm ${
          active
            ? "bg-primary/10 text-primary text-glow border border-primary/30"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon size={16} />
        <span>{label}</span>
      </Link>
    );
  };

  const pageTitle = PAGE_TITLES[location] ?? location.toUpperCase().replace(/\//g, " / ").trim();

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground font-mono">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border flex flex-col transform transition-transform md:translate-x-0 md:static md:flex ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-border shrink-0">
          <h1 className="text-xl font-bold text-primary text-glow tracking-widest">VORTEX XMD</h1>
          <button className="md:hidden text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto">
          <div className="mb-5">
            <div className="text-xs font-bold text-muted-foreground uppercase mb-2 px-4 tracking-widest">PUBLIC ACCESS</div>
            <NavLink href="/" icon={Activity} label="Dashboard" />
            <NavLink href="/pair" icon={LinkIcon} label="Pair Device" />
            <NavLink href="/sessions" icon={List} label="Sessions" />
            <NavLink href="/logs" icon={Terminal} label="Live Logs" />
            <NavLink href="/status" icon={Shield} label="System Status" />
          </div>

          <div className="border-t border-border/50 pt-4">
            <div className="text-xs font-bold text-muted-foreground uppercase mb-2 px-4 tracking-widest">ADMIN TERMINAL</div>
            <NavLink href="/admin/login" icon={Key} label="Login" />
            <NavLink href="/admin" icon={Terminal} label="Overview" />
            <NavLink href="/admin/settings" icon={Settings} label="Settings" />
            <NavLink href="/admin/commands" icon={Command} label="Commands" />
            <NavLink href="/admin/sessions" icon={List} label="Manage Sessions" />
            <NavLink href="/admin/broadcast" icon={Radio} label="Broadcast" />
            <NavLink href="/admin/logs" icon={Terminal} label="System Logs" />
            <NavLink href="/admin/security" icon={Shield} label="Security" />
          </div>
        </nav>

        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          <div>Owner: LORD RAY</div>
          <div>Dev: GHOST</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="text-primary font-bold text-sm tracking-widest">{pageTitle}</div>
          </div>
          <div className="text-muted-foreground text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary pulse-glow block" />
            SYS_TIME: <Clock />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/pair" component={Pair} />
        <Route path="/sessions" component={Sessions} />
        <Route path="/logs" component={Logs} />
        <Route path="/status" component={Status} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/commands" component={AdminCommands} />
        <Route path="/admin/sessions" component={AdminSessions} />
        <Route path="/admin/broadcast" component={AdminBroadcast} />
        <Route path="/admin/logs" component={AdminLogs} />
        <Route path="/admin/security" component={AdminSecurity} />
        <Route path="/admin" component={Admin} />
        <Route>
          <div className="bg-card border border-border rounded-sm p-8 text-center">
            <div className="text-accent text-4xl font-bold mb-2">404</div>
            <div className="text-muted-foreground">Page not found.</div>
            <Link href="/" className="text-primary hover:text-glow text-sm mt-4 block">Return to Dashboard</Link>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
