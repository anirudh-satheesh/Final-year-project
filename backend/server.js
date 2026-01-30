import express from 'express';
import cors from 'cors';
import ollama from 'ollama';
import topoSort from '../utils/topoSort.js';
import graphPrompt from '../prompts/graphPrompt.js';
import roadmapPrompt from '../prompts/roadmapPrompt.js';
import chatPrompt from '../prompts/chatPrompt.js';
import { topicOverviewPrompt } from '../prompts/topicOverviewPrompt.js';
import lessonPrompt from '../prompts/lessonPrompt.js';
import { assessmentPrompt } from '../prompts/assessmentPrompt.js';

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 In-memory cache for assessments and roadmaps
const assessmentCache = new Map();
const roadmapCache = new Map();
const CACHE_STATS = {
  assessment: { hits: 0, misses: 0 },
  roadmap: { hits: 0, misses: 0 }
};

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
          completed: false,
          lesson: topicData.lesson || null,
          overview: topicData.overview || null
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
      completed: false,
      lesson: item.lesson || null,
      overview: item.overview || null
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
async function askLLM(prompt, model = process.env.LLM_MODEL || "llama3.2:latest", temperature = 0) {
  let res;
  try {
    res = await ollama.chat({
      model,
      temperature,
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
app.post("/internal/fetch-graph", async (req, res) => {
  console.log('🔵 [BACKEND] POST /internal/fetch-graph - Received request');
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
    console.error('❌ [BACKEND] Error in /internal/fetch-graph:', err.message);
    res.status(500).json({ error: "Graph generation failed" });
  }
});

// 🔹 Generate personalized graph based on user skills
app.post("/internal/custom-graph", async (req, res) => {
  console.log('🔵 [BACKEND] POST /internal/custom-graph - Received request');
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
    let nodesMap = graph;

    // Check if the graph is wrapped in a "nodes" key or subject key
    if (graph.nodes && typeof graph.nodes === 'object' && !Array.isArray(graph.nodes)) {
      nodesMap = graph.nodes;
    } else {
      // Check for subject wrapper (single key containing the actual graph)
      const keys = Object.keys(graph);
      if (keys.length === 1) {
        const potentialRoot = graph[keys[0]];
        // If the value is an object and looks like it contains nodes (keys map to objects with 'level' or 'prerequisite')
        if (typeof potentialRoot === 'object' && potentialRoot !== null) {
          const innerKeys = Object.keys(potentialRoot);
          if (innerKeys.length > 0 && typeof potentialRoot[innerKeys[0]] === 'object') {
            const sampleNode = potentialRoot[innerKeys[0]];
            if (sampleNode.level || sampleNode.prerequisite || sampleNode.est_time) {
              console.log(`⚠️ [BACKEND] Detected wrapped graph structure. Unwrapping key: ${keys[0]}`);
              nodesMap = potentialRoot;
            }
          }
        }
      }
    }

    // Verify we have a valid map (keys are strings, values are objects)
    const nodeKeys = Object.keys(nodesMap);
    const isValidMap = nodeKeys.length > 0 && typeof nodesMap[nodeKeys[0]] === 'object';

    if (isValidMap) {
      console.log('✅ [BACKEND] Converting key-value graph to nodes/edges...');

      // Convert from key-value format to array format
      const nodesArray = [];
      const edgesArray = [];

      // Calculate positions based on prerequisites (simple grid layout)
      const positionMap = {};
      nodeKeys.forEach((key, index) => {
        positionMap[key] = {
          x: (index % 3) * 300 + 100,
          y: Math.floor(index / 3) * 200 + 100
        };
      });

      // Create nodes
      nodeKeys.forEach((key) => {
        const nodeData = nodesMap[key];
        const skillLevel = userSkills[key] !== undefined ? userSkills[key] : (userSkills[subject] !== undefined ? userSkills[subject] : 0.5);

        // Determine difficulty/color based on skill or node level
        let difficulty = 'beginner';
        if (nodeData.level) {
          difficulty = nodeData.level.toLowerCase();
        } else {
          difficulty = skillLevel < 0.33 ? 'beginner' : skillLevel < 0.66 ? 'intermediate' : 'advanced';
        }

        nodesArray.push({
          id: key, // Use topic name as ID for easier linking
          type: 'default',
          position: positionMap[key],
          data: {
            label: key,
            difficulty: difficulty,
            description: `Learn ${key} - Est. time: ${nodeData.est_time || '2 weeks'}`,
            skills: skillLevel,
            estimatedTime: nodeData.est_time,
            lesson: null, // Placeholder
            overview: null // Placeholder
          },
          style: {
            background: getNodeColor(difficulty),
            color: 'white',
            border: `2px solid ${getNodeBorderColor(difficulty)}`,
            borderRadius: '24px',
            padding: '24px',
            fontSize: '15px',
            fontWeight: 'bold',
            minWidth: '220px',
            textAlign: 'center',
            boxShadow: getNodeShadow(difficulty)
          }
        });
      });

      // Create edges based on prerequisites
      nodeKeys.forEach((key) => {
        const nodeData = nodesMap[key];
        if (nodeData.prerequisite && nodesMap[nodeData.prerequisite]) {
          edgesArray.push({
            id: `e${nodeData.prerequisite}-${key}`,
            source: nodeData.prerequisite,
            target: key,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#64748b', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: { type: 'arrowclosed', color: '#64748b' }
          });
        }
      });

      graph = { nodes: nodesArray, edges: edgesArray };
      console.log(`✅ [BACKEND] Graph conversion complete: ${nodesArray.length} nodes, ${edgesArray.length} edges.`);
    } else {
      console.warn('⚠️ [BACKEND] Could not identify valid graph structure. Sending raw data.');
    }

    res.json(graph);
  } catch (err) {
    console.error('❌ [BACKEND] Error in /internal/custom-graph:', err.message);
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
// Convert tree-structured roadmap items to React Flow nodes and edges
function convertToGraphFormat(roadmap) {
  console.log('🔵 [BACKEND] Converting tree roadmap to graph format...');

  if (!roadmap || !roadmap.items || !Array.isArray(roadmap.items)) {
    console.warn('⚠️ [BACKEND] Invalid roadmap format for conversion');
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  // Create a map for easy lookup and to track levels
  const itemsMap = {};
  roadmap.items.forEach(item => { itemsMap[item.id] = { ...item, children: [] } });

  // Build parent-child relationships and find depth
  const root = roadmap.items.find(item => !item.parentId);
  if (!root) return { nodes: [], edges: [] };

  roadmap.items.forEach(item => {
    if (item.parentId && itemsMap[item.parentId]) {
      itemsMap[item.parentId].children.push(item.id);
    }
  });

  // Basic BFS to assign levels (depth) for positioning
  const levels = {};
  const queue = [{ id: root.id, depth: 0 }];
  while (queue.length > 0) {
    const { id, depth } = queue.shift();
    levels[depth] = (levels[depth] || []);
    levels[depth].push(id);
    itemsMap[id].depth = depth;

    itemsMap[id].children.forEach(childId => {
      queue.push({ id: childId, depth: depth + 1 });
    });
  }

  // Position nodes based on level and index in level
  const LEVEL_HEIGHT = 280;
  const NODE_WIDTH = 350;

  roadmap.items.forEach(item => {
    const depth = itemsMap[item.id].depth || 0;
    const levelNodes = levels[depth];
    const indexInLevel = levelNodes.indexOf(item.id);
    const totalInLevel = levelNodes.length;

    // Center the level
    const xOffset = (indexInLevel - (totalInLevel - 1) / 2) * NODE_WIDTH + 400;
    const yPosition = depth * LEVEL_HEIGHT + 50;

    let style = {
      color: '#ffffff',
      border: '2px solid',
      borderRadius: '24px',
      fontSize: '15px',
      fontWeight: '700',
      textAlign: 'center',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
    };

    if (depth === 0) {
      style = {
        ...style,
        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        borderColor: '#06b6d4',
        padding: '40px',
        fontSize: '28px',
        minWidth: '450px',
        boxShadow: '0 0 70px rgba(6, 182, 212, 0.5), inset 0 0 30px rgba(255,255,255,0.2)',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      };
    } else {
      style = {
        ...style,
        background: getNodeColor(item.difficulty),
        borderColor: getNodeBorderColor(item.difficulty),
        padding: '24px',
        minWidth: '260px',
        boxShadow: getNodeShadow(item.difficulty),
        opacity: 0.98,
        fontSize: '16px'
      };
    }

    nodes.push({
      id: item.id.toString(),
      type: 'default',
      position: { x: xOffset, y: yPosition },
      data: {
        label: item.title,
        difficulty: item.difficulty,
        description: item.description,
        estimatedTime: item.estimatedTime,
        completed: item.completed || false,
        lesson: item.lesson || null,
        overview: item.overview || null
      },
      style
    });

    // Create edges using parentId
    if (item.parentId) {
      edges.push({
        id: `e${item.parentId}-${item.id}`,
        source: item.parentId.toString(),
        target: item.id.toString(),
        type: 'default', // Using default bezier for smoother flow
        animated: true,
        style: {
          stroke: '#64748b',
          strokeWidth: 3,
          filter: 'drop-shadow(0 0 5px rgba(100, 116, 139, 0.4))'
        },
        markerEnd: {
          type: 'arrow',
          color: '#64748b',
          width: 30,
          height: 30
        }
      });
    }
  });

  console.log('✅ [BACKEND] Tree conversion complete:', nodes.length, 'nodes,', edges.length, 'edges');
  return { nodes, edges };
}

// 🔹 Generate roadmap
// 🔹 Generate roadmap (with caching)
app.post("/internal/fetch-roadmap", async (req, res) => {
  const { subject } = req.body;
  console.log(`🚀 [BACKEND] Roadmap request for: ${subject}`);

  // Check cache first
  const cacheKey = subject.toLowerCase().trim();
  if (roadmapCache.has(cacheKey)) {
    CACHE_STATS.roadmap.hits++;
    console.log(`✅ [CACHE HIT] Returning cached roadmap for: ${subject}`);
    return res.json(roadmapCache.get(cacheKey));
  }

  // Cache miss
  CACHE_STATS.roadmap.misses++;
  console.log(`⚠️ [CACHE MISS] Generating new roadmap for: ${subject}`);

  try {
    const startTime = Date.now();
    const rawRoadmap = await askLLM(roadmapPrompt(subject), process.env.LLM_MODEL || "llama3.2:latest", 0.3);

    console.log(`⏱️ [TIMING] Roadmap generated in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

    // Normalize the data
    const roadmap = normalizeRoadmapData(rawRoadmap, subject);

    // Validate we have items
    if (!roadmap.items || !Array.isArray(roadmap.items) || roadmap.items.length === 0) {
      throw new Error("Failed to normalize roadmap data - no items found");
    }

    // Convert to React Flow graph format
    const graphData = convertToGraphFormat(roadmap);

    const matchData = {
      ...roadmap,
      nodes: graphData.nodes,
      edges: graphData.edges
    };

    // Store in cache
    roadmapCache.set(cacheKey, matchData);
    console.log(`💾 [CACHE] Stored roadmap for: ${subject}`);

    res.json(matchData);
  } catch (err) {
    console.error('❌ [BACKEND] Error in /internal/fetch-roadmap:', err.message);
    res.status(500).json({ error: "Roadmap generation failed" });
  }
});

// 🔹 Cache clear endpoint for roadmaps
app.post("/internal/clear-roadmap-cache", (req, res) => {
  const size = roadmapCache.size;
  roadmapCache.clear();
  CACHE_STATS.roadmap.hits = 0;
  CACHE_STATS.roadmap.misses = 0;
  console.log(`🗑️ [CACHE] Cleared all cached roadmaps (${size} items)`);
  res.json({ cleared: true, count: size });
});

app.post("/internal/fetch-lesson", async (req, res) => {
  const { topic } = req.body;
  console.log(`🚀 [BACKEND] Generating AI lesson for: ${topic}`);

  try {
    const prompt = lessonPrompt(topic);
    const aiResponse = await askLLM(prompt);

    // Normalize AI response to frontend structure
    const lesson = {
      title: aiResponse.title || topic,
      introduction: aiResponse.intro || "",
      sections: (aiResponse.sections || []).map((s, idx) => ({
        id: (idx + 1).toString(),
        title: s.heading || s.title || `Section ${idx + 1}`,
        content: s.content || "",
        bullets: s.bullets || [],
        codeExample: s.code || s.codeExample || null,
        // Move common pitfalls/examples if relevant or keep them separate
      })),
      pitfalls: aiResponse.pitfalls || [],
      realWorldExamples: aiResponse.examples || "",
      practiceExercise: aiResponse.exercise || null,
      nextSteps: aiResponse.next_steps || ""
    };

    res.json(lesson);
  } catch (err) {
    console.error('❌ [BACKEND] Error in /internal/fetch-lesson:', err.message);
    // Fallback to mock-like structure on error
    res.json({
      title: topic,
      introduction: `Let's dive into ${topic}. This lesson covers the core concepts you need to get started.`,
      sections: [
        { id: "1", title: "Overview", content: `Understanding ${topic} is essential for your technical growth.` }
      ]
    });
  }
});

// 🔹 Assistant for topic validation
app.post("/internal/subject-verify", async (req, res) => {
  console.log('🚀 [BACKEND] HIT: /internal/subject-verify');
  const { data } = req.body;

  try {
    const systemMessage = { role: "system", content: chatPrompt() };
    const chatMessages = [systemMessage, ...data];

    const response = await ollama.chat({
      model: process.env.LLM_MODEL || "llama3.2:latest",
      messages: chatMessages,
    });

    res.json({ message: response.message });
  } catch (err) {
    console.error('❌ [BACKEND] Error in /internal/subject-verify:', err.message);
    res.status(500).json({ error: "Topic analysis failed" });
  }
});

// 🔹 Get AI-powered topic overview
app.post("/internal/topic-overview", async (req, res) => {
  const { topic, subject } = req.body;
  console.log(`🚀 [BACKEND] Fetching AI overview for: ${topic} (${subject})`);

  try {
    const prompt = topicOverviewPrompt(topic, subject);
    const details = await askLLM(prompt);
    res.json(details);
  } catch (err) {
    console.error('❌ [BACKEND] Error in /internal/topic-overview:', err.message);
    res.json({
      summary: `Learn the fundamentals of ${topic} as part of ${subject}.`,
      whyItMatters: "Mastering this topic is a key milestone in your growth.",
      resources: [
        { title: "Documentation Guide", type: "Official Docs", url: "#" },
        { title: "Quick Tutorial", type: "Tutorial", url: "#" },
        { title: "Deep Dive Video", type: "Video", url: "#" }
      ]
    });
  }
});

// 🔹 Generate dynamic assessment questions (with caching)
app.post("/internal/fetch-assessment", async (req, res) => {
  const { subject } = req.body;
  console.log(`🚀 [BACKEND] Assessment request for: ${subject}`);

  // Check cache first
  const cacheKey = subject.toLowerCase().trim();
  if (assessmentCache.has(cacheKey)) {
    CACHE_STATS.assessment.hits++;
    console.log(`✅ [CACHE HIT] Returning cached assessment for: ${subject}`);
    return res.json(assessmentCache.get(cacheKey));
  }

  // Cache miss - generate new assessment
  CACHE_STATS.assessment.misses++;
  console.log(`⚠️ [CACHE MISS] Generating new assessment for: ${subject}`);
  console.log(`📊 [CACHE STATS] Hits: ${CACHE_STATS.hits}, Misses: ${CACHE_STATS.misses}`);

  try {
    const prompt = assessmentPrompt(subject);
    const startTime = Date.now();

    // Use temperature 0.3 for faster, more consistent generation
    const result = await askLLM(prompt, process.env.LLM_MODEL || "llama3.2:latest");

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️ [TIMING] Assessment generated in ${generationTime}s`);

    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error("Invalid assessment format from LLM");
    }

    // Store in cache
    assessmentCache.set(cacheKey, result);
    console.log(`💾 [CACHE] Stored assessment for: ${subject} (${result.questions.length} questions)`);

    res.json(result);
  } catch (err) {
    console.error('❌ [BACKEND] Error in /internal/fetch-assessment:', err.message);
    // Fallback to static questions if AI fails
    const fallback = {
      questions: [
        {
          question: `What is a core concept of ${subject}?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correct: 0,
          difficulty: "easy"
        }
      ]
    };
    res.json(fallback);
  }
});

// 🔹 Cache management endpoint
app.post("/internal/clear-assessment-cache", (req, res) => {
  const { subject } = req.body;

  if (subject) {
    const cacheKey = subject.toLowerCase().trim();
    const existed = assessmentCache.delete(cacheKey);
    console.log(`🗑️ [CACHE] Cleared cache for: ${subject} (existed: ${existed})`);
    res.json({ cleared: existed, subject });
  } else {
    const size = assessmentCache.size;
    assessmentCache.clear();
    CACHE_STATS.hits = 0;
    CACHE_STATS.misses = 0;
    console.log(`🗑️ [CACHE] Cleared all cached assessments (${size} items)`);
    res.json({ cleared: true, count: size });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
