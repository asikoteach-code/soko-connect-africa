import { createServerFn } from "@tanstack/react-start";

type GenInput = { prompt: string; system?: string };

async function callGateway(prompt: string, system: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI key missing");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`AI gateway ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export const generateServiceBio = createServerFn({ method: "POST" })
  .inputValidator((d: GenInput) => d)
  .handler(async ({ data }) => {
    const text = await callGateway(
      data.prompt,
      "You are a professional copywriter for an African marketplace called Soko. Write warm, confident, trustworthy service provider bios in 2-3 short paragraphs. Highlight experience, languages, and what makes the provider reliable. Avoid emojis and clichés. Keep it under 160 words.",
    );
    return { text };
  });

export const generateJobPost = createServerFn({ method: "POST" })
  .inputValidator((d: GenInput) => d)
  .handler(async ({ data }) => {
    const text = await callGateway(
      data.prompt,
      "You write clear, structured job posts for an African gig marketplace. Output plain text with these sections, each as a heading line followed by content:\nAbout the role\nResponsibilities (bulleted with '- ')\nRequirements (bulleted with '- ')\nWhat we offer\nAlso include a final line: 'Suggested budget: KSh X – Y' with a realistic range based on category and location.",
    );
    return { text };
  });
