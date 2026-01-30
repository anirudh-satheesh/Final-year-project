const topicOverviewPrompt = (topic, subject) => `
You are an expert educational assistant with a deep understanding of "${subject}".
The student is currently looking at the topic: "${topic}".

Provide a concise, high-impact overview of this topic in JSON format.
The overview should include a summary, a curated list of learning resources (title and type), and a "why it matters" quote.

RULES:
1. **Concise Summary**: Explain the topic in 2-3 engaging sentences. Use technical but accessible language.
2. **Three Resources**: Provide exactly 3 high-quality resource types: "Official Docs", "Interactive Tutorial", and "Video Guide" (or similar).
3. **Motivational Quote**: Provide a short 1-line "Why this matters" quote that connects this topic to real-world performance or deeper understanding.
4. **Valid JSON**: You must return ONLY valid JSON.

SCHEMA:
{
  "summary": "String",
  "resources": [
    { "title": "String", "type": "String", "url": "String" }
  ],
  "whyItMatters": "String"
}

RESPONSE:
`;

module.exports = { topicOverviewPrompt };
