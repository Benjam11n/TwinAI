'use client';

import React, { useEffect, useState } from 'react';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { analyzeConversationRisks } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, FileWarning, Hourglass, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

const RiskAnalysisDashboard = () => {
  const { conversationHistory } = useTherapySessionStore();
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function runAnalysis() {
      try {
        setLoading(true);
        const analysis = await analyzeConversationRisks(conversationHistory);
        setRiskAnalysis(analysis);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (conversationHistory.length > 0) {
      runAnalysis();
    } else {
      setLoading(false);
    }
  }, [conversationHistory]);

  // Return button at the top
  const ReturnButton = () => (
    <Link
      href="/dashboard"
      className="mb-6 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
    >
      <Button>
        <ArrowLeft className="mr-2 size-4" />
        Return to Dashboard
      </Button>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <ReturnButton />
        <div className="flex flex-col items-center text-center">
          <Hourglass className="mb-4 size-16 animate-pulse" />
          <h2 className="mb-2 text-xl font-semibold">Analyzing Conversation</h2>
          <p className="max-w-md text-gray-600">
            We're processing your conversation history to identify potential
            risk patterns.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ReturnButton />
        <div className="flex flex-col items-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="mb-4 size-16 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Analysis Error</h2>
          <p className="mb-4 text-red-600">{error}</p>
          <p className="text-gray-700">
            There was a problem analyzing your conversation. Please try again
            later or contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }

  if (!conversationHistory.length) {
    return (
      <div className="p-8">
        <ReturnButton />
        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <FileWarning className="mb-4 size-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No Conversation Data</h2>
          <p className="mb-4 text-gray-600">
            There isn't any conversation history to analyze yet.
          </p>
          <Link
            href="/therapy-session"
            className="rounded px-4 py-2 text-white transition-colors"
          >
            <Button>Start a New Session</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (
    !riskAnalysis ||
    !riskAnalysis.results ||
    riskAnalysis.results.length === 0
  ) {
    return (
      <div className="p-8">
        <ReturnButton />
        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <FileWarning className="mb-4 size-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No Analysis Results</h2>
          <p className="mb-4 text-gray-600">
            We couldn't generate any risk analysis from the current
            conversation. This typically happens when conversations are very
            short or contain only system messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ReturnButton />

      <h1 className="mb-6 text-2xl font-bold">Risk Analysis Dashboard</h1>

      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-semibold">Overall Risk Assessment</h2>
        <div
          className={`rounded-md p-3 text-lg font-medium ${getRiskBgClass(riskAnalysis.overallRiskLevel)}`}
        >
          Risk Level: {riskAnalysis.overallRiskLevel.toUpperCase()}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Message Analysis</h2>

        {riskAnalysis.results
          .map((result, index) => {
            // Only show user messages followed by assistant messages to analyze triggers
            const nextMessage =
              index < conversationHistory.length - 1
                ? conversationHistory[
                    conversationHistory.findIndex(
                      (m) => m.timestamp === result.message.timestamp
                    ) + 1
                  ]
                : null;

            if (
              result.message.role === 'therapist' &&
              nextMessage &&
              nextMessage.role === 'twin'
            ) {
              return (
                <div
                  key={result.message.timestamp}
                  className="mb-4 rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 md:col-span-1">
                      <h3 className="mb-2 font-medium">User Message:</h3>
                      <p className="min-h-[80px] rounded bg-gray-100 p-3">
                        {result.message.content}
                      </p>
                      <div
                        className={`mt-3 rounded-md p-2 text-center font-medium ${getRiskBgClass(result.risk.riskLevel)}`}
                      >
                        Risk: {result.risk.riskLevel.toUpperCase()} (
                        {(result.risk.score * 100).toFixed(1)}%)
                      </div>
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <h3 className="mb-2 font-medium">Your Response:</h3>
                      <p className="min-h-[80px] rounded bg-primary/20 p-3">
                        {nextMessage.content}
                      </p>
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <h3 className="mb-2 font-medium">Analysis:</h3>
                      <div className="min-h-[80px] rounded-md border p-3">
                        {getResponseAnalysis(
                          result.risk.score,
                          result.message.content,
                          nextMessage.content
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })
          .filter(Boolean)}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">High Risk Messages</h2>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          {riskAnalysis.results.filter((r) => r.risk.riskLevel === 'high')
            .length > 0 ? (
            riskAnalysis.results
              .filter((r) => r.risk.riskLevel === 'high')
              .map((result) => (
                <div
                  key={result.message.timestamp}
                  className="mb-3 rounded-md border border-red-200 bg-red-50 p-3"
                >
                  <p className="mb-1 font-medium">
                    User: "{result.message.content}"
                  </p>
                  <p className="text-sm text-red-700">
                    Risk Score: {(result.risk.score * 100).toFixed(1)}%
                  </p>
                </div>
              ))
          ) : (
            <p className="p-3 text-gray-600">
              No high risk messages detected in this conversation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getRiskColorClass(level) {
  switch (level) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

function getRiskBgClass(level) {
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getResponseAnalysis(riskScore, userMessage, assistantResponse) {
  // Simple heuristic-based analysis
  if (riskScore > 0.7) {
    return 'Your response appears calm and supportive. Continue monitoring closely and consider following up with specific resources.';
  } else if (riskScore > 0.4) {
    return 'Your response is appropriate for the moderate risk level detected. Maintain this supportive tone in future interactions.';
  } else {
    return 'No concerning patterns detected in this exchange. Your response is suitable for the conversation context.';
  }
}

export default RiskAnalysisDashboard;
