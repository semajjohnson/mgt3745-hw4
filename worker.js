// worker.js
// The whole server for The Pool. One row per track-and-person pair.

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

const maxTrackLength = 200;
const maxSourceLength = 60;

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (err) {
      return new Response("server error: " + err.message, { status: 500, headers: CORS });
    }
  },
};

function badRequest(message) {
  return new Response(message, { status: 400, headers: CORS });
}

async function handle(request, env) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (!env.DB) {
    return new Response(
      "server error: no D1 binding. Check database_id in wrangler.toml and redeploy.",
      { status: 500, headers: CORS });
  }

  // Dismissed rows stay in the table so a dismissed pair can never be re-added (A7).
  if (request.method === "GET" && url.pathname === "/entries") {
    const { results } = await env.DB.prepare(
      "SELECT id, track, source, created_at FROM entries WHERE dismissed = 0 ORDER BY id").all();
    return Response.json(results, { headers: CORS });
  }

  if (request.method === "POST" && url.pathname === "/entries") {
    let body;
    try {
      body = await request.json();
    } catch {
      return badRequest("body must be JSON");
    }

    const track = typeof body.track === "string" ? body.track.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() : "";

    // A8: an item with no person attached is indistinguishable from an
    // algorithmic suggestion, so it never reaches the table.
    if (!track) return badRequest("track required");
    if (!source) return badRequest("source required");
    if (track.length > maxTrackLength) return badRequest("track too long");
    if (source.length > maxSourceLength) return badRequest("source too long");

    const existing = await env.DB.prepare(
      "SELECT dismissed FROM entries WHERE LOWER(track) = LOWER(?) AND LOWER(source) = LOWER(?)")
      .bind(track, source).first();

    if (existing) {
      // A7: a dismissed pair is refused rather than re-added.
      if (existing.dismissed) return badRequest("that track was dismissed from that person");
      // A9: the same person cannot recommend the same track twice.
      return badRequest("that track is already in the pool from that person");
    }

    await env.DB.prepare("INSERT INTO entries (track, source) VALUES (?, ?)")
      .bind(track, source).run();
    return new Response(null, { status: 201, headers: CORS });
  }

  // Dismissal marks the row instead of deleting it, which is what makes A7 enforceable.
  const dismissMatch = url.pathname.match(/^\/entries\/(\d+)\/dismiss$/);
  if (request.method === "POST" && dismissMatch) {
    const result = await env.DB.prepare(
      "UPDATE entries SET dismissed = 1 WHERE id = ?").bind(dismissMatch[1]).run();
    if (!result.meta.changes) return new Response("not found", { status: 404, headers: CORS });
    return new Response(null, { status: 204, headers: CORS });
  }

  return new Response("not found", { status: 404, headers: CORS });
}