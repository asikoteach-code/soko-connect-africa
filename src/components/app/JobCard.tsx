import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin } from "lucide-react";
import type { Job } from "@/lib/mock-data";

export function JobCard({ j }: { j: Job }) {
  return (
    <Link
      to="/jobs/$id"
      params={{ id: j.id }}
      className="block bg-card rounded-2xl p-4 shadow-card active:scale-[0.99] transition"
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden shrink-0 ring-1 ring-border">
          <img src={j.logo} alt={j.company} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground font-medium">{j.company}</p>
          <h3 className="font-display font-bold text-[15px] leading-snug line-clamp-2">
            {j.title}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> {j.location}
          </p>
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          className="h-9 w-9 grid place-items-center rounded-xl hover:bg-muted"
          aria-label="Save job"
        >
          <Bookmark className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-3">
        <span className="text-[11px] font-semibold bg-primary-soft text-primary px-2 py-1 rounded-md">
          {j.type}
        </span>
        {j.tags.slice(0, 2).map((t) => (
          <span
            key={t}
            className="text-[11px] font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md"
          >
            {t}
          </span>
        ))}
        <span className="ml-auto text-[12px] font-semibold text-foreground">{j.salary}</span>
      </div>
    </Link>
  );
}
