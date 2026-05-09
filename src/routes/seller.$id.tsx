import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { ProductCard } from "@/components/app/ProductCard";
import { products } from "@/lib/mock-data";
import { BadgeCheck, MapPin, MessageCircle, Star } from "lucide-react";

export const Route = createFileRoute("/seller/$id")({
  head: () => ({ meta: [{ title: "Seller — Soko" }] }),
  component: Seller,
});

function Seller() {
  const { id } = Route.useParams();
  const seller = products.find((p) => p.seller.id === id)?.seller ?? products[0].seller;
  const items = products.filter((p) => p.seller.id === id);
  const display = items.length ? items : products;

  return (
    <AppShell>
      <PageHeader title="Seller profile" />
      <section className="px-5 pt-5">
        <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-5 shadow-elevated">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/15 grid place-items-center font-display font-extrabold text-2xl">
              {seller.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-extrabold flex items-center gap-1">
                {seller.name}
                {seller.verified && <BadgeCheck className="h-5 w-5 text-gold" />}
              </h2>
              <p className="text-xs opacity-80 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> Nairobi · Joined 2023
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/15 text-center">
            {[
              { v: `${seller.rating}★`, l: "Rating" },
              { v: "234", l: "Sales" },
              { v: "98%", l: "Reply rate" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display font-extrabold">{s.v}</p>
                <p className="text-[11px] opacity-75">{s.l}</p>
              </div>
            ))}
          </div>
          <Link
            to="/chat/$id"
            params={{ id: seller.id }}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-surface text-foreground font-bold py-3 rounded-2xl"
          >
            <MessageCircle className="h-4 w-4" /> Message {seller.name.split(" ")[0]}
          </Link>
        </div>
      </section>

      <section className="px-5 mt-6">
        <div className="bg-card rounded-2xl p-4 shadow-card flex gap-3">
          <Star className="h-5 w-5 text-gold fill-gold shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">"Super smooth deal — fast delivery and great quality."</p>
            <p className="text-xs text-muted-foreground mt-1">— Mary, 2 weeks ago</p>
          </div>
        </div>
      </section>

      <h3 className="font-display font-bold px-5 mt-6 mb-3">Listings ({display.length})</h3>
      <div className="px-5 grid grid-cols-2 gap-3">
        {display.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </AppShell>
  );
}
