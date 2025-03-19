'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ConversationHistoryEntry } from '@/database';
import { SentimentResult, SessionView } from '@/types';

interface SessionSummaryClientProps {
  session?: SessionView;
}

export default function SessionSummaryClient({
  session,
}: Readonly<SessionSummaryClientProps>) {
  const router = useRouter();
  const [sentimentResults, setSentimentResults] = useState<SentimentResult[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Only analyze if session exists
    if (session?.conversationHistory?.length) {
      analyzeTranscripts(session.conversationHistory);
    }
  }, [session]);

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

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="mb-4 text-2xl font-bold">Session not found</h1>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 size-4" /> Return to Dashboard
        </Button>
      </div>
    );
  }

  // Calculate sentiment distribution based on dominant_sentiment
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

  const total = sentimentResults.length || 1; // Avoid division by zero
  const sentimentDistribution = {
    positive: Math.round((sentimentCounts.positive / total) * 100),
    neutral: Math.round((sentimentCounts.neutral / total) * 100),
    negative: Math.round((sentimentCounts.negative / total) * 100),
  };

  // Find most common dominant sentiment
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
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() =>
              router.push(ROUTES.PATIENT(String(session.patientId._id)))
            }
          >
            <ArrowLeft className="mr-2 size-4" /> Back to Patient
          </Button>
          <h1 className="text-3xl font-bold">Session Summary</h1>
          <p className="text-muted-foreground">
            {new Date(session.date).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} /> Export Summary
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText size={16} /> Print Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Sentiment Analysis - Highlighted as main component */}
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
                <h3 className="mb-4 text-lg font-medium">
                  Sentiment Distribution
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Positive</span>
                      <span>{sentimentDistribution.positive}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${sentimentDistribution.positive}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Neutral</span>
                      <span>{sentimentDistribution.neutral}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${sentimentDistribution.neutral}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between">
                      <span>Negative</span>
                      <span>{sentimentDistribution.negative}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{ width: `${sentimentDistribution.negative}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Based on analysis of {sentimentResults.length} transcript
                  segments
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Left column - Session Details */}
        <div className="md:col-span-4">
          <Card className="h-full p-6">
            <h2 className="mb-4 text-xl font-semibold">Session Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Patient
                </h3>
                <p className="text-lg">
                  {session.patientId.name || 'Unknown Patient'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Date
                </h3>
                <p>{new Date(session.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Time
                </h3>
                <p>{new Date(session.date).toLocaleTimeString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - Transcription and Notes */}
        <div className="md:col-span-8">
          {/* Transcription */}
          <Card className="mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold">Transcription</h2>
            <div className="max-h-80 overflow-y-auto rounded-lg border bg-muted/30 p-4">
              {session.conversationHistory &&
              session.conversationHistory.length > 0 ? (
                <div className="space-y-4">
                  {session.conversationHistory.map((transcript) => (
                    <div
                      key={transcript.timestamp}
                      className="border-b border-gray-200 pb-3 last:border-0"
                    >
                      <div className="mb-1 flex items-start justify-between">
                        {/* <p className="font-medium">
                          {transcript.speaker || 'Speaker'}
                        </p> */}
                        <span className="text-xs text-muted-foreground">
                          {new Date(transcript.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p>{transcript.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-muted-foreground">
                  No transcription available for this session.
                </p>
              )}
            </div>
          </Card>

          {/* Patient Notes */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Therapist Notes</h2>
            <div className="rounded-lg border bg-muted/30 p-4">
              {session.patientNotes ? (
                <pre className="whitespace-pre-wrap font-sans">
                  {session.patientNotes}
                </pre>
              ) : (
                <p className="py-6 text-center text-muted-foreground">
                  No notes were recorded for this session.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
