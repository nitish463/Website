/* ===================================================================
   Home Weavers — AI proxy (Cloudflare Worker)
   -------------------------------------------------------------------
   Purpose: keep your Anthropic API key OFF your public website.
   Your site calls THIS worker; the worker adds the secret key and
   forwards the request to Anthropic, then returns the answer.

   ----- ONE-TIME SETUP (about 5 minutes) -----
   1. Get an API key: https://console.anthropic.com  ->  API Keys.
      (Optional but smart: set a monthly spend limit in Billing.)
   2. Cloudflare (free): dashboard.cloudflare.com -> Workers & Pages
      -> Create application -> Create Worker -> name it e.g.
      "home-weavers-ai" -> Deploy.
   3. Click "Edit code", delete the sample, paste THIS whole file,
      then Deploy.
   4. Worker -> Settings -> Variables and Secrets -> add a secret:
        Name:  ANTHROPIC_API_KEY
        Value: (paste your Anthropic key)   -> Encrypt -> Save.
   5. Copy the worker URL shown at the top, e.g.
        https://home-weavers-ai.YOURNAME.workers.dev
   6. In your store: Admin -> Marketing -> "AI endpoint" -> paste that
      URL -> Save. The AI buttons now work on your live site.
   =================================================================== */

const ALLOWED_ORIGIN = "https://nitish463.github.io"; // your site's origin

export default {
  async fetch(request, env) {
    // Browser preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST" }, 405);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Invalid JSON" }, 400); }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "Server missing ANTHROPIC_API_KEY" }, 500);
    }

    // Forward to Anthropic with the secret key attached server-side.
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-6",
        max_tokens: body.max_tokens || 1000,
        system: body.system || "",
        messages: body.messages || [],
      }),
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": "application/json", ...cors() },
    });
  },
};

function cors() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { "content-type": "application/json", ...cors() },
  });
}
