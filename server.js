// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https"; // ✅ add this at the top

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Create HTTPS agent that ignores invalid certs
const agent = new https.Agent({ rejectUnauthorized: false }); // ✅ add this after imports

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    
    // Use axios with the custom HTTPS agent
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate
",
      { prompt: { text: text } },
      {
        headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` },
        httpsAgent: agent // ✅ add this here
      }
    );

    res.json(response.data); // send summary back
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



