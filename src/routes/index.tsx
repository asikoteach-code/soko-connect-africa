import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { HomeHeader } from "@/components/app/AppHeader";
import { ProductCard } from "@/components/app/ProductCard";
import { SectionHeader } from "@/components/app/Section";
import { categories, products } from "@/lib/mock-data";
import { Briefcase, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soko — Africa's premium marketplace" },
      {
        name: "description",
        content:
          "Buy, sell, find jobs and grow your hustle on Soko — built for Africa's mobile-first generation.",
      },
      { property: "og:title", content: "Soko — Africa's premium marketplace" },
      {
        property: "og:description",
        content: "Buy, sell, hire and get hired across Africa.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <AppShell>
      <HomeHeader />

      {/* Trust strip */}
      <div className="px-5 -mt-4">
        <div className="bg-card rounded-2xl shadow-card grid grid-cols-3 divide-x divide-border">
          {[
            { icon: ShieldCheck, label: "Verified sellers" },
            { icon: Zap, label: "Instant chat" },
            { icon: Briefcase, label: "Real jobs" },
          ].map(({ icon: I, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-3">
              <I className="h-4 w-4 text-primary" />
              <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <SectionHeader title="Browse by category" action="See all" to="/search" />
      <div className="px-5 grid grid-cols-4 gap-3">
        {categories.slice(0, 8).map((c) => (
          <Link
            key={c.id}
            to="/search"
            className="flex flex-col items-center gap-1.5 active:scale-95 transition"
          >
            <div
              className="h-14 w-14 rounded-2xl grid place-items-center text-2xl shadow-sm"
              style={{ background: c.color }}
            >
              {c.icon}
            </div>
            <span className="text-[11px] font-medium text-foreground">{c.name}</span>
          </Link>
        ))}
      </div>

      {/* Featured banner */}
      <div className="px-5 mt-7">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-gold p-5 shadow-gold">
          <div className="relative z-10 max-w-[70%]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gold-foreground/70">
              Soko Boost
            </p>
            <h3 className="font-display text-xl font-extrabold text-gold-foreground mt-1">
              Sell 3× faster with Boost
            </h3>
            <p className="text-xs text-gold-foreground/80 mt-1">
              Free 24-hour trial for new sellers.
            </p>
            <button className="mt-3 inline-flex items-center gap-2 bg-foreground text-background text-xs font-bold px-4 py-2 rounded-full">
              Try free
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute right-2 top-2 text-5xl">⚡</div>
        </div>
      </div>

      {/* Trending */}
      <SectionHeader title="Trending near you" action="View all" to="/search" />
      <div className="px-5 grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {/* Jobs teaser */}
      <SectionHeader title="Jobs for you" action="Explore" to="/jobs" />
      <div className="px-5">
        <Link
          to="/jobs"
          className="block bg-card rounded-2xl p-5 shadow-card border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-soft text-primary grid place-items-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold">240+ open roles</h3>
              <p className="text-xs text-muted-foreground">
                Tech, design, sales, support & more
              </p>
            </div>
            <span className="text-primary font-bold">→</span>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
