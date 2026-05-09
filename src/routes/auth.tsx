import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, ArrowLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Soko" }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="mx-auto max-w-md min-h-screen flex flex-col">
        <header className="px-3 h-14 flex items-center">
          <Link to="/" className="h-10 w-10 grid place-items-center rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </header>

        <div className="px-6 pt-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center font-display text-2xl font-extrabold shadow-elevated">
            S
          </div>
          <h1 className="font-display text-3xl font-extrabold mt-5 leading-tight">
            {mode === "signin" ? "Welcome back" : "Join Soko"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {mode === "signin"
              ? "Sign in to continue buying & selling."
              : "Create your free account in seconds."}
          </p>
        </div>

        <div className="px-6 pt-7 space-y-3 flex-1">
          <button className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" /> Continue with phone
          </button>
          <button className="w-full bg-card text-foreground font-bold py-3.5 rounded-2xl border border-border flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" /> Continue with email
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-card border border-border rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2">
              <span className="font-display">G</span> Google
            </button>
            <button className="bg-card border border-border rounded-2xl py-3 font-bold text-sm flex items-center justify-center gap-2">
              <Apple className="h-4 w-4" /> Apple
            </button>
          </div>

          <div className="bg-primary-soft text-primary text-xs font-medium rounded-2xl p-3.5 mt-4 flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            Trusted by 128k+ sellers across Africa
          </div>
        </div>

        <div className="px-6 pb-8 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to Soko? " : "Already have an account? "}
          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="text-primary font-bold"
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
          <p className="text-[11px] mt-3 text-muted-foreground/80">
            By continuing you agree to Soko's Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
