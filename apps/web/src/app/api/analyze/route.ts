import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Schema Definition for Strict Output
const AnalysisSchema = z.object({
    summary: z.string().describe("A brief summary of the meeting focus and culture alignment."),
    segments: z.array(z.object({
        id: z.string().describe("Unique identifier for the segment"),
        speaker: z.string().describe("Name of the speaker (e.g., Speaker 1)"),
        text: z.string().describe("The actual text spoken"),
        scores: z.array(z.object({
            value: z.string().describe("The Core Value name"),
            score: z.number().min(-5).max(5).describe("Alignment score (-5 to 5)")
        })).describe("List of relevant alignment scores for this segment.")
    }))
});

export async function POST(req: Request) {
    try {
        const { transcript, coreValues } = await req.json();

        if (!transcript || !coreValues) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Check for API Key (Vercel AI SDK uses OPENAI_API_KEY env var by default)
        if (!process.env.OPENAI_API_KEY) {
            console.warn("No OPENAI_API_KEY found. Please add it to .env.local");
            return NextResponse.json({ error: 'OpenAI API Key is missing. Please add OPENAI_API_KEY to your .env.local file.' }, { status: 500 });
        }

        const { object } = await generateObject({
            model: openai('gpt-4o'),
            schema: AnalysisSchema,
            system: `
        You are an expert culture consultant.
        Your task is to analyze a meeting transcript against specific Core Values.
        
        CORE VALUES: ${JSON.stringify(coreValues)}
        
        INSTRUCTIONS:
        1. Parse the ENTIRE transcript into segments (Speaker + Text). DO NOT skip any part of the conversation or summarize.
        2. Return ALL segments in their original order, ensuring the full transcript is represented.
        3. For each segment, score how well it aligns with EACH Core Value on a scale of -5 to 5.
           - 5: Strongly Aligns
           - 0: Neutral / Irrelevant
           - -5: Strongly Violates
        4. Only return scores that are relevant (non-zero preferred, or significant). If no relevance, return empty scores array.
        5. Be strict but fair.
      `,
            prompt: transcript,
        });

        return NextResponse.json(object);

    } catch (error: any) {
        console.error("Analysis Error Details:", error.message || error);
        return NextResponse.json({
            error: 'Failed to analyze transcript',
            details: error.message
        }, { status: 500 });
    }
}
