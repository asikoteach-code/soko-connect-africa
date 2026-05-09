import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { ProductCard } from "@/components/app/ProductCard";
import { EmptyState } from "@/components/app/Section";
import { products } from "@/lib/mock-data";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — Soko" }] }),
  component: Saved,
});

function Saved() {
  const items = products.slice(0, 4);
  return (
    <AppShell>
      <PageHeader title="Saved items" />
      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title="Nothing saved yet"
          body="Tap the heart on any listing to keep it here for later."
          action={
            <Link
              to="/"
              className="inline-block bg-gradient-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl"
            >
              Explore marketplace
            </Link>
          }
        />
      ) : (
        <div className="px-5 pt-5 grid grid-cols-2 gap-3">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
