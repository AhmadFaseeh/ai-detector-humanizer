import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculatePerplexity, calculateBurstiness, detectRepetitivePatterns } from '@/lib/utils';
import { AnalysisResult } from '@/types';

const analyzeSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters').max(10000, 'Text must not exceed 10000 characters'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { text } = analyzeSchema.parse(body);

    // Perform analysis on the server to minimize TBT on client
    const perplexity = calculatePerplexity(text);
    const burstiness = calculateBurstiness(text);
    const patterns = detectRepetitivePatterns(text);

    // AI detection algorithm
    const aiProbability = calculateAiProbability(perplexity, burstiness, patterns);

    // Generate sentence-level analysis
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const sentenceAnalysis = sentences.map((sentence: string) => ({
      text: sentence.trim(),
      aiProbability: analyzeSentence(sentence),
      issues: detectSentenceIssues(sentence),
    }));

    const result: AnalysisResult = {
      isAiGenerated: aiProbability > 0.7,
      confidence: Math.round(aiProbability * 100),
      perplexity: Math.round(perplexity * 100) / 100,
      burstiness: Math.round(burstiness * 100) / 100,
      sentenceAnalysis: sentenceAnalysis.slice(0, 10), // Limit to first 10 sentences
      suggestions: generateSuggestions(patterns, aiProbability),
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text', code: 'ANALYSIS_ERROR' },
      { status: 500 }
    );
  }
}

function calculateAiProbability(perplexity: number, burstiness: number, patterns: string[]): number {
  // Lower perplexity and burstiness indicate AI-generated text
  // Typical AI text: low perplexity (predictable), low burstiness (uniform)
  let probability = 0.5;

  if (perplexity < 3) probability += 0.3;
  else if (perplexity < 5) probability += 0.15;
  else probability -= 0.1;

  if (burstiness < 2) probability += 0.2;
  else if (burstiness > 5) probability -= 0.2;

  if (patterns.length > 0) probability += 0.1 * patterns.length;

  return Math.min(Math.max(probability, 0), 1);
}

function analyzeSentence(sentence: string): number {
  const words = sentence.split(/\s+/).filter(w => w.length > 0);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  
  // AI tends to use consistent word lengths
  let probability = 0.5;
  if (avgWordLength > 4.5 && avgWordLength < 5.5) probability += 0.2;
  if (words.length > 15 && words.length < 25) probability += 0.1;
  
  return Math.min(Math.max(probability, 0), 1);
}

function detectSentenceIssues(sentence: string): string[] {
  const issues: string[] = [];
  const words = sentence.split(/\s+/).filter(w => w.length > 0);
  
  // Check for overly formal transitions
  const formalTransitions = ['furthermore', 'moreover', 'consequently', 'therefore', 'however', 'additionally'];
  const hasFormalTransition = formalTransitions.some(t => sentence.toLowerCase().includes(t));
  if (hasFormalTransition) issues.push('Formal transition detected');
  
  // Check for repetitive structure
  if (words.length > 20 && words.length < 25) issues.push('Typical AI sentence length');
  
  return issues;
}

function generateSuggestions(patterns: string[], aiProbability: number): string[] {
  const suggestions: string[] = [];
  
  if (aiProbability > 0.7) {
    suggestions.push('Text shows strong AI generation patterns');
    suggestions.push('Consider varying sentence lengths more dramatically');
    suggestions.push('Use more colloquial expressions and contractions');
  } else if (aiProbability > 0.4) {
    suggestions.push('Text shows mixed patterns - may be partially AI-generated');
    suggestions.push('Add more personal anecdotes or unique perspectives');
  } else {
    suggestions.push('Text appears to be human-written');
  }
  
  patterns.forEach(pattern => {
    if (pattern.includes('starts')) {
      suggestions.push('Vary your sentence openings more');
    }
    if (pattern.includes('lengths')) {
      suggestions.push('Mix short and long sentences for better flow');
    }
  });
  
  return suggestions;
}
