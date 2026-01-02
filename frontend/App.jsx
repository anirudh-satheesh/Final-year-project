import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [roadmap, setRoadmap] = useState('')
  const [loading, setLoading] = useState(false)

  const generateRoadmap = async () => {
    if (!input.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: input })
      })
      
      const data = await response.json()
      setRoadmap(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error:', error)
      setRoadmap('Error generating roadmap. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <h1>AI Roadmap Generator</h1>
      <textarea 
        placeholder="Enter a topic (e.g., Learn Python, Master Machine Learning, Web Development)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={generateRoadmap} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Roadmap'}
      </button>
      
      {roadmap && (
        <div className="roadmap-output">
          <h2>Your Roadmap:</h2>
          <pre>{roadmap}</pre>
        </div>
      )}
    </div>
  )
}

export default App

