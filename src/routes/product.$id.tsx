import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { ProductCard } from "@/components/app/ProductCard";
import { formatPrice, products } from "@/lib/mock-data";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.title ?? "Product"} — Soko` },
      { name: "description", content: loaderData?.product.title ?? "" },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-10 text-center">Product not found</div>
    </AppShell>
  ),
});

const CATEGORY_LABEL: Record<string, string> = {
  phones: "Phones › Smartphones",
  vehicles: "Vehicles › Cars",
  fashion: "Fashion › Apparel",
  electronics: "Electronics › Computers",
  home: "Home › Furniture",
  beauty: "Beauty › Skincare",
};

function highlightDescription(text: string) {
  const keywords = ["delivery", "warranty", "negotiable", "sealed", "original"];
  const re = new RegExp(`(${keywords.join("|")})`, "gi");
  return text.split(re).map((part, i) =>
    keywords.includes(part.toLowerCase()) ? (
      <span key={i} className="text-primary underline underline-offset-2 font-semibold">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function StaticMap({ lat = -1.2675, lng = 36.8108 }: { lat?: number; lng?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let map: any;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        attributionControl: false,
      }).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      const circle = L.circle([lat, lng], {
        radius: 600,
        color: "#0D4A2A",
        fillColor: "#0D4A2A",
        fillOpacity: 0.18,
        weight: 2,
      });
      circle.addTo(map);
    })();
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [lat, lng]);
  return (
    <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-card border border-border">
      <div ref={ref} className="absolute inset-0" style={{ zIndex: 0 }} />
      <div className="pointer-events-none absolute inset-0 bg-background/10" />
    </div>
  );
}

function ProductDetail() {
  const { product: p } = Route.useLoaderData();
  const [saved, setSaved] = useState(false);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [revealPhone, setRevealPhone] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Build a small gallery from variations of the same image
  const gallery = [
    p.image,
    p.image.replace(/w=\d+/, "w=900").replace(/h=\d+/, "h=900"),
    p.image.replace(/w=\d+/, "w=700").replace(/h=\d+/, "h=700"),
    p.image.replace(/w=\d+/, "w=1000").replace(/h=\d+/, "h=1000"),
  ];

  const similar = products.filter((x) => x.id !== p.id).slice(0, 6);

  // AI price check
  const low = Math.round(p.price * 0.92);
  const high = Math.round(p.price * 1.08);
  const verdict =
    p.price < low ? "deal" : p.price > high ? "high" : "fair";

  const onScrollGallery = (e: React.UIEvent<HTMLDivElement>) => {
    const w = e.currentTarget.clientWidth;
    setActive(Math.round(e.currentTarget.scrollLeft / w));
  };

  const goToImage = (idx: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTo({
      left: idx * scrollerRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const online = true;
  const sold = false;

  return (
    <AppShell hideNav>
      {/* Image Gallery */}
      <div className="relative bg-muted">
        <div
          ref={scrollerRef}
          onScroll={onScrollGallery}
          className="flex h-[280px] overflow-x-auto snap-x snap-mandatory scrollbar-none"
        >
          {gallery.map((src, i) => (
            <div key={i} className="min-w-full h-full snap-center">
              <img
                src={src}
                alt={`${p.title} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Top overlay header */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 safe-top">
          <Link
            to="/"
            className="h-10 w-10 grid place-items-center rounded-full bg-black/45 backdrop-blur text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setSaved((s) => !s)}
              className="h-10 w-10 grid place-items-center rounded-full bg-black/45 backdrop-blur text-white"
              aria-label="Save"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
            </button>
            <button className="h-10 w-10 grid place-items-center rounded-full bg-black/45 backdrop-blur text-white">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Boost badge */}
        {p.boosted && (
          <span className="absolute top-16 left-4 inline-flex items-center gap-1 bg-gradient-gold text-gold-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow-gold">
            <Sparkles className="h-3 w-3" /> Boosted
          </span>
        )}

        {/* Image counter */}
        <span className="absolute top-16 right-4 text-[11px] font-semibold bg-black/55 text-white px-2.5 py-1 rounded-full backdrop-blur">
          {active + 1} / {gallery.length}
        </span>

        {/* Dots */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
          {gallery.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>

        {sold && (
          <div className="absolute inset-0 bg-black/40 grid place-items-center">
            <span className="bg-destructive text-destructive-foreground font-extrabold text-xl px-6 py-2 rounded-xl rotate-[-6deg] shadow-elevated">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none bg-background">
        {gallery.map((src, i) => (
          <button
            key={i}
            onClick={() => goToImage(i)}
            className={`h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 transition ${
              i === active ? "border-primary" : "border-transparent opacity-70"
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Info card overlapping */}
      <div className="-mt-3 relative bg-background rounded-t-3xl pb-32">
        <div className="px-5 pt-5">
          {/* Price + condition */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display text-[28px] font-extrabold leading-none text-foreground">
              {formatPrice(p.price, p.currency)}
            </p>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                p.condition === "New"
                  ? "bg-primary-soft text-primary"
                  : "bg-muted text-foreground/70"
              }`}
            >
              {p.condition ?? "Used"}
            </span>
          </div>

          <h1 className="font-display text-lg font-bold leading-tight mt-2">
            {p.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {CATEGORY_LABEL[p.category] ?? p.category}
          </p>

          {/* Meta chips */}
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
              <MapPin className="h-3 w-3" /> {p.location}
            </span>
            <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
              <Clock className="h-3 w-3" /> {p.postedAt}
            </span>
            <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-full">
              <Eye className="h-3 w-3" /> 143 views
            </span>
            {p.seller.verified && (
              <span className="inline-flex items-center gap-1 bg-primary-soft text-primary px-2.5 py-1 rounded-full font-semibold">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>

          {p.boosted && (
            <span className="mt-3 inline-flex items-center gap-1 bg-gold/15 text-gold-foreground border border-gold/30 text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Zap className="h-3 w-3 fill-gold text-gold" /> Boosted listing
            </span>
          )}

          {/* Seller card */}
          <div className="mt-5 bg-card rounded-2xl p-4 shadow-card">
            <Link
              to="/seller/$id"
              params={{ id: p.seller.id }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">
                  {p.seller.name[0]}
                </div>
                {online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm flex items-center gap-1">
                  {p.seller.name}
                  {p.seller.verified && (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gold text-gold" /> {p.seller.rating} · 127 sales · Since 2022
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                  Usually replies in &lt; 5 min
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Link
                to="/chat/$id"
                params={{ id: p.seller.id }}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl text-sm"
              >
                <MessageCircle className="h-4 w-4" /> Chat
              </Link>
              <button
                onClick={() => setRevealPhone(true)}
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold py-3 rounded-xl text-sm"
              >
                <Phone className="h-4 w-4" />
                {revealPhone ? "+254 712 345 678" : "Tap to reveal"}
              </button>
            </div>
          </div>

          {/* AI Price check */}
          <div className="mt-4 bg-gold/10 border border-gold/30 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <div className="h-8 w-8 grid place-items-center rounded-full bg-gradient-gold text-gold-foreground shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-sm">Soko AI Price Check</p>
                <p className="text-xs text-foreground/80 mt-0.5">
                  Similar listings sell for {formatPrice(low, p.currency)} – {formatPrice(high, p.currency)}.
                </p>
                <span
                  className={`mt-2 inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    verdict === "fair"
                      ? "bg-primary-soft text-primary"
                      : verdict === "deal"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gold/20 text-gold-foreground"
                  }`}
                >
                  {verdict === "fair"
                    ? "Fair price ✓"
                    : verdict === "deal"
                      ? "Great deal 🔥"
                      : "Slightly above market"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <h2 className="font-display font-bold mt-6 mb-2">Description</h2>
          <p
            className={`text-sm text-foreground/85 leading-relaxed ${
              expanded ? "" : "line-clamp-4"
            }`}
          >
            {highlightDescription(
              `Brand new ${p.title}, sealed box, comes with original accessories. ${p.condition ?? "Excellent"} condition. Delivery available within ${p.location.split(",")[0]}. Negotiable for serious buyers. Mobile money & card accepted. Local warranty included.`,
            )}
          </p>
          <button
            onClick={() => setExpanded((x) => !x)}
            className="mt-1 text-xs font-semibold text-primary"
          >
            {expanded ? "Show less" : "Read more"}
          </button>

          {/* Details grid */}
          <h2 className="font-display font-bold mt-6 mb-2">Details</h2>
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {[
              ["Condition", p.condition ?? "Used"],
              ["Category", CATEGORY_LABEL[p.category]?.split(" › ")[0] ?? p.category],
              ["Brand", "Apple"],
              ["Storage", "256GB"],
              ["Color", "Space Black"],
              ["Delivery", "Available"],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`grid grid-cols-2 px-4 py-3 text-sm ${
                  i % 2 ? "bg-muted/40" : ""
                }`}
              >
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <h2 className="font-display font-bold mt-6 mb-2 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" /> Item location
          </h2>
          <StaticMap />
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-muted-foreground">
              {p.location} · ~1.2 km from you
            </span>
            <button className="font-semibold text-primary">View on map →</button>
          </div>

          {/* Safety */}
          <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground">
            <button
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-1.5 self-start"
            >
              <Flag className="h-3.5 w-3.5" /> Report this listing
            </button>
            <button className="inline-flex items-center gap-1.5 self-start">
              <Shield className="h-3.5 w-3.5" /> Soko Buyer Protection — learn more
            </button>
          </div>
        </div>

        {/* Similar */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="font-display font-bold">Similar listings</h2>
            <Link to="/search" className="text-xs font-semibold text-primary">
              See all →
            </Link>
          </div>
          <div className="flex gap-3 px-5 pb-2 overflow-x-auto scrollbar-none">
            {similar.map((sp) => (
              <div key={sp.id} className="w-40 shrink-0">
                <ProductCard p={sp} compact />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface/95 backdrop-blur-lg border-t border-border p-3 safe-bottom z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved((s) => !s)}
            className="h-12 w-12 grid place-items-center rounded-2xl border-2 border-border"
            aria-label="Save"
          >
            <Bookmark
              className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`}
            />
          </button>
          <Link
            to="/chat/$id"
            params={{ id: p.seller.id }}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated"
          >
            <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-400" : "bg-muted-foreground"}`} />
            {online ? "Online now — Chat" : "Chat with seller"}
          </Link>
        </div>
      </div>

      {/* Report sheet */}
      <Sheet open={reportOpen} onOpenChange={setReportOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Report this listing</SheetTitle>
          </SheetHeader>
          <div className="grid gap-2 mt-4">
            {["Fake item", "Wrong price", "Spam or scam", "Other"].map((r) => (
              <button
                key={r}
                onClick={() => setReportOpen(false)}
                className="text-left px-4 py-3 rounded-xl bg-muted hover:bg-muted/70 font-medium text-sm"
              >
                {r}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
