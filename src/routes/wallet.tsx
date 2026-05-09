import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  Smartphone,
  Wallet as WalletIcon,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Wallet — Soko" }] }),
  component: Wallet,
});

const tx = [
  { id: 1, type: "in", title: "Sale · iPhone 14 Pro", amount: 850000, time: "Today · 10:14", method: "M-Pesa" },
  { id: 2, type: "out", title: "Boost · Macbook Air", amount: 500, time: "Today · 09:02", method: "Wallet" },
  { id: 3, type: "in", title: "Top-up", amount: 5000, time: "Yesterday", method: "MTN MoMo" },
  { id: 4, type: "out", title: "Withdrawal", amount: 12000, time: "Mar 28", method: "Bank" },
];

function Wallet() {
  const [show, setShow] = useState(true);
  return (
    <AppShell>
      <PageHeader title="Soko Wallet" back="/profile" />
      <div className="px-5 pt-5">
        <div className="rounded-3xl p-5 bg-gradient-hero text-primary-foreground shadow-elevated relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5" />
              <span className="text-sm font-semibold opacity-85">Available balance</span>
            </div>
            <button onClick={() => setShow((s) => !s)}>
              {show ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          <p className="font-display text-3xl font-extrabold mt-3 relative">
            {show ? "KSh 124,580" : "•••••••"}
          </p>
          <p className="text-xs opacity-75 mt-1 relative">+ KSh 12,400 this week</p>

          <div className="grid grid-cols-3 gap-2 mt-5 relative">
            {[
              { icon: Plus, label: "Top up" },
              { icon: ArrowUpRight, label: "Withdraw" },
              { icon: Smartphone, label: "Pay" },
            ].map(({ icon: I, label }) => (
              <button
                key={label}
                className="bg-white/15 backdrop-blur rounded-2xl py-3 text-xs font-bold flex flex-col items-center gap-1"
              >
                <I className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile money */}
        <h3 className="font-display font-bold mt-6 mb-3">Linked accounts</h3>
        <div className="space-y-2">
          {[
            { name: "M-Pesa", num: "•••• 4421", color: "oklch(0.62 0.18 145)" },
            { name: "MTN MoMo", num: "•••• 8810", color: "oklch(0.78 0.16 80)" },
          ].map((a) => (
            <div
              key={a.name}
              className="bg-card rounded-2xl p-4 flex items-center gap-3 shadow-card"
            >
              <div
                className="h-10 w-10 rounded-xl grid place-items-center text-surface font-bold"
                style={{ background: a.color }}
              >
                {a.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.num}</p>
              </div>
              <span className="text-[11px] font-bold bg-success/15 text-success px-2 py-1 rounded-md">
                Active
              </span>
            </div>
          ))}
        </div>

        <h3 className="font-display font-bold mt-6 mb-3">Activity</h3>
        <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
          {tx.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-4">
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center ${
                  t.type === "in"
                    ? "bg-success/15 text-success"
                    : "bg-warning/15 text-warning"
                }`}
              >
                {t.type === "in" ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t.time} · {t.method}
                </p>
              </div>
              <p
                className={`text-sm font-bold ${
                  t.type === "in" ? "text-success" : "text-foreground"
                }`}
              >
                {t.type === "in" ? "+" : "−"}KSh {t.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
