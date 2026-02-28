import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodeDetailPanel from '../components/NodeDetailPanel';

const RoadmapPage = ({ roadmapData, userSkills, setUserSkills, currentSubject }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const navigate = useNavigate();

  // Convert roadmap data to React Flow format with better layout
  // Convert roadmap data to React Flow format with better layout
  const processRoadmapData = useCallback((data) => {
    console.log('🔵 [ROADMAP] processRoadmapData called');

    if (!data) return { nodes: [], edges: [] };

    // Priority 1: Use pre-calculated graph format from backend (Tree Structure)
    if (data.nodes && Array.isArray(data.nodes) && data.edges && Array.isArray(data.edges)) {
      console.log('✅ [ROADMAP] Using backend-calculated tree graph');

      const flowNodes = data.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          skills: userSkills[node.id] || 0
        }
      }));

      return { nodes: flowNodes, edges: data.edges };
    }

    // Priority 2: Process key-value pair format (e.g., { "Topic": { prerequisite, level, est_time } })
    const isKeyValueFormat = Object.keys(data).length > 0 &&
      typeof Object.values(data)[0] === 'object' &&
      Object.values(data)[0] !== null &&
      !Array.isArray(Object.values(data)[0]) &&
      ('level' in Object.values(data)[0]);

    if (isKeyValueFormat) {
      console.log('✅ [ROADMAP] Processing key-value pair roadmap data');

      const flowNodes = [];
      const flowEdges = [];
      const topics = Object.keys(data);

      // Map topics to their dependencies for layout calculation
      const adj = {};
      const levels = {}; // To store vertical level in layout

      topics.forEach(topic => {
        const prereq = data[topic].prerequisite;
        if (prereq) {
          if (!adj[prereq]) adj[prereq] = [];
          adj[prereq].push(topic);
        }
      });

      // Simple BFS/DFS to determine levels for layout
      const queue = topics.filter(t => !data[t].prerequisite).map(t => ({ topic: t, lvl: 0 }));
      const visited = new Set();

      while (queue.length > 0) {
        const { topic, lvl } = queue.shift();
        if (visited.has(topic)) continue;
        visited.add(topic);
        levels[topic] = lvl;

        if (adj[topic]) {
          adj[topic].forEach(next => {
            queue.push({ topic: next, lvl: lvl + 1 });
          });
        }
      }

      // Track number of nodes at each level for horizontal centering
      const nodesPerLevel = {};
      topics.forEach(t => {
        const lvl = levels[t] || 0;
        nodesPerLevel[lvl] = (nodesPerLevel[lvl] || 0) + 1;
      });

      const levelCurrentCount = {};

      topics.forEach((topic, index) => {
        const nodeData = data[topic];
        const lvl = levels[topic] || 0;
        const countAtLevel = nodesPerLevel[lvl];
        const indexAtLevel = levelCurrentCount[lvl] || 0;
        levelCurrentCount[lvl] = indexAtLevel + 1;

        // Position nodes: Y based on level, X centered horizontally
        const xPos = (indexAtLevel - (countAtLevel - 1) / 2) * 450 + 400;
        const yPos = lvl * 350 + 100;

        flowNodes.push({
          id: topic,
          type: 'default',
          position: { x: xPos, y: yPos },
          sourcePosition: 'bottom',
          targetPosition: 'top',
          data: {
            label: topic,
            difficulty: nodeData.level,
            description: `Estimated time: ${nodeData.est_time}`,
            skills: userSkills[topic] || 0,
            estimatedTime: nodeData.est_time
          },
          style: {
            background: getNodeBackground(nodeData.level),
            color: '#ffffff',
            border: '2px solid',
            borderColor: getNodeBorderColor(nodeData.level),
            borderRadius: '24px',
            padding: '20px',
            fontSize: '15px',
            fontWeight: '700',
            minWidth: '220px',
            textAlign: 'center',
            boxShadow: getNodeShadow(nodeData.level),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }
        });

        if (nodeData.prerequisite) {
          flowEdges.push({
            id: `e-${nodeData.prerequisite}-${topic}`,
            source: nodeData.prerequisite,
            target: topic,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#3f3f46', strokeWidth: 3 },
            markerEnd: { type: 'arrowclosed', color: '#3f3f46', width: 25, height: 25 }
          });
        }
      });

      return { nodes: flowNodes, edges: flowEdges };
    }

    // Priority 3: Process items array (fallback logic)
    if (data.items && Array.isArray(data.items)) {
      console.log('✅ [ROADMAP] Processing items array into flow');

      const flowNodes = data.items.map((item, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;

        return {
          id: item.id.toString(),
          type: 'default',
          position: { x: col * 350 + 100, y: row * 200 + 100 },
          data: {
            label: item.title,
            difficulty: item.difficulty,
            description: item.description,
            skills: userSkills[item.id] || 0,
            estimatedTime: item.estimatedTime
          },
          style: {
            background: getNodeBackground(item.difficulty),
            color: '#ffffff',
            border: '2px solid',
            borderColor: getNodeBorderColor(item.difficulty),
            borderRadius: '24px',
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

      const flowEdges = data.items.slice(0, -1).map((item, index) => ({
        id: `e${item.id}-${data.items[index + 1].id}`,
        source: item.id.toString(),
        target: data.items[index + 1].id.toString(),
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3f3f46', strokeWidth: 2, strokeDasharray: '5,5' },
        markerEnd: { type: 'arrowclosed', color: '#3f3f46', width: 20, height: 20 }
      }));

      return { nodes: flowNodes, edges: flowEdges };
    }

    return { nodes: [], edges: [] };
  }, [userSkills]);

  const getNodeBackground = (difficulty) => {
    const normalizedDifficulty = difficulty?.toLowerCase()?.trim();

    console.log('🎨 [COLOR] Input difficulty:', difficulty, '→ Normalized:', normalizedDifficulty);

    switch (normalizedDifficulty) {
      case 'beginner':
        return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'; // Indigo to Purple
      case 'intermediate':
        return 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'; // Pink to Rose
      case 'advanced':
        return 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'; // Amber to Red
      default:
        console.warn('⚠️ [COLOR] Unknown difficulty, using default:', difficulty);
        return 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'; // Blue to Cyan
    }
  };

  const getNodeBorderColor = (difficulty) => {
    const normalizedDifficulty = difficulty?.toLowerCase()?.trim();

    switch (normalizedDifficulty) {
      case 'beginner': return '#8b5cf6';
      case 'intermediate': return '#f43f5e';
      case 'advanced': return '#ef4444';
      default: return '#06b6d4';
    }
  };

  const getNodeShadow = (difficulty) => {
    const normalizedDifficulty = difficulty?.toLowerCase()?.trim();

    switch (normalizedDifficulty) {
      case 'beginner':
        return '0 10px 25px -5px rgba(139, 92, 246, 0.3), 0 8px 10px -6px rgba(139, 92, 246, 0.2)';
      case 'intermediate':
        return '0 10px 25px -5px rgba(244, 63, 94, 0.3), 0 8px 10px -6px rgba(244, 63, 94, 0.2)';
      case 'advanced':
        return '0 10px 25px -5px rgba(239, 68, 68, 0.3), 0 8px 10px -6px rgba(239, 68, 68, 0.2)';
      default:
        return '0 10px 25px -5px rgba(6, 182, 212, 0.3), 0 8px 10px -6px rgba(6, 182, 212, 0.2)';
    }
  };

  // Update nodes when roadmapData or userSkills change
  useEffect(() => {
    console.log('🔵 [ROADMAP] useEffect triggered');
    console.log('📋 [ROADMAP] roadmapData received:', JSON.stringify(roadmapData, null, 2));
    console.log('📋 [ROADMAP] userSkills:', JSON.stringify(userSkills, null, 2));

    const { nodes: newNodes, edges: newEdges } = processRoadmapData(roadmapData);

    console.log('📊 [ROADMAP] Processed nodes count:', newNodes.length);
    console.log('📊 [ROADMAP] Processed edges count:', newEdges.length);
    console.log('📊 [ROADMAP] Setting state with nodes and edges...');

    setNodes(newNodes);
    setEdges(newEdges);

    if (newNodes.length === 0) {
      console.warn('⚠️ [ROADMAP] No nodes generated! Check the data format.');
    }
  }, [roadmapData, userSkills, processRoadmapData]);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  if (!roadmapData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl">
            ⚠️
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">No Roadmap Data</h2>
          <p className="text-zinc-400 mb-8">Please generate a roadmap first to view your learning path.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                     font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">
                {currentSubject}
                <span className="text-zinc-600"> Learning Path</span>
              </h1>
              <p className="text-zinc-500 text-sm">Click any node to explore • Drag to navigate</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/assessment')}
                className="px-6 py-3 bg-zinc-800/80 border border-zinc-700 text-zinc-300 rounded-xl 
                         hover:bg-zinc-700 hover:border-zinc-600 hover:text-white transition-all font-semibold text-sm"
              >
                📊 Reassess
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl 
                         font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 text-sm"
              >
                ✨ New Path
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-93px)]">
        {/* Graph Visualization */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-left"
            className="bg-zinc-950"
          >
            <Controls
              style={{
                background: 'rgba(24, 24, 27, 0.8)',
                border: '1px solid #27272a',
                borderRadius: '16px',
                backdropFilter: 'blur(12px)'
              }}
              className="[&_button]:bg-zinc-800/80 [&_button]:border-zinc-700 [&_button]:text-zinc-300 [&_button:hover]:bg-zinc-700 [&_button:hover]:text-white"
            />
            <Background
              variant="dots"
              gap={20}
              size={1.5}
              color="#27272a"
              style={{ background: '#09090b' }}
            />
          </ReactFlow>

          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-lg">🎨</span>
              Difficulty Levels
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform" />
                <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">Beginner</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform" />
                <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">Intermediate</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform" />
                <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">Advanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Detail Panel */}
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            subject={currentSubject}
            onClose={() => setSelectedNode(null)}
            onStartLesson={(topicId, lessonData) => navigate(`/lesson/${topicId}`, { state: { preloadedLesson: lessonData } })}
          />
        )}
      </div>

      {/* Custom Styles for React Flow with cool animations */}
      <style>{`
        .react-flow__node {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .react-flow__node:hover {
          transform: scale(1.05) translateY(-8px);
          z-index: 1000 !important;
        }
        
        .react-flow__node.selected {
          transform: scale(1.08);
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.4), 0 20px 40px -10px rgba(168, 85, 247, 0.4) !important;
          animation: pulse-border 2s ease-in-out infinite;
        }

        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.4), 0 20px 40px -10px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(168, 85, 247, 0.6), 0 20px 40px -10px rgba(168, 85, 247, 0.6);
          }
        }

        .react-flow__edge-path {
          transition: stroke 0.3s ease, stroke-width 0.3s ease;
          stroke-linecap: round;
        }

        .react-flow__edge:hover .react-flow__edge-path {
          stroke: #ffffff !important;
          stroke-width: 4 !important;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
        }

        .react-flow__edge.animated .react-flow__edge-path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }

        @keyframes dashdraw {
          to {
            stroke-dashoffset: -10;
          }
        }

        .react-flow__controls {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
        }

        .react-flow__controls button {
          transition: all 0.2s ease;
        }

        .react-flow__controls button:hover {
          transform: scale(1.1);
        }

        .react-flow__attribution {
          background: rgba(24, 24, 27, 0.8) !important;
          border: 1px solid #27272a !important;
          padding: 4px 10px !important;
          border-radius: 8px !important;
          color: #52525b !important;
          font-size: 10px !important;
          backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;