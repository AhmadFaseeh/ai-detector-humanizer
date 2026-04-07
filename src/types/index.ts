export interface AnalysisResult {
  isAiGenerated: boolean;
  confidence: number;
  perplexity: number;
  burstiness: number;
  sentenceAnalysis: SentenceAnalysis[];
  suggestions: string[];
}

export interface SentenceAnalysis {
  text: string;
  aiProbability: number;
  issues: string[];
}

export interface HumanizeResult {
  humanizedText: string;
  improvements: string[];
  detectedPatterns: string[];
}

export interface ScrapeResult {
  title: string;
  content: string;
  url: string;
  wordCount: number;
}

export interface ApiError {
  error: string;
  code: string;
}

export type TabType = 'text' | 'url';

export interface FormState {
  text: string;
  url: string;
  activeTab: TabType;
  isLoading: boolean;
  error: string | null;
}
