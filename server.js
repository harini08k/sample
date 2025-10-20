const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;  // text extracted from Flutter Web
    const response = await axios.post(
      "https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generate",
      { prompt: { text: text } },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );
    res.json(response.data); // send summary back to Flutter Web
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
