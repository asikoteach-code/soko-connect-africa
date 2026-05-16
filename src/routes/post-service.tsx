import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  Sparkles,
  Loader2,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { MapPicker } from "@/components/app/MapPicker";
import { SuccessScreen } from "@/components/app/SuccessScreen";
import { generateServiceBio } from "@/lib/ai.functions";

export const Route = createFileRoute("/post-service")({
  head: () => ({ meta: [{ title: "Offer a Service — Soko" }] }),
  component: PostService,
});

const CATEGORIES = ["Beauty", "Repair", "Cleaning", "Tutoring", "Design", "Legal", "Health", "Other"];
const LANGUAGES = ["English", "Swahili", "French", "Hausa", "Zulu", "Arabic"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type PriceType = "Fixed" | "Hourly" | "Starting from";
type WorkMode = "I come to client" | "Client comes to me" | "Both";

function PostService() {
  const navigate = useNavigate();
  const genBio = useServerFn(generateServiceBio);

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Beauty");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<PriceType>("Fixed");
  const [price, setPrice] = useState("");
  const [experience, setExperience] = useState(2);
  const [languages, setLanguages] = useState<string[]>(["English"]);

  // Step 2
  const [mode, setMode] = useState<WorkMode>("Both");
  const [address, setAddress] = useState("");
  const [locName, setLocName] = useState("");
  const [radius, setRadius] = useState(10);
  const [days, setDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("18:00");
  const [urgent, setUrgent] = useState(false);

  // Step 3
  const [bio, setBio] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  const showMap = mode === "Client comes to me" || mode === "Both";
  const showRadius = mode === "I come to client" || mode === "Both";

  const toggle = <T,>(arr: T[], v: T, setter: (a: T[]) => void) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const runGenerate = async () => {
    setGenLoading(true);
    try {
      const prompt = `Write a service provider bio for an African marketplace listing.
Service: ${title || category}
Category: ${category}
Description: ${description}
Experience: ${experience} years
Languages: ${languages.join(", ")}
Location: ${locName || address || "Local area"}
Work mode: ${mode}`;
      const { text } = await genBio({ data: { prompt } });
      setBio(text);
    } catch (e) {
      setBio("Could not generate right now. Please try again or write manually.");
    } finally {
      setGenLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessScreen
        kind="service"
        onPostAnother={() => {
          setSuccess(false);
          setStep(1);
        }}
      />
    );
  }

  return (
    <AppShell hideNav>
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate({ to: "/" }))}
            className="h-10 w-10 grid place-items-center rounded-full hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display font-bold text-lg">Offer a Service</h1>
        </div>
        <div className="flex items-center gap-2 px-5 pb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                s <= step ? "bg-gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </header>

      <div className="px-5 pt-4 pb-32 space-y-4">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <Field label="Service title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professional Hair Braiding"
                className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-muted-foreground"
              />
            </Field>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3.5 py-2 rounded-full text-sm font-semibold border transition ${
                      category === c
                        ? "bg-primary text-primary-foreground border-primary shadow-card"
                        : "bg-card border-border text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Field label={`Description (${description.length}/500)`}>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder="Describe what you offer, your style, what's included…"
                className="w-full bg-transparent outline-none text-sm resize-none"
              />
              {description.length > 0 && description.length < 50 && (
                <p className="text-[11px] text-accent mt-1">
                  {50 - description.length} more characters needed
                </p>
              )}
            </Field>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Price type
              </p>
              <div className="grid grid-cols-3 gap-2 bg-muted rounded-2xl p-1">
                {(["Fixed", "Hourly", "Starting from"] as PriceType[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceType(p)}
                    className={`py-2 rounded-xl text-xs font-semibold transition ${
                      priceType === p ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Price (KSh)">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent outline-none text-sm font-medium"
              />
            </Field>

            <Field label={`Experience · ${experience}${experience >= 20 ? "+" : ""} year${experience === 1 ? "" : "s"}`}>
              <input
                type="range"
                min={0}
                max={20}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </Field>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Languages spoken
              </p>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => {
                  const on = languages.includes(l);
                  return (
                    <button
                      key={l}
                      onClick={() => toggle(languages, l, setLanguages)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        on
                          ? "bg-primary-soft text-primary border-primary/40"
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Photos
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button className="aspect-square rounded-2xl border-2 border-dashed border-border bg-card grid place-items-center text-muted-foreground">
                  <div className="text-center">
                    <Camera className="h-6 w-6 mx-auto" />
                    <span className="text-[11px] font-medium block mt-1">Cover</span>
                  </div>
                </button>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-2xl border-2 border-dashed border-border bg-card grid place-items-center text-muted-foreground"
                  >
                    <ImagePlus className="h-5 w-5" />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Up to 6 photos.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display font-bold mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Where do you work?
              </h2>
              <div className="flex gap-2 bg-muted rounded-2xl p-1 mt-3">
                {(["I come to client", "Client comes to me", "Both"] as WorkMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                      mode === m ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {showMap && (
              <div className="space-y-3">
                <MapPicker onChange={(p) => setAddress(p.address)} />
                <Field label="Address (from pin)">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Drag the pin to set your location"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </Field>
                <Field label="Location name">
                  <input
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    placeholder="e.g. Westlands Studio"
                    className="w-full bg-transparent outline-none text-sm font-medium"
                  />
                </Field>
              </div>
            )}

            {showRadius && (
              <Field label={`Service radius · ${radius} km`}>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </Field>
            )}

            <div>
              <h2 className="font-display font-bold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Availability
              </h2>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => {
                  const on = days.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => toggle(days, d, setDays)}
                      className={`h-10 w-12 rounded-xl text-xs font-bold border transition ${
                        on
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Field label="From">
                  <input
                    type="time"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-medium"
                  />
                </Field>
                <Field label="To">
                  <input
                    type="time"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-medium"
                  />
                </Field>
              </div>
              <label className="mt-3 flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Zap className="h-4 w-4 text-accent" /> Available for urgent requests
                </span>
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-gold rounded-2xl p-4 shadow-gold">
              <div className="flex items-center gap-2 text-gold-foreground">
                <Sparkles className="h-5 w-5" />
                <h2 className="font-display font-bold">Let AI write your profile</h2>
              </div>
              <p className="text-xs text-gold-foreground/85 mt-1">
                Soko AI uses your details to draft a professional bio that builds trust.
              </p>
              <button
                onClick={runGenerate}
                disabled={genLoading}
                className="mt-3 w-full bg-foreground text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {genLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate from my info
                  </>
                )}
              </button>
            </div>

            <Field label="Your profile bio">
              {genLoading ? (
                <div className="space-y-2 py-2">
                  <div className="h-3 rounded bg-muted animate-pulse" />
                  <div className="h-3 rounded bg-muted animate-pulse w-[92%]" />
                  <div className="h-3 rounded bg-muted animate-pulse w-[78%]" />
                  <div className="h-3 rounded bg-muted animate-pulse w-[88%]" />
                </div>
              ) : (
                <textarea
                  rows={8}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about yourself and your experience…"
                  className="w-full bg-transparent outline-none text-sm resize-none leading-relaxed"
                />
              )}
            </Field>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Preview
              </p>
              <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold">
                    {(title || "S")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{title || "Your service title"}</p>
                    <p className="text-xs text-muted-foreground">
                      {category} · {locName || "Nearby"}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-extrabold text-primary">
                      KSh {price || "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{priceType}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 line-clamp-3">
                  {bio || description || "Your bio will appear here."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-surface/95 backdrop-blur-lg border-t border-border p-4 safe-bottom">
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={() => setSuccess(true)}
            className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elevated"
          >
            Post Service · Free
          </button>
        )}
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
