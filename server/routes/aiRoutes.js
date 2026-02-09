const express = require("express");
const router = express.Router();
const axios = require("axios");

const OPENROUTER_API_KEY = process.env.API_KEY;
const SITE_URL = "http://localhost:3000"; // Replace with your actual site URL
const SITE_NAME = "Zedit";

router.post("/transform", async (req, res) => {
  const { text, operation, tone } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  let prompt = "";
  if (operation === "summarize") {
    prompt = `Summarize the following text concisely:\n\n"${text}"`;
  } else if (operation === "tone") {
    prompt = `Rewrite the following text in a ${tone} tone:\n\n"${text}"`;
  } else {
    return res.status(400).json({ message: "Invalid operation" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // Or any other model supported by OpenRouter
        messages: [
          {
            role: "system",
            content: "You are a helpful writing assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
      },
    );

    const transformedText = response.data.choices[0].message.content;
    res.json({ result: transformedText });
  } catch (error) {
    console.error(
      "AI API Error:",
      error.response ? error.response.data : error.message,
    );
    res
      .status(500)
      .json({ message: "Failed to process text", error: error.message });
  }
});

module.exports = router;
