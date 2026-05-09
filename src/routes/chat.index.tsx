import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { messages } from "@/lib/mock-data";
import { Search, Edit3 } from "lucide-react";

export const Route = createFileRoute("/chat/")({
  head: () => ({ meta: [{ title: "Chats — Soko" }] }),
  component: ChatList,
});

function ChatList() {
  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold">Chats</h1>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-primary-soft text-primary">
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search messages"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </header>

      <ul className="divide-y divide-border">
        {messages.map((m) => (
          <li key={m.id}>
            <Link
              to="/chat/$id"
              params={{ id: m.id }}
              className="flex items-center gap-3 px-5 py-3.5 active:bg-muted"
            >
              <div className="relative shrink-0">
                <img
                  src={m.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                {m.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-surface" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm truncate">{m.name}</p>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    {m.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p
                    className={`text-xs truncate ${
                      m.unread ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {m.last}
                  </p>
                  {m.unread > 0 && (
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] px-1.5 grid place-items-center">
                      {m.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
