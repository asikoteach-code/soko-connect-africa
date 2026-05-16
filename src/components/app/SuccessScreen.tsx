import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

export function SuccessScreen({
  kind,
  onPostAnother,
}: {
  kind: "service" | "job" | "product";
  onPostAnother: () => void;
}) {
  const label = kind === "service" ? "service" : kind === "job" ? "job" : "listing";
  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center px-6 animate-fade-in">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary shadow-elevated">
          <Check className="h-12 w-12 text-primary-foreground" strokeWidth={3} />
        </span>
      </div>
      <h2 className="font-display text-2xl font-extrabold mt-8 text-center">
        Your {label} is live!
      </h2>
      <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
        Buyers nearby can now discover and message you instantly.
      </p>
      <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
        <Link
          to={kind === "job" ? "/jobs" : "/search"}
          className="bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated text-center"
        >
          View listing
        </Link>
        <button
          onClick={onPostAnother}
          className="border border-border bg-card font-semibold py-3.5 rounded-2xl"
        >
          Post another
        </button>
      </div>
    </div>
  );
}
