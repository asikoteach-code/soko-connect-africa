import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { products } from "@/lib/mock-data";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  Flag,
  ShoppingBag,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Soko" }] }),
  component: Admin,
});

const stats = [
  { icon: Users, label: "Active users", value: "128.4K", trend: "+8.2%", color: "text-info bg-info/10" },
  { icon: ShoppingBag, label: "Listings", value: "42,810", trend: "+3.1%", color: "text-primary bg-primary-soft" },
  { icon: DollarSign, label: "GMV (mo)", value: "$1.92M", trend: "+12%", color: "text-gold-foreground bg-gold/20" },
  { icon: Flag, label: "Reports", value: "37", trend: "-14%", color: "text-destructive bg-destructive/10" },
];

const queue = [
  { id: 1, title: "iPhone 14 Pro Max — Deep Purple", reason: "Counterfeit suspected", status: "review" },
  { id: 2, title: "Toyota Axio 2015", reason: "Duplicate listing", status: "review" },
  { id: 3, title: "Macbook Air M2", reason: "Verified ✓", status: "ok" },
];

function Admin() {
  return (
    <AppShell>
      <PageHeader title="Admin dashboard" back="/profile" />
      <div className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: I, label, value, trend, color }) => (
            <div key={label} className="bg-card rounded-2xl p-4 shadow-card">
              <div className={`h-9 w-9 rounded-xl grid place-items-center ${color}`}>
                <I className="h-4 w-4" />
              </div>
              <p className="text-xs text-muted-foreground mt-3">{label}</p>
              <p className="font-display text-xl font-extrabold mt-0.5">{value}</p>
              <p className="text-[11px] font-semibold text-success mt-0.5 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" /> {trend}
              </p>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="bg-card rounded-2xl p-5 shadow-card mt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Weekly transactions</p>
              <p className="font-display text-lg font-extrabold">$284,910</p>
            </div>
            <span className="text-[11px] font-semibold bg-success/15 text-success px-2 py-1 rounded-md">
              +18%
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-xl bg-gradient-primary opacity-90"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>

        {/* Moderation queue */}
        <h3 className="font-display font-bold mt-6 mb-3">Moderation queue</h3>
        <div className="bg-card rounded-2xl shadow-card divide-y divide-border overflow-hidden">
          {queue.map((q, i) => (
            <div key={q.id} className="p-4 flex items-center gap-3">
              <img
                src={products[i].image}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{q.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  {q.status === "ok" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  )}
                  {q.reason}
                </p>
              </div>
              {q.status === "review" && (
                <button className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg">
                  Review
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
