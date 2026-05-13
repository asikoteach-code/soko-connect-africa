import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ProductCard } from "@/components/app/ProductCard";
import { categories, products, formatPrice } from "@/lib/mock-data";
import {
  ArrowLeft,
  Search as SearchIcon,
  SlidersHorizontal,
  Mic,
  X,
  ArrowRight,
  MapPin,
  Eye,
  ChevronRight,
  PackageSearch,
  Compass,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — Soko" }] }),
  component: SearchPage,
});

const PLACEHOLDERS = ["iPhone 14...", "Ankara dress...", "Toyota Axio...", "Studio space..."];

type SubModel = { name: string; emoji: string; tint: string };
const SUBMODELS: Record<string, SubModel[]> = {
  phones: [
    { name: "iPhone 15 Pro Max", emoji: "📱", tint: "oklch(0.94 0.04 260)" },
    { name: "Samsung S24 Ultra", emoji: "📲", tint: "oklch(0.94 0.05 220)" },
    { name: "Tecno Camon 30", emoji: "📷", tint: "oklch(0.94 0.05 30)" },
    { name: "Infinix Zero", emoji: "⚡", tint: "oklch(0.94 0.05 80)" },
    { name: "Redmi Note 14", emoji: "🔋", tint: "oklch(0.94 0.05 155)" },
    { name: "Pixel 8", emoji: "✨", tint: "oklch(0.94 0.05 180)" },
  ],
  vehicles: [
    { name: "Toyota Prado", emoji: "🚙", tint: "oklch(0.94 0.05 155)" },
    { name: "BMW X5", emoji: "🏎️", tint: "oklch(0.94 0.05 240)" },
    { name: "Honda Fit", emoji: "🚗", tint: "oklch(0.94 0.05 30)" },
    { name: "Nissan Patrol", emoji: "🛻", tint: "oklch(0.94 0.05 80)" },
    { name: "Mercedes C300", emoji: "✨", tint: "oklch(0.94 0.05 200)" },
    { name: "Mazda Demio", emoji: "🚘", tint: "oklch(0.94 0.05 350)" },
  ],
  fashion: [
    { name: "Nike Air Force", emoji: "👟", tint: "oklch(0.94 0.05 20)" },
    { name: "Zara Hoodie", emoji: "🧥", tint: "oklch(0.94 0.05 260)" },
    { name: "Gucci Bag", emoji: "👜", tint: "oklch(0.94 0.05 50)" },
    { name: "Adidas Samba", emoji: "👟", tint: "oklch(0.94 0.05 155)" },
    { name: "Ankara Dress", emoji: "👗", tint: "oklch(0.94 0.05 30)" },
    { name: "Kente Shirt", emoji: "👕", tint: "oklch(0.94 0.05 80)" },
  ],
  home: [
    { name: "3-seater Sofa", emoji: "🛋️", tint: "oklch(0.94 0.05 80)" },
    { name: "King Bed", emoji: "🛏️", tint: "oklch(0.94 0.05 30)" },
    { name: "Dining Set", emoji: "🍽️", tint: "oklch(0.94 0.05 50)" },
    { name: "Office Chair", emoji: "🪑", tint: "oklch(0.94 0.05 220)" },
    { name: "Smart TV", emoji: "📺", tint: "oklch(0.94 0.05 260)" },
  ],
  electronics: [
    { name: "Macbook Air M2", emoji: "💻", tint: "oklch(0.94 0.05 220)" },
    { name: "PS5", emoji: "🎮", tint: "oklch(0.94 0.05 260)" },
    { name: "Sony Headphones", emoji: "🎧", tint: "oklch(0.94 0.05 280)" },
    { name: "iPad Pro", emoji: "📱", tint: "oklch(0.94 0.05 200)" },
    { name: "Canon DSLR", emoji: "📷", tint: "oklch(0.94 0.05 30)" },
  ],
  beauty: [
    { name: "Shea Butter Set", emoji: "🧴", tint: "oklch(0.94 0.05 50)" },
    { name: "Lash Kit", emoji: "👁️", tint: "oklch(0.94 0.05 350)" },
    { name: "Braiding Hair", emoji: "💇🏾‍♀️", tint: "oklch(0.94 0.05 30)" },
    { name: "Perfume", emoji: "🌸", tint: "oklch(0.94 0.05 320)" },
  ],
  jobs: [
    { name: "Remote Dev", emoji: "💻", tint: "oklch(0.94 0.05 220)" },
    { name: "Designer", emoji: "🎨", tint: "oklch(0.94 0.05 320)" },
    { name: "Driver", emoji: "🚖", tint: "oklch(0.94 0.05 50)" },
    { name: "Sales Rep", emoji: "📈", tint: "oklch(0.94 0.05 155)" },
  ],
  services: [
    { name: "Plumber", emoji: "🔧", tint: "oklch(0.94 0.05 220)" },
    { name: "Tutor", emoji: "📚", tint: "oklch(0.94 0.05 30)" },
    { name: "Photographer", emoji: "📷", tint: "oklch(0.94 0.05 280)" },
    { name: "Cleaner", emoji: "🧹", tint: "oklch(0.94 0.05 155)" },
  ],
};

const BRANDS: Record<string, { name: string; emoji: string }[]> = {
  phones: [
    { name: "Apple", emoji: "🍎" }, { name: "Samsung", emoji: "📲" },
    { name: "Tecno", emoji: "📱" }, { name: "Infinix", emoji: "⚡" },
    { name: "Xiaomi", emoji: "🔋" }, { name: "Google", emoji: "✨" },
  ],
  vehicles: [
    { name: "Toyota", emoji: "🚗" }, { name: "BMW", emoji: "🏎️" },
    { name: "Honda", emoji: "🚙" }, { name: "Nissan", emoji: "🛻" },
    { name: "Mercedes", emoji: "✨" }, { name: "Mazda", emoji: "🚘" },
  ],
  fashion: [
    { name: "Nike", emoji: "👟" }, { name: "Zara", emoji: "🧥" },
    { name: "Gucci", emoji: "👜" }, { name: "Adidas", emoji: "👕" },
    { name: "Ankara", emoji: "👗" },
  ],
  home: [
    { name: "IKEA", emoji: "🛋️" }, { name: "Habitat", emoji: "🛏️" },
    { name: "Samsung", emoji: "📺" }, { name: "LG", emoji: "🍳" },
  ],
  electronics: [
    { name: "Apple", emoji: "💻" }, { name: "Sony", emoji: "🎧" },
    { name: "Canon", emoji: "📷" }, { name: "HP", emoji: "🖥️" },
    { name: "Dell", emoji: "⌨️" },
  ],
  beauty: [
    { name: "Naya", emoji: "🧴" }, { name: "Shea Moisture", emoji: "🌿" },
    { name: "Fenty", emoji: "💄" }, { name: "L'Oréal", emoji: "💋" },
  ],
  jobs: [
    { name: "Flutterwave", emoji: "💳" }, { name: "Twiga", emoji: "🥬" },
    { name: "M-KOPA", emoji: "☀️" }, { name: "Jumia", emoji: "🛒" },
  ],
  services: [
    { name: "Plumbing", emoji: "🔧" }, { name: "Tutoring", emoji: "📚" },
    { name: "Photo", emoji: "📷" }, { name: "Cleaning", emoji: "🧹" },
  ],
};

const SUGGESTED_QUERIES: Record<string, string[]> = {
  phones: ["iPhone under $500", "Samsung dual SIM", "Gaming phones", "Phones with 5G"],
  vehicles: ["SUVs under 2M", "Manual sedans", "First owner cars", "Diesel pickups"],
  fashion: ["Sneakers under 5K", "Ankara dresses", "Bridal wear", "Designer bags"],
  home: ["3-seater sofas", "Smart TVs 55\"", "King size beds", "Office chairs"],
  electronics: ["Macbook under 150K", "Gaming PCs", "Wireless headphones", "DSLR cameras"],
  beauty: ["Natural skincare", "Lash extensions", "Bridal makeup", "Hair braiders"],
  jobs: ["Remote jobs", "Entry level", "Tech jobs Lagos", "Sales roles"],
  services: ["Plumbers near me", "Math tutors", "Event photographers", "Deep cleaning"],
};

const QUICK_FILTERS = ["New", "Used", "Verified", "Cheap", "Nearby"];
const TRENDING = ["Smart TVs", "Studio space", "Hair braiders", "Solar panels", "PS5", "Generators"];
const POPULAR_SEARCHES = ["Tecno Camon 20", "Office chair", "Plot in Kitengela", "Bridal hair"];
const PRESETS: { label: string; range: [number, number] }[] = [
  { label: "Under 5K", range: [0, 5000] },
  { label: "5K–50K", range: [5000, 50000] },
  { label: "50K–200K", range: [50000, 200000] },
  { label: "200K+", range: [200000, 2000000] },
];
type SortKey = "relevance" | "newest" | "price-asc" | "price-desc";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
];

function SearchPage() {
  const [q, setQ] = useState("");
  const [recents, setRecents] = useState<string[]>(["iPhone 14", "Toyota Axio", "Ankara dress", "Macbook"]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [phIndex, setPhIndex] = useState(0);
  const [showSuggest, setShowSuggest] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(false);
  const [discoverCat, setDiscoverCat] = useState<string | null>(null);

  // Filters
  const [price, setPrice] = useState<[number, number]>([0, 2000000]);
  const [condition, setCondition] = useState<"All" | "New" | "Used" | "Refurbished">("All");
  const [nearMe, setNearMe] = useState(false);
  const [city, setCity] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const activeFilterCount =
    (price[0] !== 0 || price[1] !== 2000000 ? 1 : 0) +
    (condition !== "All" ? 1 : 0) +
    (nearMe || city ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  // Cycle placeholder
  useEffect(() => {
    if (q) return;
    const t = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, [q]);

  // Simulate fetch shimmer when query/sort/filters change
  useEffect(() => {
    if (!q) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [q, sort, condition, nearMe, city, verifiedOnly, price[0], price[1], activeCat]);

  const matched = useMemo(() => {
    let list = products.slice();
    if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
    list = list.filter((p) => p.price >= price[0] && p.price <= price[1]);
    if (condition !== "All") list = list.filter((p) => p.condition === condition);
    if (verifiedOnly) list = list.filter((p) => p.seller.verified);
    if (city) list = list.filter((p) => p.location.toLowerCase().includes(city.toLowerCase()));
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.reverse(); break;
    }
    return list;
  }, [q, activeCat, price, condition, verifiedOnly, city, sort]);

  const suggestions = useMemo(() => {
    if (!q) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
  }, [q]);

  const filterSummary = [
    city || (nearMe ? "Near me" : ""),
    price[1] < 2000000 || price[0] > 0 ? `${formatPrice(price[0])}–${formatPrice(price[1])}` : "",
    condition !== "All" ? condition : "",
  ].filter(Boolean).join(" · ");

  const submitSearch = (term: string) => {
    setQ(term);
    setShowSuggest(false);
    setVisible(8);
    setRecents((prev) => [term, ...prev.filter((r) => r !== term)].slice(0, 5));
  };

  const highlight = (text: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-foreground">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-2 px-3 h-14">
          <Link to="/" className="h-11 w-11 grid place-items-center rounded-xl active:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="relative flex-1">
            <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2.5 ring-2 ring-transparent focus-within:ring-primary/40 focus-within:bg-card transition">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setShowSuggest(true); }}
                onFocus={() => setShowSuggest(true)}
                onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                placeholder={`Try "${PLACEHOLDERS[phIndex]}"`}
                aria-label="Search Soko"
                className="flex-1 bg-transparent text-sm outline-none placeholder:transition-all"
              />
              {q ? (
                <button onClick={() => setQ("")} aria-label="Clear" className="p-1">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              ) : (
                <button aria-label="Voice search" className="p-1">
                  <Mic className="h-4 w-4 text-primary" />
                </button>
              )}
            </div>
            {/* Live suggestions */}
            {showSuggest && q && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-elevated overflow-hidden z-40 animate-fade-in">
                {suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No quick matches</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {suggestions.map((s) => {
                      const cat = categories.find((c) => c.id === s.category);
                      return (
                        <li key={s.id}>
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => submitSearch(s.title.split("—")[0].trim())}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-muted"
                          >
                            <span className="text-lg">{cat?.icon ?? "🔎"}</span>
                            <span className="flex-1 text-sm line-clamp-1">{highlight(s.title)}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submitSearch(q)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-primary-soft text-primary text-sm font-semibold"
                >
                  See all results for "{q}"
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="relative h-11 w-11 grid place-items-center rounded-xl bg-primary text-primary-foreground"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-gold text-gold-foreground text-[10px] font-bold ring-2 ring-surface">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Category chips */}
        <div className="relative">
          <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {[{ id: "all", name: "All", icon: "✨" }, ...categories].map((c) => {
              const active = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(active && c.id !== "all" ? "all" : c.id)}
                  className={`shrink-0 snap-start inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all duration-300 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-card scale-[1.04]"
                      : "bg-muted text-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{c.icon}</span>
                  {c.name}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-10 bg-gradient-to-l from-surface to-transparent" />
        </div>

        {/* Sub-model suggestion row */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            SUBMODELS[activeCat] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            {SUBMODELS[activeCat] && (
              <div key={activeCat} className="flex gap-2.5 px-3 pb-3 overflow-x-auto scrollbar-hide">
                {SUBMODELS[activeCat].map((m, i) => (
                  <button
                    key={m.name}
                    onClick={() => submitSearch(m.name)}
                    style={{
                      background: `linear-gradient(135deg, ${m.tint}, color-mix(in oklab, ${m.tint} 55%, white))`,
                      animationDelay: `${i * 45}ms`,
                    }}
                    className="shrink-0 inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-2xl shadow-card ring-1 ring-border/60 active:scale-95 hover:-translate-y-0.5 transition-transform animate-fade-in opacity-0 [animation-fill-mode:forwards]"
                  >
                    <span className="h-8 w-8 grid place-items-center rounded-xl bg-white/70 backdrop-blur text-base shadow-sm">
                      {m.emoji}
                    </span>
                    <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                      {m.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {!q ? (
        <>
          {/* Recent */}
          {recents.length > 0 && (
            <section className="px-5 mt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent</h2>
                <button onClick={() => setRecents([])} className="text-xs text-primary font-semibold">
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {recents.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 text-sm bg-card border border-border pl-3 pr-1.5 py-1.5 rounded-full"
                  >
                    <button onClick={() => submitSearch(r)} className="font-medium">{r}</button>
                    <button
                      onClick={() => setRecents(recents.filter((x) => x !== r))}
                      aria-label={`Remove ${r}`}
                      className="h-6 w-6 grid place-items-center rounded-full hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Trending */}
          <section className="px-5 mt-6">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              🔥 Trending in Africa
            </h2>
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
              {TRENDING.map((r) => (
                <button
                  key={r}
                  onClick={() => submitSearch(r)}
                  className="shrink-0 text-sm bg-primary-soft text-primary font-semibold px-3.5 py-1.5 rounded-full"
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

          {/* Popular categories grid */}
          <section className="px-5 mt-6">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Popular categories
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setActiveCat(c.id); submitSearch(""); }}
                  className="relative h-24 rounded-2xl overflow-hidden text-left p-3 shadow-card active:scale-[0.98] transition"
                  style={{ background: c.color }}
                >
                  <span className="absolute top-2 right-2 text-3xl">{c.icon}</span>
                  <span className="absolute bottom-3 left-3 font-display font-bold text-foreground">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* People also searched */}
          <section className="px-5 mt-6">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              People also searched
            </h2>
            <ul className="bg-card rounded-2xl shadow-card divide-y divide-border overflow-hidden">
              {POPULAR_SEARCHES.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => submitSearch(s)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-muted"
                  >
                    <SearchIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{s}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <section className="px-5 mt-5">
          {/* Result count + summary */}
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm">
              <span className="font-bold">{matched.length}</span>
              <span className="text-muted-foreground"> results{filterSummary && ` · ${filterSummary}`}</span>
            </p>
          </div>

          {/* Sort chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
            {SORTS.map((s) => {
              const active = sort === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                    active ? "bg-foreground text-background" : "bg-muted text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Loading skeletons */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card shadow-card">
                  <div className="aspect-[4/3] shimmer" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 w-2/3 rounded shimmer" />
                    <div className="h-3 w-full rounded shimmer" />
                    <div className="h-3 w-1/2 rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : matched.length === 0 ? (
            <NoResults query={q} onBrowse={() => { setQ(""); setActiveCat("all"); }} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {matched.slice(0, visible).map((p, i) => (
                  <div key={p.id} className="relative">
                    <ProductCard p={p} />
                    {i % 3 === 0 && (
                      <span className="absolute bottom-16 left-2 inline-flex items-center gap-1 bg-foreground/85 text-background text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur">
                        <Eye className="h-3 w-3" /> {120 + i * 17} viewed today
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {visible < matched.length && (
                <button
                  onClick={() => setVisible((v) => v + 8)}
                  className="mt-5 w-full bg-card border border-border rounded-2xl py-3.5 font-semibold text-sm active:bg-muted"
                >
                  Load more ({matched.length - visible} more)
                </button>
              )}
            </>
          )}
        </section>
      )}

      {/* Filter bottom sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[88vh] overflow-y-auto p-0">
          <SheetHeader className="px-5 pt-5 pb-2">
            <SheetTitle className="font-display text-lg">Filters</SheetTitle>
          </SheetHeader>

          <div className="px-5 pb-6 space-y-6">
            {/* Price */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Price range</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPrice(p.range)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      price[0] === p.range[0] && price[1] === p.range[1]
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <Slider
                value={price}
                min={0}
                max={2000000}
                step={1000}
                onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatPrice(price[0])}</span>
                <span>{formatPrice(price[1])}</span>
              </div>
            </div>

            {/* Condition */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Condition</h3>
              <div className="grid grid-cols-4 gap-2">
                {(["All", "New", "Used", "Refurbished"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`text-xs font-semibold py-2 rounded-xl ${
                      condition === c ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Location</h3>
              <label className="flex items-center justify-between bg-muted rounded-xl px-4 py-3 mb-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" /> Near me (GPS)
                </span>
                <Switch checked={nearMe} onCheckedChange={setNearMe} />
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Or enter a city (e.g. Lagos)"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/40"
              />
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Sort by</h3>
              <div className="grid grid-cols-2 gap-2">
                {[...SORTS, { key: "newest" as SortKey, label: "Most viewed" }].slice(0, 5).map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSort(s.key)}
                    className={`text-xs font-semibold py-2.5 rounded-xl ${
                      sort === s.key ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified only */}
            <label className="flex items-center justify-between bg-muted rounded-xl px-4 py-3">
              <span className="text-sm font-medium">Verified sellers only</span>
              <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
            </label>
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border px-5 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                setPrice([0, 2000000]);
                setCondition("All");
                setNearMe(false);
                setCity("");
                setVerifiedOnly(false);
                setSort("relevance");
              }}
              className="text-sm font-semibold text-muted-foreground px-3"
            >
              Reset
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated"
            >
              Apply filters
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

function NoResults({ query, onBrowse }: { query: string; onBrowse: () => void }) {
  const similar = products.slice(0, 4);
  return (
    <div className="mt-8">
      <div className="flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-3xl bg-primary-soft grid place-items-center mb-4">
          <PackageSearch className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-display text-lg font-bold">No results for "{query}"</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Try different keywords or browse categories.
        </p>
        <button
          onClick={onBrowse}
          className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-2xl shadow-elevated"
        >
          <Compass className="h-4 w-4" /> Browse all categories
        </button>
      </div>
      <h4 className="mt-8 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
        Similar items you might like
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {similar.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
