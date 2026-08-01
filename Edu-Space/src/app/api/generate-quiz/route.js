import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topic, difficulty, numQuestions } = await request.json();

    if (!topic || !difficulty || !numQuestions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.warn("ANTHROPIC_API_KEY is missing. Returning mock data.");
      // Return mock data for development if key is missing
      const mockQuestions = Array(numQuestions).fill(0).map((_, i) => ({
        question: `Mock generated question ${i+1} about ${topic}?`,
        options: [`Option A`, `Option B`, `Option C`, `Option D`],
        correctIndex: 0,
        explanation: `This is a mock explanation for a ${difficulty} difficulty question.`
      }));
      return NextResponse.json({ questions: mockQuestions });
    }

    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are an expert educator. Generate a multiple-choice quiz about "${topic}".
Difficulty level: ${difficulty}.
Number of questions: ${numQuestions}.

Return ONLY a raw JSON array of objects. Do not include markdown code blocks, backticks, or any other text.
Each object must have the exact following structure:
{
  "question": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctIndex": 0, // index of the correct option (0-3)
  "explanation": "A brief explanation of why the answer is correct."
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = response.content[0].text.trim();
    // In case the model returns markdown code block despite instructions
    const cleanText = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    
    const questions = JSON.parse(cleanText);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
