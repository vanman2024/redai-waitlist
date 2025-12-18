import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';
export const maxDuration = 30;

/**
 * Demo Quiz API - Generates quiz questions based on the chat conversation
 *
 * Uses Gemini to create contextually relevant quiz questions from what
 * was actually discussed in the demo chat.
 */

const QuizQuestionSchema = z.object({
  question_text: z.string().describe('The quiz question based on the conversation'),
  choice_a: z.string().describe('First answer choice'),
  choice_b: z.string().describe('Second answer choice'),
  choice_c: z.string().describe('Third answer choice'),
  choice_d: z.string().describe('Fourth answer choice'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']).describe('The correct answer letter'),
  explanation: z.string().describe('Explanation of why this answer is correct'),
  topic: z.string().describe('The topic area this question covers'),
});

const QuizQuestionsSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(3).describe('Three quiz questions'),
});

export async function POST(req: Request) {
  try {
    const { messages, trade } = await req.json();

    // Get the conversation context
    const conversationContext = messages
      .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
      .join('\n');

    console.log(`[Demo Quiz] Generating 3 quiz questions for trade: ${trade}`);

    const result = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: QuizQuestionsSchema,
      prompt: `You are creating Red Seal certification exam questions for a ${trade || 'trades'} student.

Based on this conversation that just happened:
---
${conversationContext}
---

Generate exactly 3 multiple-choice exam questions that:
1. Test the knowledge discussed in the conversation above
2. Are directly relevant to what was asked/answered
3. Are at Red Seal exam difficulty level
4. Each has 4 plausible answer choices (only one correct)
5. Each has a clear, educational explanation
6. Progress from easier to harder (question 1 = foundational, question 3 = more challenging)

The questions should feel like natural follow-up quizzes to test if the student understood what was just explained.

IMPORTANT: Vary the correct answers - don't make them all the same letter. Distribute A, B, C, D across the questions.`,
      temperature: 0.7,
    });

    // Add IDs to each question
    const questions = result.object.questions.map((q, i) => ({
      id: `demo-${Date.now()}-${i}`,
      ...q,
      block_name: 'Demo Quiz',
    }));

    return Response.json({
      success: true,
      questions,
    });

  } catch (error) {
    console.error('[Demo Quiz] Error:', error);
    return Response.json(
      { error: 'Failed to generate quiz questions', details: String(error) },
      { status: 500 }
    );
  }
}
