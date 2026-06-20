import { useState } from "react";
import { useListCommands, useToggleCommand } from "@workspace/api-client-react";

export default function AdminCommands() {
  const { data: commands, refetch } = useListCommands();
  const toggleMutation = useToggleCommand();
  const [search, setSearch] = useState("");

  const filtered = commands?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filtered?.map((c) => c.category) ?? [])].sort();

  const handleToggle = async (name: string, enabled: boolean) => {
    await toggleMutation.mutateAsync({ name, data: { enabled: !enabled } });
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search commands..."
          className="flex-1 bg-background border border-input text-foreground px-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
        />
        <div className="text-xs text-muted-foreground">
          {filtered?.length ?? 0} / {commands?.length ?? 0}
        </div>
      </div>

      {categories.map((cat) => {
        const cmds = filtered?.filter((c) => c.category === cat) ?? [];
        return (
          <div key={cat} className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-primary/5">
              <span className="text-primary font-bold text-xs tracking-widest uppercase">{cat}</span>
              <span className="text-muted-foreground text-xs ml-2">({cmds.length})</span>
            </div>
            <table className="w-full text-xs font-mono">
              <tbody>
                {cmds.map((cmd) => (
                  <tr key={cmd.name} className="border-b border-border/40 hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-2 text-primary font-bold w-32">.{cmd.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">{cmd.description ?? "—"}</td>
                    <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">{cmd.usage ?? ""}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleToggle(cmd.name, cmd.enabled)}
                        className={`px-3 py-1 rounded-sm border text-xs tracking-widest transition-colors ${
                          cmd.enabled
                            ? "border-primary/40 text-primary hover:bg-primary/10"
                            : "border-muted-foreground/30 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {cmd.enabled ? "ON" : "OFF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
