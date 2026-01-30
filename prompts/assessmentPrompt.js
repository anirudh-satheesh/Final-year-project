export const assessmentPrompt = (topic) => `
Generate 10 MCQ questions for ${topic} assessment.

Distribution: 4 easy, 4 medium, 2 hard questions.

Return ONLY valid JSON (no markdown, no explanation):
{
  "questions": [
    {
      "question": "Clear, concise question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "difficulty": "easy"
    }
  ]
}

Requirements:
- Each question: 4 options, correct index (0-3), difficulty ("easy"/"medium"/"hard")
- Questions must be technically accurate and specific to ${topic}
- Keep questions concise and unambiguous
`;
