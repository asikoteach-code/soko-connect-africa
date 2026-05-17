import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { formatPrice, messages, products } from "@/lib/mock-data";
import {
  ArrowLeft,
  Camera,
  CheckCheck,
  ChevronRight,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Shield,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/chat/$id")({
  head: () => ({ meta: [{ title: "Chat — Soko" }] }),
  component: ChatRoom,
});

type Msg =
  | {
      id: string;
      kind: "text";
      mine: boolean;
      text: string;
      time: string;
      read?: boolean;
    }
  | {
      id: string;
      kind: "offer";
      mine: boolean;
      amount: number;
      time: string;
      status: "pending" | "accepted" | "declined";
    }
  | { id: string; kind: "system"; text: string };

const seed: Msg[] = [
  { id: "s1", kind: "system", text: "Amani Stores joined the chat" },
  {
    id: "1",
    kind: "text",
    mine: false,
    text: "Hello! Yes, the iPhone is still available.",
    time: "2h ago",
  },
  {
    id: "2",
    kind: "text",
    mine: false,
    text: "It's brand new, sealed box with all accessories.",
    time: "2h ago",
  },
  {
    id: "3",
    kind: "text",
    mine: true,
    text: "Great! Is the price negotiable?",
    time: "2h ago",
    read: true,
  },
  {
    id: "4",
    kind: "text",
    mine: false,
    text: "For serious buyer, can do KSh 820,000. Can deliver within Nairobi today.",
    time: "1h ago",
  },
  {
    id: "5",
    kind: "text",
    mine: true,
    text: "Can you deliver to Westlands?",
    time: "1h ago",
    read: true,
  },
  {
    id: "6",
    kind: "text",
    mine: false,
    text: "Yes, free delivery to Westlands ✅",
    time: "1h ago",
  },
  { id: "s2", kind: "system", text: "Payment protected by Soko Escrow" },
  {
    id: "7",
    kind: "text",
    mine: true,
    text: "Perfect, I'll take it!",
    time: "2m ago",
    read: false,
  },
  {
    id: "8",
    kind: "text",
    mine: false,
    text: "Yes, still available. Can deliver tomorrow 🙌",
    time: "2m ago",
  },
];

const QUICK_REPLIES = [
  "Is this still available?",
  "What's your best price?",
  "Can you deliver?",
  "I'm interested",
  "Can I see more photos?",
];

function ChatRoom() {
  const { id } = Route.useParams();
  const peer = messages.find((m) => m.id === id) ?? messages[0];
  const product = products[0]; // iPhone 14 Pro Max
  const [list, setList] = useState<Msg[]>(seed);
  const [text, setText] = useState("");
  const [safetyDismissed, setSafetyDismissed] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(
    Math.round(product.price * 0.95),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("soko_safety_dismissed") === "1")
        setSafetyDismissed(true);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [list.length]);

  const dismissSafety = () => {
    setSafetyDismissed(true);
    try {
      localStorage.setItem("soko_safety_dismissed", "1");
    } catch {
      /* noop */
    }
  };

  const send = (value?: string) => {
    const v = (value ?? text).trim();
    if (!v) return;
    setList((l) => [
      ...l,
      {
        id: String(Date.now()),
        kind: "text",
        mine: true,
        text: v,
        time: "now",
        read: false,
      },
    ]);
    setText("");
  };

  const sendOffer = () => {
    setList((l) => [
      ...l,
      {
        id: String(Date.now()),
        kind: "offer",
        mine: true,
        amount: offerAmount,
        time: "now",
        status: "pending",
      },
    ]);
    setOfferOpen(false);
  };

  const respondOffer = (mid: string, status: "accepted" | "declined") => {
    setList((l) =>
      l.map((m) => (m.id === mid && m.kind === "offer" ? { ...m, status } : m)),
    );
  };

  const hasText = text.trim().length > 0;
  const isFresh = list.filter((m) => m.kind === "text").length <= 2;

  const minOffer = Math.round(product.price * 0.5);
  const maxOffer = product.price;

  return (
    <AppShell hideNav>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border safe-top">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Link
            to="/chat"
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link
            to="/seller/$id"
            params={{ id: product.seller.id }}
            className="flex-1 flex items-center gap-2.5 min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={peer.avatar}
                alt={peer.name}
                className="h-9 w-9 rounded-full object-cover"
              />
              {peer.online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-surface" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm leading-tight truncate">
                {peer.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {product.title.split(" — ")[0]}
              </p>
            </div>
          </Link>
          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted">
            <Phone className="h-5 w-5 text-primary" />
          </button>
          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Product context card */}
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="flex items-center gap-3 mx-3 mb-2.5 p-2.5 rounded-xl bg-primary-soft border-l-4 border-primary"
        >
          <img
            src={product.image}
            alt=""
            className="h-12 w-12 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">
              {product.title.split(" — ")[0]} — 256GB
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-extrabold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-primary flex items-center shrink-0">
            View <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </header>

      {/* Safety banner */}
      {!safetyDismissed && (
        <div className="mx-3 mt-3 rounded-xl bg-gold/15 border border-gold/30 p-3 flex items-start gap-2 animate-fade-in">
          <Shield className="h-4 w-4 text-gold-foreground shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-foreground">
              Stay safe — Never pay outside Soko Wallet
            </p>
            <button className="text-primary font-semibold mt-0.5 inline-flex items-center gap-1">
              <Wallet className="h-3 w-3" /> Use Soko Escrow for protected payments →
            </button>
          </div>
          <button
            onClick={dismissSafety}
            className="h-6 w-6 grid place-items-center rounded-full hover:bg-background/40"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="px-3 py-4 pb-44 space-y-2 overflow-y-auto"
        style={{ minHeight: "calc(100vh - 12rem)" }}
      >
        <div className="text-center text-[10px] uppercase tracking-wider text-muted-foreground my-2 font-semibold">
          Today
        </div>

        {list.map((m, i) => {
          if (m.kind === "system") {
            return (
              <div key={m.id} className="flex justify-center my-2">
                <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {m.text}
                </span>
              </div>
            );
          }

          if (m.kind === "offer") {
            return (
              <div
                key={m.id}
                className={`flex ${m.mine ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className="max-w-[80%] bg-card border-2 border-primary rounded-2xl p-3 shadow-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💰</span>
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Offer sent
                      </p>
                      <p className="font-display font-extrabold text-primary">
                        {formatPrice(m.amount, "KSh")}
                      </p>
                    </div>
                  </div>
                  {m.status === "pending" ? (
                    m.mine ? (
                      <p className="text-[11px] text-muted-foreground font-semibold">
                        Pending…
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondOffer(m.id, "accepted")}
                          className="flex-1 bg-primary text-primary-foreground text-xs font-bold py-2 rounded-lg"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondOffer(m.id, "declined")}
                          className="flex-1 bg-destructive/10 text-destructive text-xs font-bold py-2 rounded-lg"
                        >
                          Decline
                        </button>
                      </div>
                    )
                  ) : (
                    <p
                      className={`text-xs font-bold ${
                        m.status === "accepted" ? "text-emerald-600" : "text-destructive"
                      }`}
                    >
                      {m.status === "accepted" ? "Accepted ✓" : "Declined ✗"}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">{m.time}</p>
                </div>
              </div>
            );
          }

          const prev = list[i - 1];
          const showAvatar =
            !m.mine && (!prev || prev.kind !== "text" || prev.mine);

          return (
            <div
              key={m.id}
              className={`flex items-end gap-1.5 ${m.mine ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {!m.mine && (
                <div className="w-7 shrink-0">
                  {showAvatar && (
                    <img
                      src={peer.avatar}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  )}
                </div>
              )}
              <div className={`max-w-[78%] flex flex-col ${m.mine ? "items-end" : "items-start"}`}>
                {!m.mine && showAvatar && (
                  <span className="text-[10px] text-muted-foreground font-semibold mb-0.5 ml-1">
                    {peer.name}
                  </span>
                )}
                <div
                  className={`px-3.5 py-2 text-sm shadow-sm ${
                    m.mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border"
                  }`}
                  style={{
                    borderRadius: m.mine
                      ? "16px 4px 16px 16px"
                      : "4px 16px 16px 16px",
                  }}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 mt-0.5 px-1">
                  <span className="text-[10px] text-muted-foreground">
                    {m.time}
                  </span>
                  {m.mine && (
                    <CheckCheck
                      className={`h-3 w-3 ${m.read ? "text-primary" : "text-muted-foreground"}`}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface border-t border-border safe-bottom z-30">
        {/* Make an offer */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={() => setOfferOpen(true)}
            className="inline-flex items-center gap-1.5 bg-surface border-2 border-primary text-primary text-xs font-bold px-3.5 py-2 rounded-full shadow-elevated"
          >
            💰 Make an Offer
          </button>
        </div>

        {/* Quick replies */}
        {isFresh && (
          <div className="flex gap-2 px-3 pt-2 pb-1 overflow-x-auto scrollbar-none">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 p-3">
          <div className="flex gap-1">
            <button className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 bg-muted rounded-2xl px-3.5 py-2 max-h-28 overflow-y-auto">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message..."
              rows={1}
              className="w-full bg-transparent text-sm outline-none resize-none leading-snug"
            />
          </div>
          <button
            onClick={() => (hasText ? send() : null)}
            className={`h-10 w-10 grid place-items-center rounded-full transition-all ${
              hasText
                ? "bg-primary text-primary-foreground shadow-elevated scale-100"
                : "bg-muted text-muted-foreground"
            }`}
            aria-label={hasText ? "Send" : "Voice"}
          >
            {hasText ? (
              <Send className="h-4 w-4 animate-scale-in" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Offer sheet */}
      <Sheet open={offerOpen} onOpenChange={setOfferOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Send an Offer</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <p className="text-xs text-muted-foreground">
              Listed at{" "}
              <span className="font-semibold text-foreground">
                {formatPrice(product.price, product.currency)}
              </span>
            </p>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Your offer (KSh)
              </label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value) || 0)}
                className="mt-1 w-full text-2xl font-extrabold bg-muted rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              type="range"
              min={minOffer}
              max={maxOffer}
              step={1000}
              value={offerAmount}
              onChange={(e) => setOfferAmount(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>50% · {formatPrice(minOffer, "KSh")}</span>
              <span>100% · {formatPrice(maxOffer, "KSh")}</span>
            </div>
            <div className="bg-gold/15 border border-gold/30 rounded-xl p-3 flex gap-2">
              <Sparkles className="h-4 w-4 text-gold-foreground shrink-0 mt-0.5" />
              <p className="text-xs">
                Similar items accepted offers around{" "}
                <span className="font-bold">KSh 810,000 – 830,000</span>
              </p>
            </div>
            <button
              onClick={sendOffer}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated"
            >
              Send Offer
            </button>
            <p className="text-[11px] text-center text-muted-foreground">
              Seller will accept or counter your offer
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hidden camera button placeholder for accessibility parity */}
      <button className="hidden" aria-hidden>
        <Camera />
      </button>
    </AppShell>
  );
}
