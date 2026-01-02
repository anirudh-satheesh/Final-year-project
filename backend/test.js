import ollama from 'ollama';

import graphPrompt from './prompts/graphPrompt.js';
import topoSort from './utils/topoSort.js';
import roadmapPrompt from './prompts/roadmapPrompt.js';


async function askLLM(prompt) {
  const res = await ollama.chat({
    model: 'llama3.2',
    temperature: 0,
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  let output = res.message.content.trim();

  // Remove code fences if present
  output = output.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(output);
  } catch (err) {
    console.error("❌ Failed to parse JSON:", output);
    return null;
  }
}

// const result = askLLM(graphPrompt("Web Development"))



 const graph = {
  "Web Development Basics": {
    "prerequisites": [],
    "level": "beginner",
    "est_time": "2 weeks"
  },
  "HTML Fundamentals": {
    "prerequisites": ["Web Development Basics"],
    "level": "beginner",
    "est_time": "3 days"
  },
  "CSS Syntax": {
    "prerequisites": ["HTML Fundamentals"],
    "level": "intermediate",
    "est_time": "1 week"
  },
  "JavaScript Basics": {
    "prerequisites": ["Web Development Basics", "HTML Fundamentals", "CSS Syntax"],
    "level": "beginner",
    "est_time": "4 weeks"
  },
  "React Introduction": {
    "prerequisites": ["JavaScript Basics", "CSS Syntax"],
    "level": "intermediate",
    "est_time": "2 weeks"
  },
  "Frontend Frameworks": {
    "prerequisites": ["React Introduction", "JavaScript Basics", "CSS Syntax"],
    "level": "advanced",
    "est_time": "6 weeks"
  },
  "Backend Fundamentals": {
    "prerequisites": ["Web Development Basics", "HTML Fundamentals", "CSS Syntax"],
    "level": "beginner",
    "est_time": "5 weeks"
  },
  "Node.js Introduction": {
    "prerequisites": ["JavaScript Basics", "CSS Syntax", "Backend Fundamentals"],
    "level": "intermediate",
    "est_time": "3 weeks"
  },
  "Database Systems": {
    "prerequisites": ["Backend Fundamentals"],
    "level": "intermediate",
    "est_time": "4 weeks"
  },
  "API Design": {
    "prerequisites": ["Frontend Frameworks", "Node.js Introduction", "Database Systems"],
    "level": "advanced",
    "est_time": "8 weeks"
  },
  "Web Security": {
    "prerequisites": ["Frontend Frameworks", "Backend Fundamentals", "API Design"],
    "level": "advanced",
    "est_time": "6 weeks"
  },
  "Testing and Debugging": {
    "prerequisites": ["Frontend Frameworks", "Backend Fundamentals", "API Design", "Web Security"],
    "level": "intermediate",
    "est_time": "5 weeks"
  }
}
 const userSkills = {
	"HTML": 0.8
  }

// Decide needed topics
const needed = Object.keys(graph).filter(t => (userSkills[t] || 0) < 0.6);
const orderedTopics = topoSort(graph, needed);

// Ask AI to describe them
const roadmap = await askLLM(roadmapPrompt(graph, userSkills));
console.log({ order: orderedTopics, details: roadmap });