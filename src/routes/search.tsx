import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ProductCard } from "@/components/app/ProductCard";
import { categories, products } from "@/lib/mock-data";
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Soko" }] }),
  component: SearchPage,
});

const recents = ["iPhone 14", "Toyota Axio", "Ankara dress", "Macbook"];
const trending = ["Smart TVs", "Studio space", "Hair braiders", "Solar panels"];

function SearchPage() {
  const [q, setQ] = useState("");
  const filtered = q
    ? products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
    : products;

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-2 px-3 h-14">
          <Link to="/" className="h-10 w-10 grid place-items-center rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-primary text-primary-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.id}
              className="shrink-0 inline-flex items-center gap-1.5 bg-muted hover:bg-secondary text-xs font-semibold px-3 py-2 rounded-full"
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>
      </header>

      {!q && (
        <>
          <section className="px-5 mt-5">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Recent
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {recents.map((r) => (
                <button
                  key={r}
                  onClick={() => setQ(r)}
                  className="text-sm bg-card border border-border px-3 py-1.5 rounded-full"
                >
                  {r}
                </button>
              ))}
            </div>
          </section>
          <section className="px-5 mt-6">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              🔥 Trending in Africa
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {trending.map((r) => (
                <button
                  key={r}
                  onClick={() => setQ(r)}
                  className="text-sm bg-primary-soft text-primary font-semibold px-3 py-1.5 rounded-full"
                >
                  {r}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="px-5 mt-6">
        <p className="text-xs text-muted-foreground mb-3">
          {filtered.length} results
        </p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
