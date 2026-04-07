import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePerplexity(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  
  return (uniqueWords.size / words.length) * 100;
}

export function calculateBurstiness(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return 0;
  
  const lengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  
  return Math.sqrt(variance);
}

export function detectRepetitivePatterns(text: string): string[] {
  const patterns: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Check for repetitive sentence starts
  const starts = sentences.map(s => s.trim().split(/\s+/)[0].toLowerCase());
  const startCounts = new Map<string, number>();
  starts.forEach(s => {
    startCounts.set(s, (startCounts.get(s) || 0) + 1);
  });
  
  startCounts.forEach((count, word) => {
    if (count > sentences.length * 0.3) {
      patterns.push(`Repetitive starts with "${word}"`);
    }
  });
  
  // Check for uniform sentence length
  const lengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
  const maxLen = Math.max(...lengths);
  const minLen = Math.min(...lengths);
  
  if (maxLen - minLen < 3 && sentences.length > 5) {
    patterns.push('Uniform sentence lengths');
  }
  
  return patterns;
}
