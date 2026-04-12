import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const client = new Anthropic({ apiKey: process.env.CLAUDE_RESUME_AGENT });

function chunkText(text, chunkSize = 900, overlap = 120) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

function scoreChunk(q, chunk) {
  const words = q.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const hay = chunk.toLowerCase();
  let score = 0;
  for (const w of words) if (hay.includes(w)) score += 1;
  return score;
}

function loadKnowledgeBase() {
  const dir = path.resolve("content");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
  const docs = files.map((f) => ({
    name: f,
    text: fs.readFileSync(path.join(dir, f), "utf8")
  }));
  return docs;
}

const KB_STATIC = loadKnowledgeBase();

async function loadBlobContent() {
  try {
    const store = getStore({ name: "knowledge-base", consistency: "strong" });
    const { blobs } = await store.list();
    const docs = [];
    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: "json" });
      if (data) {
        docs.push({ name: data.name, text: data.text });
      }
    }
    return docs;
  } catch {
    return [];
  }
}

function buildChunks(docs) {
  return docs.flatMap(doc =>
    chunkText(doc.text).map((c, idx) => ({
      id: `${doc.name}#${idx + 1}`,
      doc: doc.name,
      text: c
    }))
  );
}

function retrieve(chunks, query, k = 6) {
  const scored = chunks
    .map(ch => ({ ...ch, score: scoreChunk(query, ch.text) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  const fallback = scored.every(s => s.score === 0);
  if (fallback) {
    const preferred = chunks.filter(ch => ["about.md", "faq.md"].includes(ch.doc)).slice(0, k);
    return preferred.length ? preferred : scored;
  }
  return scored;
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message, history = [] } = await req.json();

    // Combine static files with dynamically uploaded Blob content
    const blobDocs = await loadBlobContent();
    const allDocs = [...KB_STATIC, ...blobDocs];
    const allChunks = buildChunks(allDocs);

    const top = retrieve(allChunks, message, 7);
    const context = top.map(t => `SOURCE: ${t.doc}\n${t.text}`).join("\n\n---\n\n");
    const sources = [...new Set(top.map(t => t.doc))];

    const systemPrompt = `Du är en rekryterar-assistent som representerar kandidaten Mattias Willner.
Du pratar alltid OM Mattias i tredje person (han/Mattias). Du får aldrig skriva "jag", "mig", "min" när du beskriver Mattias.
Om frågan gäller något personligt som inte finns i källorna: säg att du inte vet och föreslå att kontakta Mattias direkt.

Regler:
- Svara ENDAST med stöd av källorna i CONTEXT. Hitta inte på.
- Om information saknas: säg det tydligt och föreslå att rekryteraren kontaktar Mattias.
- Dela aldrig känsliga personuppgifter.
- Svara kort, konkret och professionellt.
- Avsluta med 2–4 förslag på följdfrågor.
Returnera svaret i JSON med nycklarna: answer, suggested_questions (array).`;

    const trimmedHistory = history.slice(-8).map(m => ({
      role: m.role,
      content: m.content
    }));

    const messages = [
      {
        role: "user",
        content:
`CONTEXT:
${context}

CHAT HISTORY:
${trimmedHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

QUESTION:
${message}

Svara som JSON: {"answer":"...","suggested_questions":["...","..."]}`
      }
    ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages
    });

    const text = response.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("");

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { answer: text || "Jag kunde inte skapa ett svar just nu.", suggested_questions: [] };
    }

    return new Response(
      JSON.stringify({
        answer: parsed.answer?.trim() || "",
        sources,
        suggested_questions: Array.isArray(parsed.suggested_questions) ? parsed.suggested_questions : []
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message || "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
