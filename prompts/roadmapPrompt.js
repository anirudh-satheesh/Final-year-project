const roadmapPrompt = (subject) => `
Create a learning roadmap for "${subject}".
Return ONLY valid JSON.

Structure:
{
  "title": "${subject} Roadmap",
  "description": "Master ${subject}",
  "items": [
    {
      "id": 1,
      "parentId": null,
      "title": "Topic",
      "description": "Desc",
      "estimatedTime": "2h",
      "difficulty": "Beginner",
      "overview": {
        "summary": "Brief summary.",
        "resources": [],
        "whyItMatters": "Reason."
      }
    }
  ]
}

Requirements:
- Array of 6-8 nodes (tree structure).
- Valid JSON only. No markdown.
- KEEP IT CONCISE.
`;

export default roadmapPrompt;

