# Final Year Project - AI Roadmap Generator

A modern full-stack application for generating personalized learning roadmaps using AI. Now powered by Groq for lightning-fast roadmap generation with an Ollama fallback.

## Project Structure

```
final-year-project/
├── backend/                 # Backend server (Node.js + Express + Groq/Ollama)
│   ├── .env                # Environment variables (API Keys)
│   ├── package.json
│   ├── server.js           # Express server with AI endpoints
│   └── ...
├── frontend/               # Frontend application (React + Vite)
│   ├── package.json
│   └── ...
├── prompts/                # AI prompt templates
└── utils/                  # Utility functions (Topological Sort)
```

## Getting Started

### Prerequisites
- **Node.js**: 18+
- **Ollama**: (Optional) For local AI inference backup.
- **Groq API Key**: (Recommended) For fast cloud-based generation.

### Setup & Installation

1. **Clone the repository**
2. **Backend Configuration**:
   - Navigate to the `backend` directory: `cd backend`
   - Install dependencies: `npm install`
   - Copy the example environment file: `cp .env.example .env`
   - Open `.env` and add your **Groq API Key**:
     ```env
     GROQ_API_KEY=your_groq_api_key_here
     ```
3. **Frontend Configuration**:
   - Navigate to the `frontend` directory: `cd frontend`
   - Install dependencies: `npm install`

### Running the Project

To run both backend and frontend simultaneously, use the following commands from their respective directories:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## How to get a Groq API Key

1. Go to the [Groq Console](https://console.groq.com/).
2. Create a free account or sign in.
3. Navigate to the **API Keys** section in the sidebar.
4. Click **Create API Key**, name it (e.g., "Roadmap-App"), and copy the key.
5. Paste this key into your `backend/.env` file.

## AI Configuration (Hybrid Approach)

This project uses a primary and backup LLM system:
- **Primary (Cloud)**: Uses [Groq SDK](https://github.com/groq/groq-typescript) with the `llama-3.3-70b-versatile` model for high-speed, high-quality roadmap architecting.
- **Backup (Local)**: If the Groq API key is missing or fails (e.g., offline mode), the server automatically switches to **Ollama**.
  - Recommended local model: `llama3.2:1b` (for systems with ≤ 8GB RAM).
  - To pull the model: `ollama pull llama3.2:1b`

## Tech Stack
- **Frontend**: React 18, Vite, HSL-tailored CSS
- **Backend**: Node.js, Express, Groq SDK, Ollama SDK
- **AI Models**: Llama 3.3 (Groq), Llama 3.2 (Ollama)
- **Utilities**: Topological Sorting for dependency paths

