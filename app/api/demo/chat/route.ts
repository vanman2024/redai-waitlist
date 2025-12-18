import { streamText, convertToCoreMessages } from 'ai';
import { google } from '@ai-sdk/google';

export const runtime = 'edge';
export const maxDuration = 30;

/**
 * Demo Chat API - Real AI responses for landing page
 *
 * Allows unauthenticated users to try the AI on the landing page.
 * Demo limit is tracked client-side via localStorage.
 */

const DEMO_PROMPT = `You are RED AI, an expert study partner for Red Seal trade certification.

You're giving a FREE DEMO to a potential student on the landing page. Your goals:
1. Give a REAL, helpful answer to show the value of the platform
2. Keep responses concise (2-3 paragraphs) but ALWAYS complete your thoughts
3. Be engaging and make them want to sign up
4. End with a brief call-to-action like "Want to dive deeper? Sign up to continue!"

## YOUR KNOWLEDGE
You have deep knowledge of all 54 Red Seal trades including:
- Heavy Equipment Technician (421A)
- Automotive Service Technician
- Electrician (Construction & Industrial)
- Plumber, Welder, Millwright, Tool and Die Maker, and all others

## RESPONSE STYLE
- Start with the answer right away (no fluff)
- Use practical, real-world examples
- Reference Red Seal exam structure when relevant
- Keep it conversational and encouraging
- IMPORTANT: Always finish your sentences - never leave a thought incomplete

Remember: This is their first taste of RED AI. Make it count!`;

export async function POST(req: Request) {
  try {
    const { messages, trade } = await req.json();

    const lastMessage = messages[messages.length - 1];
    console.log(`[Demo Chat] Trade: ${trade}, Query: ${lastMessage?.content?.substring(0, 100)}...`);

    // Add trade context to system prompt
    const systemPrompt = trade
      ? `${DEMO_PROMPT}\n\nThe user is studying for: ${trade}`
      : DEMO_PROMPT;

    // Use Gemini 2.5 Flash - FREE tier
    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: convertToCoreMessages(messages),
      system: systemPrompt,
      temperature: 0.5,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('[Demo Chat] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
