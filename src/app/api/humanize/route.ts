import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { HumanizeResult } from '@/types';

const humanizeSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters').max(8000, 'Text must not exceed 8000 characters'),
});

// GPT-4o system prompt optimized for humanization
const HUMANIZE_SYSTEM_PROMPT = `You are an expert at transforming AI-generated text into natural, human-like writing. Your task is to rewrite the provided text to make it undetectable by AI detectors while maintaining the original meaning and improving readability.

KEY PRINCIPLES TO APPLY:

1. PERPLEXITY (Vocabulary Variation):
   - Use diverse vocabulary - avoid repeating the same words or phrases
   - Incorporate synonyms naturally
   - Mix formal and slightly informal language appropriately
   - Use colloquial expressions where context permits
   - Include idioms and natural expressions

2. BURSTINESS (Sentence Structure Variation):
   - Vary sentence lengths dramatically (short punchy sentences mixed with longer, flowing ones)
   - Break up complex sentences into simpler ones, or combine short ones
   - Use sentence fragments occasionally (grammatically acceptable in casual writing)
   - Start sentences with different words and structures
   - Avoid repetitive sentence patterns

3. NATURAL HUMAN ELEMENTS:
   - Add personal touches, opinions, or subjective statements where appropriate
   - Use contractions (don't, can't, won't, I'm, etc.)
   - Include filler words occasionally (well, actually, basically, you know)
   - Use rhetorical questions
   - Add emotional expressions
   - Vary punctuation usage (dashes, ellipses, exclamation marks where natural)

4. STRUCTURAL IMPROVEMENTS:
   - Remove or vary transitional phrases ("Furthermore", "Moreover", "Consequently")
   - Break up lists into flowing prose or vice versa
   - Use active voice more frequently
   - Include specific examples or anecdotes if the content allows

REQUIREMENTS:
- Maintain the core message and information
- Keep the topic and context intact
- Ensure grammatical correctness
- Make the text engaging and readable
- Output ONLY the rewritten text, no explanations or comments

PATTERNS TO AVOID:
- Repetitive sentence structures
- Overly formal academic tone
- Predictable word choices
- Uniform paragraph lengths
- Excessive use of transition words`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { text } = humanizeSchema.parse(body);

    // Detect patterns in original text
    const detectedPatterns = detectPatterns(text);

    // Select model based on available API key
    const hasOpenAI = process.env.OPENAI_API_KEY;
    const hasGoogle = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!hasOpenAI && !hasGoogle) {
      return NextResponse.json(
        { error: 'No AI API key configured. Please add OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY to your .env file.', code: 'CONFIG_ERROR' },
        { status: 500 }
      );
    }

    // Use Gemini if available (free tier), otherwise OpenAI
    const model = hasGoogle 
      ? google('gemini-1.5-flash')  // Free tier available
      : openai('gpt-4o-mini');       // Cheaper than GPT-4o

    // Use AI SDK for humanization
    const { text: humanizedText } = await generateText({
      model,
      system: HUMANIZE_SYSTEM_PROMPT,
      prompt: text,
      temperature: 0.8,
    });

    // Generate improvement list
    const improvements = generateImprovements(detectedPatterns);

    const result: HumanizeResult = {
      humanizedText: humanizedText.trim(),
      improvements,
      detectedPatterns,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    console.error('Humanize error:', error);
    return NextResponse.json(
      { error: 'Failed to humanize text', code: 'HUMANIZE_ERROR' },
      { status: 500 }
    );
  }
}

function detectPatterns(text: string): string[] {
  const patterns: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check for repetitive sentence starts
  const starts = sentences.map(s => s.trim().split(/\s+/)[0].toLowerCase());
  const startCounts = new Map<string, number>();
  starts.forEach(s => {
    startCounts.set(s, (startCounts.get(s) || 0) + 1);
  });
  
  let repetitiveStarts = 0;
  startCounts.forEach((count) => {
    if (count > sentences.length * 0.25) repetitiveStarts++;
  });
  
  if (repetitiveStarts > 0) {
    patterns.push(`Repetitive sentence beginnings (${repetitiveStarts} common patterns)`);
  }
  
  // Check for uniform sentence length
  const lengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  
  if (variance < 4 && sentences.length > 3) {
    patterns.push('Uniform sentence length (low burstiness)');
  }
  
  // Check for formal transitions
  const formalWords = ['furthermore', 'moreover', 'consequently', 'therefore', 'additionally', 'nevertheless'];
  const formalCount = formalWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  if (formalCount > 2) {
    patterns.push('Excessive formal transitions');
  }
  
  // Check for lack of contractions
  const contractionCount = (text.match(/\b\w+'(?:ll|ve|re|s|d|t)\b/gi) || []).length;
  const totalWords = text.split(/\s+/).length;
  if (contractionCount < totalWords * 0.01 && totalWords > 50) {
    patterns.push('Minimal use of contractions');
  }
  
  // Check for repetitive vocabulary
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const wordFreq = new Map<string, number>();
  words.forEach(w => {
    wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
  });
  
  let repetitiveWords = 0;
  wordFreq.forEach((count) => {
    if (count > words.length * 0.05) repetitiveWords++;
  });
  
  if (repetitiveWords > 2) {
    patterns.push('Repetitive vocabulary usage');
  }
  
  if (patterns.length === 0) {
    patterns.push('Text appears natural with good variation');
  }
  
  return patterns;
}

function generateImprovements(patterns: string[]): string[] {
  const improvements: string[] = [];
  
  patterns.forEach(pattern => {
    if (pattern.includes('Repetitive sentence')) {
      improvements.push('Varied sentence openings with different structures');
    }
    if (pattern.includes('Uniform sentence')) {
      improvements.push('Mixed short and long sentences for dynamic rhythm');
    }
    if (pattern.includes('formal transitions')) {
      improvements.push('Replaced formal transitions with natural flow');
    }
    if (pattern.includes('contractions')) {
      improvements.push('Added natural contractions for conversational tone');
    }
    if (pattern.includes('vocabulary')) {
      improvements.push('Diversified vocabulary with synonyms and varied expressions');
    }
  });
  
  // Add general improvements
  improvements.push('Enhanced perplexity with varied word choices');
  improvements.push('Improved burstiness through sentence length variation');
  improvements.push('Added human-like nuances and natural expressions');
  
  return improvements.slice(0, 6);
}
