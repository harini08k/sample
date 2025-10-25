import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ CORS setup
app.use(cors({
  origin: "*", // or restrict to your Flutter web origin like: "https://yourapp.web.app"
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight requests explicitly
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Route
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Default route to test
app.get("/", (req, res) => {
  res.send("✅ Gemini backend is running fine!");
});

// ✅ Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

