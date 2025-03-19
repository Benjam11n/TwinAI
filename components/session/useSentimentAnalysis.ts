'use client';

import { useState, useEffect } from 'react';
import { ConversationHistoryEntry } from '@/database';
import { SentimentResult } from '@/types';

export function useSentimentAnalysis(transcripts?: ConversationHistoryEntry[]) {
  const [sentimentResults, setSentimentResults] = useState<SentimentResult[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (transcripts?.length) {
      analyzeTranscripts(transcripts);
    }
  }, [transcripts]);

  async function analyzeTranscripts(transcripts: ConversationHistoryEntry[]) {
    setIsAnalyzing(true);
    const results: SentimentResult[] = [];

    for (const transcript of transcripts) {
      try {
        const response = await fetch('/api/sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: transcript.content }),
        });

        const result = await response.json();
        if (result.success) {
          // Add the timestamp to the sentiment data
          results.push({
            ...result.data,
            timestamp: transcript.timestamp,
          });
        }
      } catch (error) {
        console.error('Error analyzing transcript:', error);
      }
    }

    setSentimentResults(results);
    setIsAnalyzing(false);
  }

  return { sentimentResults, isAnalyzing };
}
