import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { categories } from "@/lib/mock-data";
import { Camera, ChevronRight, ImagePlus, Sparkles, Tag } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/post")({
  head: () => ({ meta: [{ title: "Post an ad — Soko" }] }),
  component: PostAd,
});

function PostAd() {
  const [step] = useState(1);
  return (
    <AppShell hideNav>
      <PageHeader title="Post an ad" />
      <div className="px-5 pt-4 pb-32">
        {/* progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full ${
                s <= step ? "bg-gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* photos */}
        <h2 className="font-display font-bold mb-3">Add photos</h2>
        <div className="grid grid-cols-3 gap-2">
          <button className="aspect-square rounded-2xl border-2 border-dashed border-border bg-card grid place-items-center text-muted-foreground">
            <div className="text-center">
              <Camera className="h-6 w-6 mx-auto" />
              <span className="text-[11px] font-medium block mt-1">Cover</span>
            </div>
          </button>
          {[1, 2].map((i) => (
            <button
              key={i}
              className="aspect-square rounded-2xl border-2 border-dashed border-border bg-card grid place-items-center text-muted-foreground"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Up to 8 photos. Better photos sell 3× faster.
        </p>

        {/* fields */}
        <div className="mt-6 space-y-3">
          <Field label="Title">
            <input
              placeholder="e.g. iPhone 14 Pro Max — 256GB"
              className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground"
            />
          </Field>
          <Field label="Category">
            <button className="w-full flex items-center justify-between text-left">
              <span className="text-sm text-muted-foreground">Choose category</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (KSh)">
              <input
                type="number"
                placeholder="0"
                className="w-full bg-transparent outline-none text-sm font-medium"
              />
            </Field>
            <Field label="Condition">
              <select className="w-full bg-transparent outline-none text-sm font-medium">
                <option>New</option>
                <option>Used</option>
                <option>Refurbished</option>
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={4}
              placeholder="Describe your item — features, why you're selling…"
              className="w-full bg-transparent outline-none text-sm resize-none"
            />
          </Field>
          <Field label="Location">
            <input
              defaultValue="Nairobi, Kenya"
              className="w-full bg-transparent outline-none text-sm font-medium"
            />
          </Field>
        </div>

        {/* AI suggest */}
        <div className="mt-5 bg-gradient-gold rounded-2xl p-4 flex gap-3 shadow-gold">
          <Sparkles className="h-5 w-5 text-gold-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-gold-foreground">Soko AI suggestion</p>
            <p className="text-xs text-gold-foreground/85 mt-1">
              Recommended price range: <b>KSh 820,000 – 880,000</b> based on similar listings.
            </p>
          </div>
        </div>

        {/* Quick categories */}
        <h3 className="font-display font-bold mt-6 mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4" /> Popular categories
        </h3>
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              to="/search"
              className="inline-flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-full text-sm"
            >
              <span>{c.icon}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface/95 backdrop-blur-lg border-t border-border p-4 safe-bottom">
        <button className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated">
          Continue · Free
        </button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block bg-card border border-border rounded-2xl px-4 py-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
