const roadmapPrompt = (subject) => `
You are an expert learning roadmap generator for the subject: "${subject}".

## TASK
Create a comprehensive learning roadmap for "${subject}" that guides a beginner to advanced proficiency.

## OUTPUT FORMAT
Return a valid JSON object with the following structure:
{
  "title": "Learning Roadmap Title",
  "description": "Brief description of the roadmap",
  "items": [
    {
      "id": 1,
      "title": "Topic Title",
      "description": "Detailed description of what to learn",
      "estimatedTime": "X hours/days/weeks",
      "difficulty": "Beginner/Intermediate/Advanced",
      "completed": false
    }
  ]
}

## REQUIREMENTS
1. Include 4-8 learning items in logical progression from beginner to advanced
2. Each item must have all required fields
3. Estimated time should be realistic (e.g., "2 hours", "1 week")
4. Difficulty levels should progress appropriately
5. Return ONLY valid JSON, no extra text or markdown
`;

export default roadmapPrompt;
