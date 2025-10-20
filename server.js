// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /summarize endpoint
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body; // text extracted from Flutter Web

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    // Gemini API request
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate",
      {
        instances: [{ content: text }],
        parameters: {
          temperature: 0.2,
          maxOutputTokens: 256,
        },
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract summary
    const summary = response.data.predictions?.[0]?.content || "No summary generated";

    // Send summary back to Flutter Web
    res.json({ summary });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

