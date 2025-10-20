import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Root route for testing
app.get("/", (req, res) => {
  res.send("✅ Gemini backend is running!");
});

// Summarize route
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Missing text input" });

    // GEMINI_API_KEY from Railway env variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

    // ✅ Use a valid Gemini model
    const response = await fetch(
      "https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: { text: text },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    // Extract summary from Gemini API response
    const summary = data?.candidates?.[0]?.output || "No summary generated";

    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



