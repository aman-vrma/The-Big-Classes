export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });
  }

  const { prompt, imageBase64, wantJson } = req.body;

  const parts = [{ text: prompt }];
  if (imageBase64) {
    const base64Data = imageBase64.split(",")[1] || imageBase64;
    parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
  }

  try {
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
      return res.status(response.status).json({ error: data?.error?.message || "Gemini request failed" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Network error" });
  }
}