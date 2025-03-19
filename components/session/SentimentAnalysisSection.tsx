'use client';

import { Card } from '@/components/ui/card';
import { SentimentResult } from '@/types';

interface SentimentAnalysisSectionProps {
  isAnalyzing: boolean;
  sentimentResults: SentimentResult[];
}

export default function SentimentAnalysisSection({
  isAnalyzing,
  sentimentResults,
}: SentimentAnalysisSectionProps) {
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  sentimentResults.forEach((result) => {
    if (result.dominant_sentiment) {
      sentimentCounts[result.dominant_sentiment]++;
    }
  });

  const total = sentimentResults.length || 1;
  const sentimentDistribution = {
    positive: Math.round((sentimentCounts.positive / total) * 100),
    neutral: Math.round((sentimentCounts.neutral / total) * 100),
    negative: Math.round((sentimentCounts.negative / total) * 100),
  };

  const overallSentiment = Object.entries(sentimentCounts).sort(
    ([, countA], [, countB]) => countB - countA
  )[0][0];

  // Capitalize first letter for display
  const displaySentiment = (overallSentiment.charAt(0).toUpperCase() +
    overallSentiment.slice(1)) as 'Positive' | 'Neutral' | 'Negative';

  // Determine the color based on sentiment
  const sentimentColor = {
    Positive: 'text-green-600',
    Neutral: 'text-blue-600',
    Negative: 'text-red-600',
  };

  return (
    <Card className="col-span-12 border-2 border-primary/20 p-6 shadow-lg">
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-t-blue-500"></div>
          <p>Analyzing session sentiment...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <h3 className="mb-4 text-lg font-medium">
              Overall Session Sentiment
            </h3>
            <div
              className={`text-4xl font-bold ${sentimentColor[displaySentiment]}`}
            >
              {displaySentiment}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Sentiment Distribution</h3>
            <div className="space-y-4">
              {Object.entries(sentimentDistribution).map(
                ([sentiment, percentage]) => (
                  <div key={sentiment}>
                    <div className="mb-1 flex justify-between">
                      <span>
                        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                      </span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${
                          sentiment === 'positive'
                            ? 'bg-green-500'
                            : sentiment === 'neutral'
                              ? 'bg-blue-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Based on analysis of {sentimentResults.length} transcript segments
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
