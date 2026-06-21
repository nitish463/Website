/* ============================================================
   Home Weavers — IMAGE proxy (Cloudflare Worker)
   ------------------------------------------------------------
   Generates real images for your store using OpenAI's image API.
   Your site calls THIS worker; the worker adds your secret
   OpenAI key and returns the finished picture.

   NOTE: This is a SEPARATE provider from your text AI.
   Claude/Anthropic cannot generate images, so image generation
   uses OpenAI here. You can swap in another provider later.

   ----- ONE-TIME SETUP (about 5 minutes) -----
   1. Get an OpenAI API key: https://platform.openai.com -> API keys.
      Add a little credit (Billing) — images cost a few cents each.
   2. Cloudflare (free): dashboard.cloudflare.com -> Workers & Pages
      -> Create application -> Create Worker -> name it e.g.
      "home-weavers-image" -> Deploy.
   3. Click "Edit code", delete the sample, paste THIS whole file,
      then Deploy.
   4. Worker -> Settings -> Variables and Secrets -> add a secret:
        Name:  OPENAI_API_KEY
        Value: (paste your OpenAI key)   -> Encrypt -> Save.
   5. Copy the worker URL shown at the top, e.g.
        https://home-weavers-image.YOURNAME.workers.dev
   6. In your store: Admin -> Marketing -> "Image endpoint" -> paste
      that URL -> Save. The 🎨 Generate image buttons now work.
   ============================================================ */

const ALLOWED_ORIGIN = "https://nitish463.github.io"; // your site's origin

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST" }, 405);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Invalid JSON" }, 400); }

    if (!env.OPENAI_API_KEY) {
      return json({ error: "Server missing OPENAI_API_KEY" }, 500);
    }

    const prompt = (body.prompt || "").toString().slice(0, 4000);
    const size = body.size || "1024x1024";
    if (!prompt) return json({ error: "Missing prompt" }, 400);

    try {
      const upstream = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          size: size,
          n: 1,
        }),
      });

      const data = await upstream.json();

      if (!upstream.ok) {
        const msg = (data && data.error && data.error.message) || "Image API error";
        return json({ error: msg }, upstream.status);
      }

      const first = data && data.data && data.data[0];
      if (first && first.b64_json) {
        return json({ image: "data:image/png;base64," + first.b64_json });
      }
      if (first && first.url) {
        return json({ url: first.url });
      }
      return json({ error: "No image returned" }, 502);
    } catch (e) {
      return json({ error: "Upstream request failed: " + (e && e.message) }, 502);
    }
  },
};

function cors() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}
