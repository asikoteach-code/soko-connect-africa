import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { messages } from "@/lib/mock-data";
import { Image as ImageIcon, Plus, Send, Smile } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/chat/$id")({
  head: () => ({ meta: [{ title: "Chat — Soko" }] }),
  component: ChatRoom,
});

type Msg = { id: string; mine: boolean; text: string; time: string };

const seed: Msg[] = [
  { id: "1", mine: false, text: "Hi! Thanks for reaching out 👋", time: "10:24" },
  { id: "2", mine: false, text: "Yes, the iPhone 14 Pro Max is still available.", time: "10:24" },
  { id: "3", mine: true, text: "Great! Is the price negotiable?", time: "10:26" },
  { id: "4", mine: false, text: "Small discount possible if you pick up today 🙂", time: "10:27" },
  { id: "5", mine: true, text: "Cool. Can I see the original receipt?", time: "10:28" },
];

function ChatRoom() {
  const { id } = Route.useParams();
  const peer = messages.find((m) => m.id === id) ?? messages[0];
  const [list, setList] = useState(seed);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setList((l) => [
      ...l,
      { id: String(Date.now()), mine: true, text, time: "now" },
    ]);
    setText("");
  };

  return (
    <AppShell hideNav>
      <PageHeader
        title={peer.name}
        back="/chat"
        right={
          <img src={peer.avatar} alt="" className="h-8 w-8 rounded-full" />
        }
      />
      <div className="px-4 py-4 space-y-2 min-h-[calc(100vh-9rem)]">
        <div className="text-center text-[10px] uppercase tracking-wider text-muted-foreground my-3 font-semibold">
          Today
        </div>
        {list.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm shadow-sm ${
                m.mine
                  ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-card text-foreground rounded-bl-md"
              }`}
            >
              <p>{m.text}</p>
              <p
                className={`text-[10px] mt-1 ${
                  m.mine ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface/95 backdrop-blur-lg border-t border-border p-3 safe-bottom">
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 grid place-items-center rounded-full bg-muted">
            <Plus className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </button>
            <button>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <button
            onClick={send}
            className="h-10 w-10 grid place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elevated"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
