import { getStore } from "@netlify/blobs";

function getContentStore() {
  return getStore({ name: "knowledge-base", consistency: "strong" });
}

// Normalize name for comparison (lowercase, trimmed)
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\.md$/, "");
}

export default async (req) => {
  const url = new URL(req.url);
  const store = getContentStore();

  // GET — list all content entries
  if (req.method === "GET") {
    const { blobs } = await store.list();
    const entries = [];
    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: "json" });
      if (data) {
        entries.push({ key: blob.key, name: data.name, text: data.text });
      }
    }
    return new Response(JSON.stringify({ entries }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST — add a new content entry (reject duplicates)
  if (req.method === "POST") {
    const { name, text } = await req.json();

    if (!name?.trim() || !text?.trim()) {
      return new Response(
        JSON.stringify({ error: "Both 'name' and 'text' are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalizedNew = normalizeName(name);

    // Check all existing entries for a duplicate name
    const { blobs } = await store.list();
    for (const blob of blobs) {
      const existing = await store.get(blob.key, { type: "json" });
      if (existing && normalizeName(existing.name) === normalizedNew) {
        return new Response(
          JSON.stringify({
            error: `A content entry with the name "${existing.name}" already exists. Duplicates are not allowed.`,
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Use normalized name as the key for easy lookup
    const key = normalizedNew;
    await store.setJSON(key, { name: name.trim(), text: text.trim() });

    return new Response(
      JSON.stringify({ success: true, key, name: name.trim() }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }

  // DELETE — remove a content entry by key
  if (req.method === "DELETE") {
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response(
        JSON.stringify({ error: "Query parameter 'key' is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await store.delete(key);
    return new Response(JSON.stringify({ success: true, deleted: key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};
