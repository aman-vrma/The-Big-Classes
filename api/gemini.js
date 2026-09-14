async function callGemini(prompt, imageBase64, wantJson) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Server missing GEMINI_API_KEY");

  const parts = [{ text: prompt }];
  if (imageBase64) {
    const base64Data = imageBase64.split(",")[1] || imageBase64;
    parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts }],
    ...(wantJson ? { generationConfig: { responseMimeType: "application/json" } } : {}),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }
  return data; // already in the { candidates: [{ content: { parts: [{ text }] } }] } shape
}

// Fallback provider — used automatically if Gemini fails (quota, outage, etc).
// Response is reshaped into the same { candidates: [...] } format Gemini returns,
// so the frontend (lib/gemini.ts) never needs to know which provider answered.
async function callOpenRouter(prompt, imageBase64, wantJson) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Server missing OPENROUTER_API_KEY");

  const content = [{ type: "text", text: prompt }];
  if (imageBase64) {
    const base64Data = imageBase64.split(",")[1] || imageBase64;
    content.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } });
  }

  const body = {
    model: "google/gemini-2.0-flash-exp:free",
    messages: [{ role: "user", content }],
    ...(wantJson ? { response_format: { type: "json_object" } } : {}),
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenRouter request failed");
  }

  const text = data?.choices?.[0]?.message?.content || "";
  return { candidates: [{ content: { parts: [{ text }] } }] };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, imageBase64, wantJson } = req.body;

  try {
    const data = await callGemini(prompt, imageBase64, wantJson);
    return res.status(200).json(data);
  } catch (geminiErr) {
    console.error("Gemini failed, falling back to OpenRouter:", geminiErr.message);
    try {
      const data = await callOpenRouter(prompt, imageBase64, wantJson);
      return res.status(200).json(data);
    } catch (openRouterErr) {
      console.error("OpenRouter fallback also failed:", openRouterErr.message);
      return res.status(500).json({
        error: `Both providers failed. Gemini: ${geminiErr.message} | OpenRouter: ${openRouterErr.message}`,
      });
    }
  }
}