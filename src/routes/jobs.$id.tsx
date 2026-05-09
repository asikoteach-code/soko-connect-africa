import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PageHeader } from "@/components/app/AppHeader";
import { jobs } from "@/lib/mock-data";
import { BadgeCheck, Bookmark, Clock, MapPin, Share2 } from "lucide-react";

export const Route = createFileRoute("/jobs/$id")({
  loader: ({ params }) => {
    const job = jobs.find((j) => j.id === params.id);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.job.title ?? "Job"} — Soko` },
      { name: "description", content: loaderData?.job.title ?? "" },
    ],
  }),
  component: JobDetail,
  notFoundComponent: () => (
    <AppShell>
      <div className="p-10 text-center">Job not found</div>
    </AppShell>
  ),
});

function JobDetail() {
  const { job: j } = Route.useLoaderData();
  return (
    <AppShell hideNav>
      <PageHeader
        title="Job details"
        back="/jobs"
        right={<Share2 className="h-5 w-5" />}
      />
      <div className="px-5 pt-5 pb-32">
        <div className="bg-card rounded-3xl p-5 shadow-card">
          <div className="flex items-start gap-4">
            <img
              src={j.logo}
              alt={j.company}
              className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border"
            />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                {j.company} <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              </p>
              <h1 className="font-display text-lg font-extrabold leading-tight mt-0.5">
                {j.title}
              </h1>
            </div>
            <button className="h-9 w-9 grid place-items-center rounded-xl bg-muted">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="Type" value={j.type} />
            <Stat label="Salary" value={j.salary.split(" ")[0]} />
            <Stat label="Posted" value={j.postedAt} />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {j.location}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {j.postedAt}
          </span>
        </div>

        <h2 className="font-display font-bold mt-6 mb-2">About the role</h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          We're hiring a {j.title} to join our growing team at {j.company}. You'll work
          alongside a passionate, mission-driven team building products for millions of
          users across Africa.
        </p>

        <h2 className="font-display font-bold mt-6 mb-3">Skills</h2>
        <div className="flex gap-2 flex-wrap">
          {j.tags.map((t: string) => (
            <span
              key={t}
              className="text-xs font-semibold bg-primary-soft text-primary px-3 py-1.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <h2 className="font-display font-bold mt-6 mb-2">What we offer</h2>
        <ul className="space-y-2 text-sm text-foreground/80">
          {[
            "Competitive salary + equity",
            "Remote-friendly culture",
            "Health insurance for you & family",
            "Annual learning budget",
          ].map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface/95 backdrop-blur-lg border-t border-border p-4 safe-bottom">
        <button className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated">
          Apply with Soko Profile
        </button>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-xl py-2.5">
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-bold mt-0.5 truncate">{value}</p>
    </div>
  );
}
