'use client';

import { useState, useCallback } from 'react';
import { TextArea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AnalysisResults } from '@/components/analysis-results';
import { HumanizeResults } from '@/components/humanize-results';
import { AnalysisResult, HumanizeResult, ScrapeResult, TabType } from '@/types';
import { cn } from '@/lib/utils';

export function InputForm() {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [humanizeResult, setHumanizeResult] = useState<HumanizeResult | null>(null);

  const handleScrape = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setLoadingAction('Scraping website...');
    setError(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape website');
      }

      const scrapeResult = data as ScrapeResult;
      setText(scrapeResult.content);
      setActiveTab('text');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  }, [url]);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim() || text.trim().length < 10) {
      setError('Please enter at least 10 characters of text');
      return;
    }

    setIsLoading(true);
    setLoadingAction('Analyzing text...');
    setError(null);
    setAnalysisResult(null);
    setHumanizeResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze text');
      }

      setAnalysisResult(data as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  }, [text]);

  const handleHumanize = useCallback(async () => {
    if (!text.trim() || text.trim().length < 10) {
      setError('Please enter at least 10 characters of text');
      return;
    }

    setIsLoading(true);
    setLoadingAction('Humanizing text with GPT-4o...');
    setError(null);
    setAnalysisResult(null);
    setHumanizeResult(null);

    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to humanize text');
      }

      setHumanizeResult(data as HumanizeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setLoadingAction('');
    }
  }, [text]);

  return (
    <section className="w-full max-w-4xl mx-auto">
      <Card variant="elevated" className="overflow-visible">
        <CardContent className="p-6 sm:p-8">
          {/* Tabs */}
          <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={cn(
                'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
                activeTab === 'text'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={cn(
                'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
                activeTab === 'url'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Enter URL
            </button>
          </div>

          {/* URL Input */}
          {activeTab === 'url' && (
            <div className="mb-6 space-y-4">
              <Input
                label="Website URL"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={activeTab === 'url' && error ? error : undefined}
              />
              <Button
                onClick={handleScrape}
                isLoading={isLoading && loadingAction === 'Scraping website...'}
                className="w-full"
              >
                Scrape Content
              </Button>
            </div>
          )}

          {/* Text Input */}
          {activeTab === 'text' && (
            <div className="mb-6">
              <TextArea
                label="Your Text"
                placeholder="Paste your text here to analyze or humanize... (minimum 10 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                error={activeTab === 'text' && error ? error : undefined}
              />
              <p className="mt-2 text-sm text-gray-500">
                {text.length} characters
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {activeTab === 'text' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAnalyze}
                isLoading={isLoading && loadingAction === 'Analyzing text...'}
                variant="primary"
                className="flex-1"
              >
                Analyze for AI
              </Button>
              <Button
                onClick={handleHumanize}
                isLoading={isLoading && loadingAction === 'Humanizing text with GPT-4o...'}
                variant="secondary"
                className="flex-1"
              >
                Humanize Text
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" className="text-blue-600" />
              <p className="mt-4 text-gray-600 font-medium">{loadingAction}</p>
              <p className="mt-2 text-sm text-gray-500">
                Processing on our secure servers...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {!isLoading && analysisResult && (
        <div className="mt-8">
          <AnalysisResults result={analysisResult} />
        </div>
      )}

      {!isLoading && humanizeResult && (
        <div className="mt-8">
          <HumanizeResults result={humanizeResult} />
        </div>
      )}
    </section>
  );
}
