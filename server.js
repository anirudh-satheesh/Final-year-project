import ollama, { Ollama } from 'ollama';
import express from 'express';
import cors from 'cors';

import graphPrompt from './prompts/graphPrompt.js';
import roadmapPrompt from './prompts/roadmapPrompt.js';
import lessonPrompt from './prompts/lessonPrompt.js';
import topoSort from './utils/topoSort.js';

const app = express();
app.use(cors());
app.use(express.json());

const ollamaClient = new Ollama({ host: "https://2d1be11a6eda.ngrok-free.app/" });

// 🔹 Single helper function to talk to Ollama
async function askLLM(prompt, model = "qwen3:14b") {
  const res = await ollamaClient.chat({
    model,
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  let output = res.message.content;

  // Remove code block markers if LLM adds them
  output = output.replace(/```json|```/g, "").trim();

  // Try to extract JSON array/object from messy text
  const jsonMatch = output.match(/(\[.*\]|\{.*\})/s);
  if (jsonMatch) {
    output = jsonMatch[1];
  }

  try {
    return JSON.parse(output);
  } catch (err) {
    console.error("❌ Invalid JSON from model:", output);
    throw new Error("Model returned invalid JSON");
  }
}

// 🔹 Generate skill graph
app.post("/api/graph", async (req, res) => {
  try {
    const { subject } = req.body;
    let graph = await askLLM(graphPrompt(subject));

    // Run topoSort to order nodes properly
    if (Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
      graph.ordered = topoSort(graph.nodes, graph.edges);
    }

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Graph generation failed" });
  }
});

// 🔹 Generate roadmap
app.post("/api/roadmap", async (req, res) => {
  try {
    const { subject } = req.body;
    const roadmap = await askLLM(roadmapPrompt(subject), "qwen3:14b");
    res.json(roadmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Roadmap generation failed" });
  }
});

// 🔹 Generate lesson
app.post("/api/lesson", async (req, res) => {
  try {
    const { topic } = req.body;
    const lesson = await askLLM(lessonPrompt(topic), "qwen3:14b");
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lesson generation failed" });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
