import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { JobCard } from "@/components/app/JobCard";
import { jobs } from "@/lib/mock-data";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Jobs — Soko" },
      { name: "description", content: "Find your next role across Africa." },
    ],
  }),
  component: Jobs,
});

const filters = ["All", "Remote", "Tech", "Design", "Sales", "Support"];

function Jobs() {
  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-2 px-3 h-14">
          <Link to="/" className="h-10 w-10 grid place-items-center rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-lg font-bold flex-1">Jobs</h1>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-primary-soft text-primary">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Job title, company, skill"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-hide">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-full ${
                i === 0
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Hero card */}
      <div className="px-5 pt-5">
        <div className="rounded-3xl p-5 bg-gradient-gold shadow-gold">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gold-foreground/70">
            Soko Jobs
          </p>
          <h2 className="font-display text-xl font-extrabold text-gold-foreground mt-1">
            240+ verified roles this week
          </h2>
          <p className="text-xs text-gold-foreground/80 mt-1">
            Apply with your Soko profile in 1 tap.
          </p>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-3">
        {jobs.map((j) => (
          <JobCard key={j.id} j={j} />
        ))}
      </div>
    </AppShell>
  );
}
