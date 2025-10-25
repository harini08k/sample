const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  const response = await fetch("https://api.openai.com/v1/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify({ prompt: text })
  });
  const data = await response.json();
  res.json(data);
});

app.post("/ask", async (req, res) => {
  const { text, question } = req.body;
  const prompt = `Document: ${text}\nQuestion: ${question}\nAnswer based on document:`;
  const response = await fetch("https://api.openai.com/v1/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));



