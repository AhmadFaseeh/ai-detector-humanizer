'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HumanizeResult } from '@/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface HumanizeResultsProps {
  result: HumanizeResult;
}

export function HumanizeResults({ result }: HumanizeResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Humanized Text Card */}
      <Card variant="bordered">
        <CardHeader className="bg-gray-50/50 flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Humanized Text</h3>
          <Button
            variant={copied ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {result.humanizedText}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Improvements Card */}
      <Card variant="bordered">
        <CardHeader className="bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Improvements Made</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.improvements.map((improvement, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-gray-700"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-sm">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Detected Patterns Card */}
      <Card variant="bordered">
        <CardHeader className="bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Detected Patterns</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {result.detectedPatterns.map((pattern, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg px-4 py-3 text-sm',
                  pattern.includes('natural') || pattern.includes('good')
                    ? 'bg-green-50 text-green-800'
                    : 'bg-yellow-50 text-yellow-800'
                )}
              >
                {pattern}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
