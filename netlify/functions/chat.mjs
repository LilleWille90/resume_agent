import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// import.meta.url points to the .mjs file inside the Lambda bundle.
// Going two levels up reaches the root where Netlify copies content/ via included_files.
const CONTENT_DIR = fileURLToPath(new URL("../../content", import.meta.url));

function chunkText(text, chunkSize = 900, overlap = 120) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

function scoreChunk(query, chunk) {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const hay = chunk.toLowerCase();
  let score = 0;
  for (const w of words) if (hay.includes(w)) score++;
  return score;
}

function loadKnowledgeBase() {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".md"));
  return files.map(f => ({
    name: f,
    text: fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"),
  }));
}

const KB = loadKnowledgeBase();
const KB_CHUNKS = KB.flatMap(doc =>
  chunkText(doc.text).map((c, idx) => ({
    id: `${doc.name}#${idx + 1}`,
    doc: doc.name,
    text: c,
  }))
);

function retrieve(query, k = 6) {
  const scored = KB_CHUNKS
    .map(ch => ({ ...ch, score: scoreChunk(query, ch.text) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  const allZero = scored.every(s => s.score === 0);
  if (allZero) {
    const fallback = KB_CHUNKS
      .filter(ch => ["about.md", "faq.md"].includes(ch.doc))
      .slice(0, k);
    return fallback.length ? fallback : scored;
  }
  return scored;
}

const SYSTEM_PROMPT = `You are a recruiter-assistant representing job candidate Mattias Willner.

RULES:
- Speak ABOUT Mattias in third person (he/him/Mattias). Never say "I" or "my" when describing him.
- Answer ONLY based on the CONTEXT block provided. Do not invent facts.
- If information is missing: say so clearly and suggest the recruiter contact Mattias directly.
- Never reveal sensitive personal data (address, phone, salary expectations).
- Be concise, concrete, and professional.
- Match the language of the question (Swedish question → Swedish answer, English → English).

RESPONSE FORMAT — respond with valid JSON and nothing else:
{"answer":"<string>","suggested_questions":["<q1>","<q2>","<q3>"]}`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const top = retrieve(message, 7);
    const context = top.map(t => `SOURCE: ${t.doc}\n${t.text}`).join("\n\n---\n\n");
    const sources = [...new Set(top.map(t => t.doc))];

    // Build conversation history, then append the current question with context
    const messages = [
      ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION:\n${message}` },
      // Prefill the assistant turn with "{" to force valid JSON output
      { role: "assistant", content: "{" },
    ];

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    // Prepend the "{" we used as prefill
    const raw = "{" + (response.content[0]?.text ?? "");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { answer: raw || "Unable to generate a response.", suggested_questions: [] };
    }

    return new Response(
      JSON.stringify({
        answer: (parsed.answer ?? "").trim(),
        sources,
        suggested_questions: Array.isArray(parsed.suggested_questions)
          ? parsed.suggested_questions.slice(0, 4)
          : [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("chat function error:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
