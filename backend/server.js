import express from 'express';
import cors from 'cors';
import ollama from 'ollama';
import topoSort from '../utils/topoSort.js';
import graphPrompt from '../prompts/graphPrompt.js';
import roadmapPrompt from '../prompts/roadmapPrompt.js';

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Single helper function to talk to Ollama
async function askLLM(prompt, model = "llama3.2:latest") {
  const res = await ollama.chat({
    model,
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  let output = res.message.content;

  // Remove code block markers if LLM adds them
  output = output.replace(/```json|```/g, "").trim();

  // Extract JSON: find first '{' or '[' and last '}' or ']'
  const firstOpen = output.search(/[\{\[]/);
  if (firstOpen !== -1) {
    const isArray = output[firstOpen] === '[';
    const lastClose = output.lastIndexOf(isArray ? ']' : '}');
    if (lastClose !== -1) {
      output = output.substring(firstOpen, lastClose + 1);
    }
  }

  try {
    return JSON.parse(output);
  } catch (err) {
    console.error("❌ Invalid JSON from model:", output);
    throw new Error("Model returned invalid JSON");
  }
}

// 🔹 Mock AI responses for development
function generateMockGraph(subject) {
  const nodes = [
    { id: '1', data: { label: `${subject} Basics`, level: 1 }, position: { x: 100, y: 100 } },
    { id: '2', data: { label: `${subject} Fundamentals`, level: 1 }, position: { x: 300, y: 100 } },
    { id: '3', data: { label: `Advanced ${subject}`, level: 2 }, position: { x: 200, y: 250 } },
    { id: '4', data: { label: `${subject} Projects`, level: 3 }, position: { x: 200, y: 400 } },
  ];

  const edges = [
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
  ];

  return { nodes, edges };
}

function generateMockRoadmap(subject) {
  return {
    title: `${subject} Learning Roadmap`,
    description: `A comprehensive roadmap to master ${subject}`,
    items: [
      {
        id: 1,
        title: `${subject} Basics`,
        description: `Learn the fundamental concepts of ${subject}`,
        estimatedTime: '2 hours',
        difficulty: 'Beginner',
        completed: false
      },
      {
        id: 2,
        title: `${subject} Core Concepts`,
        description: `Dive deeper into core ${subject} concepts`,
        estimatedTime: '4 hours',
        difficulty: 'Intermediate',
        completed: false
      },
      {
        id: 3,
        title: `Advanced ${subject}`,
        description: `Master advanced ${subject} techniques`,
        estimatedTime: '6 hours',
        difficulty: 'Advanced',
        completed: false
      },
      {
        id: 4,
        title: `${subject} Projects`,
        description: `Build real-world projects with ${subject}`,
        estimatedTime: '8 hours',
        difficulty: 'Advanced',
        completed: false
      }
    ]
  };
}

function generateMockLesson(topic) {
  return {
    title: `Understanding ${topic}`,
    estimatedTime: '30 min',
    sections: [
      {
        title: 'Introduction',
        type: 'text',
        content: `Welcome to the lesson on ${topic}. This comprehensive guide will walk you through the key concepts and practical applications.`
      },
      {
        title: 'Key Concepts',
        type: 'list',
        items: [
          `Core principles of ${topic}`,
          `Common patterns and best practices`,
          `Real-world applications`,
          `Tools and frameworks`
        ]
      },
      {
        title: 'Code Example',
        type: 'code',
        content: `// Example code for ${topic}\nconsole.log('Hello, ${topic}!');\n\nfunction example() {\n  return 'This is a sample function';\n}`
      },
      {
        title: 'Important Note',
        type: 'warning',
        content: `Remember to always follow best practices when working with ${topic}. Consistency and proper documentation are key to maintainable code.`
      },
      {
        title: 'Pro Tip',
        type: 'tip',
        content: `Practice regularly and don't be afraid to experiment. The best way to learn ${topic} is through hands-on experience.`
      }
    ]
  };
}

// 🔹 Generate skill graph
app.post("/api/graph", async (req, res) => {
  try {
    const { subject } = req.body;
    let graph = await askLLM(graphPrompt(subject));

    // Run topoSort to order nodes properly
    if (Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
      try {
        graph.ordered = topoSort(graph.nodes, graph.edges);
      } catch (err) {
        console.error("⚠️ TopoSort failed, returning unordered graph:", err.message);
      }
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
    const roadmap = await askLLM(roadmapPrompt(subject), "llama3.2:latest");
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
    const lesson = generateMockLesson(topic);
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lesson generation failed" });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
