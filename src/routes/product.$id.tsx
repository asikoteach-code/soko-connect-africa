import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { formatPrice, products } from "@/lib/mock-data";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Shield,
  Star,
} from "lucide-react";
import { useState } from "react";

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

function ProductDetail() {
  const { product: p } = Route.useLoaderData();
  const [saved, setSaved] = useState(false);

  return (
    <AppShell hideNav>
      <div className="relative">
        <img
          src={p.image}
          alt={p.title}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4">
          <Link
            to="/"
            className="h-10 w-10 grid place-items-center rounded-full bg-surface/90 backdrop-blur shadow-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button className="h-10 w-10 grid place-items-center rounded-full bg-surface/90 backdrop-blur shadow-card">
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSaved((s) => !s)}
              className="h-10 w-10 grid place-items-center rounded-full bg-surface/90 backdrop-blur shadow-card"
            >
              <Heart
                className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="-mt-6 relative bg-background rounded-t-3xl pt-5 pb-32 px-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-soft text-primary px-2 py-1 rounded-md">
            {p.condition}
          </span>
          <span className="text-xs text-muted-foreground">{p.postedAt}</span>
        </div>
        <h1 className="font-display text-xl font-extrabold leading-tight">{p.title}</h1>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="font-display text-2xl font-extrabold text-primary">
            {formatPrice(p.price, p.currency)}
          </p>
          <p className="text-xs text-muted-foreground line-through">
            {formatPrice(Math.round(p.price * 1.15), p.currency)}
          </p>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
          <MapPin className="h-3.5 w-3.5" /> {p.location}
        </p>

        {/* Seller */}
        <Link
          to="/seller/$id"
          params={{ id: p.seller.id }}
          className="mt-5 flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-card"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center font-bold">
            {p.seller.name[0]}
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-sm flex items-center gap-1">
              {p.seller.name}
              {p.seller.verified && (
                <BadgeCheck className="h-4 w-4 text-primary" />
              )}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Star className="h-3 w-3 fill-gold text-gold" /> {p.seller.rating} · 234 sales
            </p>
          </div>
          <span className="text-xs font-semibold text-primary">View →</span>
        </Link>

        {/* Trust */}
        <div className="mt-4 bg-primary-soft border border-primary/10 rounded-2xl p-4 flex gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-primary">Soko Safe</p>
            <p className="text-xs text-foreground/80 mt-0.5">
              Meet in public, inspect before paying. Use Soko Wallet escrow for delivery orders.
            </p>
          </div>
        </div>

        <h2 className="font-display font-bold mt-6 mb-2">Description</h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Premium {p.title}. Thoroughly tested, comes with all original accessories.
          Local delivery available across {p.location.split(",")[0]}. Mobile money & card accepted.
        </p>

        <h2 className="font-display font-bold mt-6 mb-3">Payment options</h2>
        <div className="grid grid-cols-3 gap-2">
          {["M-Pesa", "MTN MoMo", "Card"].map((m) => (
            <div
              key={m}
              className="bg-card border border-border rounded-xl p-3 text-center text-xs font-semibold"
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface/95 backdrop-blur-lg border-t border-border p-4 safe-bottom">
        <div className="flex gap-2">
          <button className="flex-1 inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-bold py-3.5 rounded-2xl">
            <Phone className="h-4 w-4" /> Call
          </button>
          <Link
            to="/chat/$id"
            params={{ id: p.seller.id }}
            className="flex-[2] inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated"
          >
            <MessageCircle className="h-4 w-4" /> Message seller
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
