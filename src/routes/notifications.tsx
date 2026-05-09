import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { notifications } from "@/lib/mock-data";
import { Bell, MessageCircle, ShieldCheck, Sparkles, Tag } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Soko" }] }),
  component: Notifications,
});

const iconMap = {
  offer: Tag,
  message: MessageCircle,
  system: ShieldCheck,
  promo: Sparkles,
} as const;

const colorMap = {
  offer: "bg-primary-soft text-primary",
  message: "bg-info/15 text-info",
  system: "bg-success/15 text-success",
  promo: "bg-gold/20 text-gold-foreground",
} as const;

function Notifications() {
  return (
    <AppShell>
      <PageHeader title="Notifications" right={<Bell className="h-5 w-5" />} />
      <ul className="px-5 pt-4 space-y-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.type as keyof typeof iconMap];
          return (
            <li
              key={n.id}
              className="bg-card rounded-2xl p-4 shadow-card flex gap-3"
            >
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                  colorMap[n.type as keyof typeof colorMap]
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
