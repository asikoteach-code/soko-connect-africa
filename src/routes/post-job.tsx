import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  MapPin,
  Briefcase,
  Minus,
  Plus,
  RefreshCw,
  Zap,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { MapPicker } from "@/components/app/MapPicker";
import { SuccessScreen } from "@/components/app/SuccessScreen";
import { generateJobPost } from "@/lib/ai.functions";

export const Route = createFileRoute("/post-job")({
  head: () => ({ meta: [{ title: "Post a Job — Soko" }] }),
  component: PostJob,
});

const CATEGORIES = [
  "Beauty", "Repair", "Cleaning", "Tutoring", "Design", "Legal", "Health",
  "Construction", "Transport", "Agriculture", "IT", "Other",
];
type JobType = "One-time" | "Part-time" | "Full-time" | "Contract";
type BudgetType = "Fixed" | "Per hour" | "Negotiable";
type ExpLevel = "None" | "Junior 0–2yr" | "Mid 2–5yr" | "Senior 5yr+";
type Gender = "Any" | "Male" | "Female";
type LocMode = "On-site" | "Remote / Online";

function PostJob() {
  const navigate = useNavigate();
  const genJob = useServerFn(generateJobPost);

  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Step 1
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Construction");
  const [jobType, setJobType] = useState<JobType>("One-time");
  const [budgetType, setBudgetType] = useState<BudgetType>("Fixed");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [workers, setWorkers] = useState(1);

  // Step 2
  const [locMode, setLocMode] = useState<LocMode>("On-site");
  const [address, setAddress] = useState("");
  const [locName, setLocName] = useState("");
  const [platform, setPlatform] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [exp, setExp] = useState<ExpLevel>("Junior 0–2yr");
  const [gender, setGender] = useState<Gender>("Any");
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(60);

  // Step 3
  const [post, setPost] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const addSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setSkills([...new Set([...skills, skillInput.trim()])]);
      setSkillInput("");
    }
  };

  const runGenerate = async () => {
    setGenLoading(true);
    try {
      const prompt = `Create a job post.
Title: ${title || category}
Category: ${category}
Job type: ${jobType}
Location: ${locMode === "On-site" ? locName || address || "On-site" : `Remote (${platform || "online"})`}
Workers needed: ${workers}
Skills: ${skills.join(", ") || "general"}
Experience: ${exp}
Brief: ${description || "(no description provided)"}
Budget type: ${budgetType}${budget ? ` (~KSh ${budget})` : ""}`;
      const { text } = await genJob({ data: { prompt } });
      setPost(text);
      const m = text.match(/Suggested budget:\s*(.+)/i);
      if (m) setSuggestion(m[1].trim());
    } catch {
      setPost("Could not generate right now. Please try again or write manually.");
    } finally {
      setGenLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessScreen
        kind="job"
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
          <h1 className="font-display font-bold text-lg">Post a Job</h1>
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
            <Field label="Job title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Looking for a Plumber"
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

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Job type
              </p>
              <div className="grid grid-cols-4 gap-2 bg-muted rounded-2xl p-1">
                {(["One-time", "Part-time", "Full-time", "Contract"] as JobType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setJobType(t)}
                    className={`py-2 rounded-xl text-[11px] font-semibold transition ${
                      jobType === t ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Budget type
              </p>
              <div className="grid grid-cols-3 gap-2 bg-muted rounded-2xl p-1">
                {(["Fixed", "Per hour", "Negotiable"] as BudgetType[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBudgetType(b)}
                    className={`py-2 rounded-xl text-xs font-semibold transition ${
                      budgetType === b ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {budgetType !== "Negotiable" && (
              <Field label={`Budget (KSh${budgetType === "Per hour" ? " / hr" : ""})`}>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent outline-none text-sm font-medium"
                />
              </Field>
            )}

            <Field label="Job description">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work, requirements, timeline…"
                className="w-full bg-transparent outline-none text-sm resize-none"
              />
            </Field>

            <label className="flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-accent" /> Mark as urgent
              </span>
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="h-5 w-5 accent-accent"
              />
            </label>

            <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Workers needed
                </p>
                <p className="text-sm font-semibold mt-1">
                  {workers}
                  {workers >= 10 ? "+" : ""} worker{workers === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWorkers(Math.max(1, workers - 1))}
                  className="h-9 w-9 rounded-full bg-muted grid place-items-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setWorkers(Math.min(10, workers + 1))}
                  className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-display font-bold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Job location
              </h2>
              <div className="grid grid-cols-2 gap-2 bg-muted rounded-2xl p-1">
                {(["On-site", "Remote / Online"] as LocMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setLocMode(m)}
                    className={`py-2 rounded-xl text-xs font-semibold transition ${
                      locMode === m ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {locMode === "On-site" ? (
              <div className="space-y-3">
                <MapPicker onChange={(p) => setAddress(p.address)} />
                <Field label="Address (from pin)">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Drag the pin to set job location"
                    className="w-full bg-transparent outline-none text-sm"
                  />
                </Field>
                <Field label="Location name">
                  <input
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    placeholder="e.g. Karen site, Block C"
                    className="w-full bg-transparent outline-none text-sm font-medium"
                  />
                </Field>
              </div>
            ) : (
              <Field label="Platform / tool">
                <input
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. Zoom, WhatsApp, Google Meet"
                  className="w-full bg-transparent outline-none text-sm font-medium"
                />
              </Field>
            )}

            <div>
              <h2 className="font-display font-bold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Requirements
              </h2>

              <Field label="Skills needed (press Enter)">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 bg-primary-soft text-primary text-xs font-semibold px-2.5 py-1 rounded-full"
                    >
                      {s}
                      <button onClick={() => setSkills(skills.filter((x) => x !== s))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </Field>

              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Experience required
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["None", "Junior 0–2yr", "Mid 2–5yr", "Senior 5yr+"] as ExpLevel[]).map((e) => (
                    <button
                      key={e}
                      onClick={() => setExp(e)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                        exp === e
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Gender preference (optional)
                </p>
                <div className="grid grid-cols-3 gap-2 bg-muted rounded-2xl p-1">
                  {(["Any", "Male", "Female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-xl text-xs font-semibold transition ${
                        gender === g ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <Field label={`Age range · ${ageMin}–${ageMax}`}>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Min</p>
                    <input
                      type="range"
                      min={18}
                      max={60}
                      value={ageMin}
                      onChange={(e) => setAgeMin(Math.min(Number(e.target.value), ageMax))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Max</p>
                    <input
                      type="range"
                      min={18}
                      max={60}
                      value={ageMax}
                      onChange={(e) => setAgeMax(Math.max(Number(e.target.value), ageMin))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-gold rounded-2xl p-4 shadow-gold">
              <div className="flex items-center gap-2 text-gold-foreground">
                <Sparkles className="h-5 w-5" />
                <h2 className="font-display font-bold">Let AI craft your job post</h2>
              </div>
              <p className="text-xs text-gold-foreground/85 mt-1">
                Generates a structured post and suggests a fair budget.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={runGenerate}
                  disabled={genLoading}
                  className="bg-foreground text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {genLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Working…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate
                    </>
                  )}
                </button>
                <button
                  onClick={runGenerate}
                  disabled={genLoading || !post}
                  className="bg-gold-foreground/15 text-gold-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </button>
              </div>
            </div>

            {suggestion && (
              <div className="bg-gradient-gold rounded-2xl p-4 flex gap-3 shadow-gold">
                <Sparkles className="h-5 w-5 text-gold-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-gold-foreground">Soko AI budget suggestion</p>
                  <p className="text-xs text-gold-foreground/85 mt-1">{suggestion}</p>
                </div>
              </div>
            )}

            <Field label="Job post">
              {genLoading ? (
                <div className="space-y-2 py-2">
                  {[100, 90, 85, 95, 70, 88].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 rounded bg-muted animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              ) : (
                <textarea
                  rows={12}
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  placeholder="Your AI-generated job post will appear here. You can also write manually."
                  className="w-full bg-transparent outline-none text-sm resize-none leading-relaxed font-mono"
                />
              )}
            </Field>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Preview
              </p>
              <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm">{title || "Your job title"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {category} · {jobType} · {locMode === "On-site" ? locName || "On-site" : "Remote"}
                    </p>
                  </div>
                  {urgent && (
                    <span className="bg-accent text-accent-foreground text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm font-extrabold text-primary mt-2">
                  {budgetType === "Negotiable"
                    ? "Budget: Negotiable"
                    : `KSh ${budget || "—"}${budgetType === "Per hour" ? " / hr" : ""}`}
                </p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-4 whitespace-pre-line">
                  {post || description || "Job description will appear here."}
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
            Post Job · Free
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
