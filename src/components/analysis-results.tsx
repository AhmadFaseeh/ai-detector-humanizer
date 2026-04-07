'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AnalysisResult } from '@/types';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (confidence >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getVerdictText = (confidence: number) => {
    if (confidence >= 70) return 'AI-Generated';
    if (confidence >= 40) return 'Mixed / Uncertain';
    return 'Human-Written';
  };

  return (
    <div className="space-y-6">
      {/* Main Verdict Card */}
      <Card variant="bordered">
        <CardHeader className="bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verdict */}
          <div className={cn(
            'rounded-lg border-2 p-6 text-center',
            getConfidenceColor(result.confidence)
          )}>
            <p className="text-sm font-medium uppercase tracking-wide opacity-80">
              Verdict
            </p>
            <p className="mt-2 text-3xl font-bold">
              {getVerdictText(result.confidence)}
            </p>
            <p className="mt-1 text-lg">
              {result.confidence}% confidence
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Perplexity"
              value={result.perplexity}
              description="Vocabulary variation"
              color={result.perplexity > 5 ? 'green' : result.perplexity > 3 ? 'yellow' : 'red'}
            />
            <MetricCard
              label="Burstiness"
              value={result.burstiness}
              description="Sentence length variation"
              color={result.burstiness > 5 ? 'green' : result.burstiness > 2 ? 'yellow' : 'red'}
            />
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-3 font-medium text-blue-900">Suggestions</h4>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-blue-800"
                  >
                    <span className="mt-1 text-blue-500">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentence Analysis */}
      {result.sentenceAnalysis.length > 0 && (
        <Card variant="bordered">
          <CardHeader className="bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-900">
              Sentence-Level Analysis
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.sentenceAnalysis.map((sentence, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="flex-1 text-sm text-gray-700 line-clamp-2">
                      {sentence.text}
                    </p>
                    <span className={cn(
                      'shrink-0 rounded-full px-2 py-1 text-xs font-medium',
                      sentence.aiProbability > 0.7
                        ? 'bg-red-100 text-red-700'
                        : sentence.aiProbability > 0.4
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    )}>
                      {Math.round(sentence.aiProbability * 100)}%
                    </span>
                  </div>
                  {sentence.issues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sentence.issues.map((issue, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
  description: string;
  color: 'green' | 'yellow' | 'red';
}

function MetricCard({ label, value, description, color }: MetricCardProps) {
  const colors = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
  };

  const valueColors = {
    green: 'text-green-700',
    yellow: 'text-yellow-700',
    red: 'text-red-700',
  };

  return (
    <div className={cn('rounded-lg border p-4', colors[color])}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', valueColors[color])}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
