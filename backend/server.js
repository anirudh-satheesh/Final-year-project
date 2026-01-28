import express from 'express';
import cors from 'cors';
import ollama from 'ollama';
import topoSort from '../utils/topoSort.js';
import graphPrompt from '../prompts/graphPrompt.js';
import roadmapPrompt from '../prompts/roadmapPrompt.js';

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Helper function to normalize roadmap data from various formats
function normalizeRoadmapData(rawData, subject) {
  console.log('🔵 [NORMALIZE] Raw data type:', typeof rawData);
  console.log('🔵 [NORMALIZE] Raw data keys:', typeof rawData === 'object' ? Object.keys(rawData) : 'not an object');
  
  // Case 1: Already correct format with items array
  if (rawData.items && Array.isArray(rawData.items)) {
    console.log('✅ [NORMALIZE] Format detected: items array (correct format)');
    return rawData;
  }
  
  // Case 2: Object with topic names as keys (current buggy format)
  // e.g., { "Data Science Basics": { description: "...", difficulty: "..." }, ... }
  if (typeof rawData === 'object' && rawData !== null && !Array.isArray(rawData) && !rawData.items) {
    const keys = Object.keys(rawData);
    const hasStringKeys = keys.every(k => typeof rawData[k] === 'object');
    
    if (hasStringKeys && keys.length > 0) {
      console.log('⚠️ [NORMALIZE] Format detected: object with topic names as keys (needs conversion)');
      console.log('📋 [NORMALIZE] Topics found:', keys);
      
      const items = keys.map((key, index) => {
        const topicData = rawData[key];
        return {
          id: index + 1,
          title: key,
          description: topicData.description || `Learn about ${key}`,
          estimatedTime: topicData.estimatedTime || topicData.est_time || '2 hours',
          difficulty: topicData.difficulty || 'Beginner',
          completed: false
        };
      });
      
      console.log('✅ [NORMALIZE] Converted to items array format');
      console.log('📊 [NORMALIZE] Items count:', items.length);
      
      return {
        title: `${subject} Learning Roadmap`,
        description: `A comprehensive roadmap to master ${subject}`,
        items: items
      };
    }
  }
  
  // Case 3: Array format (LLM returns array directly)
  if (Array.isArray(rawData)) {
    console.log('⚠️ [NORMALIZE] Format detected: direct array (needs conversion)');
    
    const items = rawData.map((item, index) => ({
      id: index + 1,
      title: item.title || item.name || `Topic ${index + 1}`,
      description: item.description || `Learn about ${item.title || item.name || 'this topic'}`,
      estimatedTime: item.estimatedTime || item.est_time || '2 hours',
      difficulty: item.difficulty || 'Beginner',
      completed: false
    }));
    
    return {
      title: `${subject} Learning Roadmap`,
      description: `A comprehensive roadmap to master ${subject}`,
      items: items
    };
  }
  
  // Case 4: Unknown format - try to salvage
  console.warn('⚠️ [NORMALIZE] Unknown format, attempting salvage...');
  console.log('📋 [NORMALIZE] Raw data preview:', JSON.stringify(rawData).substring(0, 200));
  
  // Return a minimal valid structure
  return {
    title: `${subject} Learning Roadmap`,
    description: `A comprehensive roadmap to master ${subject}`,
    items: [
      {
        id: 1,
        title: `${subject} Basics`,
        description: `Learn the fundamental concepts of ${subject}`,
        estimatedTime: "2 hours",
        difficulty: "Beginner",
        completed: false
      }
    ]
  };
}

// 🔹 Single helper function to talk to Ollama
async function askLLM(prompt, model = process.env.LLM_MODEL || "llama3.2:latest") {
  let res;
  try {
    res = await ollama.chat({
      model,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    if (err.cause && err.cause.code === 'ECONNREFUSED') {
      throw new Error("Ollama is not running. Please start it with 'ollama serve'.");
    }
    throw err;
  }

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
  console.log('🔵 [BACKEND] POST /api/graph - Received request');
  console.log('📋 [BACKEND] Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { subject } = req.body;
    console.log('🔵 [BACKEND] Calling LLM for graph with subject:', subject);
    
    let graph = await askLLM(graphPrompt(subject));
    
    console.log('✅ [BACKEND] LLM response received');
    console.log('📊 [BACKEND] Graph response:', JSON.stringify(graph, null, 2));

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
    console.error('❌ [BACKEND] Error in /api/graph:', err.message);
    res.status(500).json({ error: "Graph generation failed" });
  }
});

// 🔹 Generate personalized graph based on user skills
app.post("/api/personalized-graph", async (req, res) => {
  console.log('🔵 [BACKEND] POST /api/personalized-graph - Received request');
  console.log('📋 [BACKEND] Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { subject, userSkills } = req.body;
    console.log('🔵 [BACKEND] Subject:', subject);
    console.log('🔵 [BACKEND] User skills:', JSON.stringify(userSkills, null, 2));
    
    // Generate base graph
    console.log('🔵 [BACKEND] Calling LLM for personalized graph...');
    let graph = await askLLM(graphPrompt(subject));
    
    console.log('✅ [BACKEND] LLM response received');
    console.log('📊 [BACKEND] Raw graph response:', JSON.stringify(graph, null, 2));
    
    // Convert graph format to React Flow format based on skills
    if (graph.nodes && typeof graph.nodes === 'object') {
      // Convert from key-value format to array format
      const nodesArray = [];
      const edgesArray = [];
      const nodeKeys = Object.keys(graph.nodes);
      
      // Calculate positions based on prerequisites
      const positionMap = {};
      nodeKeys.forEach((key, index) => {
        positionMap[key] = {
          x: (index % 3) * 250 + Math.random() * 50,
          y: Math.floor(index / 3) * 150 + Math.random() * 50
        };
      });
      
      // Create nodes
      let idCounter = 1;
      nodeKeys.forEach((key, index) => {
        const nodeData = graph.nodes[key];
        const skillLevel = userSkills[key] || userSkills[subject] || 50;
        const difficulty = skillLevel < 33 ? 'beginner' : skillLevel < 66 ? 'intermediate' : 'advanced';
        
        nodesArray.push({
          id: key,
          type: 'default',
          position: positionMap[key],
          data: {
            label: key,
            difficulty: nodeData.level || difficulty,
            description: `Learn ${key} - Est. time: ${nodeData.est_time || '2 weeks'}`,
            skills: skillLevel
          },
          style: {
            background: getNodeColor(nodeData.level || difficulty),
            color: 'white',
            border: '2px solid #fff',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '180px',
            textAlign: 'center'
          }
        });
        idCounter++;
      });
      
      // Create edges based on prerequisites
      nodeKeys.forEach((key) => {
        const nodeData = graph.nodes[key];
        if (nodeData.prerequisite) {
          edgesArray.push({
            id: `e${nodeData.prerequisite}-${key}`,
            source: nodeData.prerequisite,
            target: key,
            type: 'smoothstep',
            style: { stroke: '#64748b', strokeWidth: 2 },
            markerEnd: { type: 'arrowclosed', color: '#64748b' }
          });
        }
      });
      
      graph = { nodes: nodesArray, edges: edgesArray };
    }
    
    res.json(graph);
  } catch (err) {
    console.error('❌ [BACKEND] Error in /api/personalized-graph:', err.message);
    console.error('❌ [BACKEND] Stack:', err.stack);
    res.status(500).json({ error: "Personalized graph generation failed" });
  }
});

// Helper function to convert difficulty to color
function getNodeColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    case 'intermediate': return 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
    case 'advanced': return 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)';
    default: return 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)';
  }
}

function getNodeBorderColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return '#8b5cf6';
    case 'intermediate': return '#f43f5e';
    case 'advanced': return '#ef4444';
    default: return '#06b6d4';
  }
}

function getNodeShadow(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return '0 10px 25px -5px rgba(139, 92, 246, 0.3), 0 8px 10px -6px rgba(139, 92, 246, 0.2)';
    case 'intermediate': return '0 10px 25px -5px rgba(244, 63, 94, 0.3), 0 8px 10px -6px rgba(244, 63, 94, 0.2)';
    case 'advanced': return '0 10px 25px -5px rgba(239, 68, 68, 0.3), 0 8px 10px -6px rgba(239, 68, 68, 0.2)';
    default: return '0 10px 25px -5px rgba(6, 182, 212, 0.3), 0 8px 10px -6px rgba(6, 182, 212, 0.2)';
  }
}

// Convert roadmap items to React Flow nodes and edges
function convertToGraphFormat(roadmap) {
  console.log('🔵 [BACKEND] Converting roadmap to graph format...');
  
  if (!roadmap || !roadmap.items || !Array.isArray(roadmap.items)) {
    console.warn('⚠️ [BACKEND] Invalid roadmap format for conversion');
    return { nodes: [], edges: [] };
  }

  // Create nodes from items
  const nodes = roadmap.items.map((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    
    return {
      id: item.id.toString(),
      type: 'default',
      position: {
        x: col * 350 + 100,
        y: row * 200 + 100
      },
      data: {
        label: item.title,
        difficulty: item.difficulty,
        description: item.description,
        estimatedTime: item.estimatedTime,
        completed: item.completed || false
      },
      style: {
        background: getNodeColor(item.difficulty),
        color: '#ffffff',
        border: '2px solid',
        borderColor: getNodeBorderColor(item.difficulty),
        borderRadius: '16px',
        padding: '20px',
        fontSize: '15px',
        fontWeight: '700',
        minWidth: '220px',
        textAlign: 'center',
        boxShadow: getNodeShadow(item.difficulty),
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }
    };
  });

  // Create edges connecting sequential items
  const edges = roadmap.items.slice(0, -1).map((item, index) => ({
    id: `e${item.id}-${roadmap.items[index + 1].id}`,
    source: item.id.toString(),
    target: roadmap.items[index + 1].id.toString(),
    type: 'smoothstep',
    animated: true,
    style: { 
      stroke: '#3f3f46', 
      strokeWidth: 2.5,
      strokeDasharray: '5,5'
    },
    markerEnd: { 
      type: 'arrowclosed', 
      color: '#3f3f46',
      width: 20,
      height: 20
    }
  }));

  console.log('✅ [BACKEND] Conversion complete:', nodes.length, 'nodes,', edges.length, 'edges');
  
  return { nodes, edges };
}

// 🔹 Generate roadmap
app.post("/api/roadmap", async (req, res) => {
  console.log('🔵 [BACKEND] POST /api/roadmap - Received request');
  console.log('📋 [BACKEND] Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { subject } = req.body;
    console.log('🔵 [BACKEND] Calling LLM for roadmap with subject:', subject);
    
    const rawRoadmap = await askLLM(roadmapPrompt(subject), "llama3.2:latest");
    
    console.log('✅ [BACKEND] LLM response received');
    console.log('📊 [BACKEND] Raw roadmap response type:', typeof rawRoadmap);
    console.log('📊 [BACKEND] Raw roadmap keys:', Object.keys(rawRoadmap || {}));
    
    // Normalize the data to handle various LLM response formats
    const roadmap = normalizeRoadmapData(rawRoadmap, subject);
    
    console.log('✅ [BACKEND] Data normalized');
    console.log('📊 [BACKEND] Normalized roadmap has items?', Array.isArray(roadmap?.items));
    console.log('📊 [BACKEND] Items count:', roadmap?.items?.length);
    
    // Validate we have items
    if (!roadmap.items || !Array.isArray(roadmap.items) || roadmap.items.length === 0) {
      console.error('❌ [BACKEND] Normalization failed - no items array');
      throw new Error("Failed to normalize roadmap data - no items found");
    }
    
    // Convert to React Flow graph format (nodes and edges)
    const graphData = convertToGraphFormat(roadmap);
    
    console.log('📊 [BACKEND] Converted graph data:', JSON.stringify(graphData, null, 2));
    
    // Return both original roadmap and graph format
    res.json({
      ...roadmap,
      nodes: graphData.nodes,
      edges: graphData.edges
    });
  } catch (err) {
    console.error('❌ [BACKEND] Error in /api/roadmap:', err.message);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
