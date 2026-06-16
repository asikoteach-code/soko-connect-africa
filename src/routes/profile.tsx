import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import {
  BadgeCheck,
  Bookmark,
  ChevronRight,
  HelpCircle,
  LogOut,
  Settings,
  ShieldCheck,
  Star,
  Wallet,
  Briefcase,
  ListChecks,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Soko" }] }),
  component: Profile,
});

const groups: { title: string; items: { icon: typeof Wallet; label: string; to: string; meta?: string }[] }[] = [
  {
    title: "Marketplace",
    items: [
      { icon: ListChecks, label: "My listings", to: "/", meta: "12 active" },
      { icon: Bookmark, label: "Saved items", to: "/saved" },
      { icon: Wallet, label: "Soko Wallet", to: "/wallet", meta: "KSh 124,580" },
      { icon: Briefcase, label: "Job applications", to: "/jobs", meta: "3" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: ShieldCheck, label: "Verification", to: "/profile", meta: "Verified" },
      { icon: Settings, label: "Settings", to: "/profile" },
      { icon: HelpCircle, label: "Help & safety", to: "/profile" },
    ],
  },
];

function Profile() {
  return (
    <AppShell>
      {/* Banner */}
      <div className="bg-gradient-hero text-primary-foreground rounded-b-3xl pt-10 pb-8 px-5 shadow-elevated">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/15 grid place-items-center font-display text-2xl font-extrabold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-extrabold flex items-center gap-1">
              Amina Otieno <BadgeCheck className="h-5 w-5 text-gold" />
            </h1>
            <p className="text-xs opacity-80">@amina · Nairobi</p>
            <div className="flex items-center gap-3 text-xs mt-1.5">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-gold text-gold" /> 4.9
              </span>
              <span className="opacity-70">·</span>
              <span>234 sales</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4">
        <Link
          to="/post"
          className="block bg-card rounded-2xl p-4 shadow-elevated text-center"
        >
          <p className="text-xs text-muted-foreground">Earn more on Soko</p>
          <p className="font-display font-bold mt-0.5">+ Post a new ad</p>
        </Link>
      </div>

      {groups.map((g) => (
        <section key={g.title} className="px-5 mt-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
            {g.title}
          </h2>
          <div className="bg-card rounded-2xl shadow-card divide-y divide-border overflow-hidden">
            {g.items.map(({ icon: I, label, to, meta }) => (
              <Link
                key={label}
                to={to as "/"}
                className="flex items-center gap-3 px-4 py-3.5 active:bg-muted"
              >
                <div className="h-9 w-9 rounded-xl bg-primary-soft text-primary grid place-items-center">
                  <I className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium">{label}</span>
                {meta && (
                  <span className="text-xs font-semibold text-muted-foreground">{meta}</span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      ))}
      <section className="px-5 mt-6">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          Settings
        </h2>
        <ThemeToggle />
      </section>


      <div className="px-5 mt-6">
        <Link
          to="/auth"
          className="w-full inline-flex items-center justify-center gap-2 bg-card text-destructive font-bold py-3.5 rounded-2xl border border-border"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Link>
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Soko v1.0 · Made with 💚 in Africa
        </p>
      </div>
    </AppShell>
  );
}
