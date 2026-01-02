# Final Year Project - AI Roadmap Generator

A modern full-stack application for generating personalized learning roadmaps using AI.

## Project Structure

```
final-year-project/
├── backend/                 # Backend server (Node.js + Express + Ollama)
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js           # Express server with AI endpoints
│   ├── test.js             # Test file
│   ├── test.json           # Test data
│   ├── temp.json           # Temporary data
│   ├── graph.py            # Graph utilities (Python)
│   └── .gitignore
│
├── frontend/               # Frontend application (React + Vite)
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html          # Entry HTML file
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main App component
│   ├── App.css             # App styles
│   ├── index.css           # Global styles
│   ├── vite.config.js      # Vite configuration
│   └── .gitignore
│
├── json/                   # JSON data files
│   ├── graph.json
│   └── roadmap.json
│
├── prompts/                # AI prompt templates
│   ├── graphPrompt.js
│   ├── lessonPrompt.js
│   └── roadmapPrompt.js
│
├── utils/                  # Utility functions
│   └── topoSort.js
│
├── README.md               # This file
├── TODO.md                 # Development tasks
├── roadmap.png             # Project roadmap image
└── .git/                   # Git repository
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+ (for graph utilities)
- Ollama (for local AI inference)

### Backend Setup

```bash
cd backend
npm install
npm start          # Start server on http://localhost:3000
npm run dev        # Start server with auto-restart
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        # Start dev server on http://localhost:5173
npm run build      # Build for production
```

## Features
- AI-powered roadmap generation
- Interactive learning paths
- Topological sorting for dependency management
- Modern React frontend with Vite
- Express backend with CORS support

## Tech Stack
- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express, CORS
- **AI**: Ollama (local LLM inference)
- **Utilities**: Python (graph algorithms)

