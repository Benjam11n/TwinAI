'use client';

import React, { useEffect, useState } from 'react';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { analyzeConversationRisks } from '@/lib/utils';
import Link from 'next/link';
import {
  ArrowLeft,
  FileWarning,
  Hourglass,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { createDTSession } from '@/lib/actions/dtsession.action';
import { IPatientDoc } from '@/database';
import { ROUTES } from '@/constants/routes';

const RiskAnalysisDashboard = ({ patient }: { patient: IPatientDoc }) => {
  const { conversationHistory } = useTherapySessionStore();
  interface RiskAnalysis {
    overallRiskLevel: string;
    results: Array<{
      message: {
        timestamp: number;
        role: string;
        content: string;
      };
      risk: {
        riskLevel: string;
        score: number;
      };
    }>;
  }

  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function runAnalysis() {
      try {
        setLoading(true);
        const analysis = await analyzeConversationRisks(conversationHistory);
        setRiskAnalysis(analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occured');
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

  const saveAnalysisToDatabase = async () => {
    if (!patient?._id) {
      toast.error('No patient selected. Cannot save session.');
      return;
    }

    try {
      setIsSaving(true);

      let riskScore = 0;
      if (!riskAnalysis) {
        riskScore = 0;
      } else if (riskAnalysis.overallRiskLevel === 'low') {
        riskScore = 25;
      } else if (riskAnalysis.overallRiskLevel === 'medium') {
        riskScore = 50;
      } else if (riskAnalysis.overallRiskLevel === 'high') {
        riskScore = 75;
      }

      // Transform the conversation history to match the schema
      const formattedConversationHistory = conversationHistory.map((entry) => ({
        role: entry.role || 'therapist', // Default to therapist if role is missing
        content: entry.content,
        timestamp: entry.timestamp,
      }));

      const sessionData = {
        patientId: patient._id as string,
        date: new Date(),
        conversationHistory: formattedConversationHistory,
        risk: riskScore,
      };

      const result = await createDTSession(sessionData);

      if (result.success) {
        toast.success('Risk analysis saved to database successfully');
      } else {
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'Failed to save session'
        );
      }
    } catch (error) {
      console.error('Error saving analysis to database:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save analysis'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const ReturnButton = () => (
    <Link
      href={ROUTES.PATIENT(patient._id as string)}
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
            We&apos;re processing your conversation history to identify
            potential risk patterns.
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
        <div className="mb-6 flex items-center justify-between">
          <ReturnButton />
          <Button
            onClick={saveAnalysisToDatabase}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="size-4" />
            {isSaving ? 'Saving...' : 'Save Analysis to Database'}
          </Button>
        </div>
        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <FileWarning className="mb-4 size-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No Conversation Data</h2>
          <p className="mb-4 text-gray-600">
            There isn&apos;t any conversation history to analyze yet.
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
        <div className="mb-6 flex items-center justify-between">
          <ReturnButton />
          <Button
            onClick={saveAnalysisToDatabase}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="size-4" />
            {isSaving ? 'Saving...' : 'Save Analysis to Database'}
          </Button>
        </div>
        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <FileWarning className="mb-4 size-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No Analysis Results</h2>
          <p className="mb-4 text-gray-600">
            We couldn&apos;t generate any risk analysis from the current
            conversation. This typically happens when conversations are very
            short or contain only system messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <ReturnButton />
        <Button
          onClick={saveAnalysisToDatabase}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="size-4" />
          {isSaving ? 'Saving...' : 'Save Analysis to Database'}
        </Button>
      </div>

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
        <h2 className="mb-4 text-xl font-semibold">Session Analysis</h2>

        {riskAnalysis.results
          .map((result, index) => {
            const nextMessage =
              index < conversationHistory.length - 1
                ? conversationHistory[
                    conversationHistory.findIndex(
                      (m) => m.timestamp === result.message.timestamp
                    ) + 1
                  ]
                : null;

            if (
              result.message.role === 'twin' &&
              nextMessage &&
              nextMessage.role === 'therapist'
            ) {
              return (
                <div
                  key={result.message.timestamp}
                  className="mb-4 rounded-lg border bg-white p-4 shadow-sm"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <h3 className="mb-2 font-medium">User:</h3>
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

                    <div className="col-span-2 md:col-span-1">
                      <h3 className="mb-2 font-medium">Your Response:</h3>
                      <p className="min-h-[80px] rounded bg-primary/20 p-3">
                        {nextMessage.content}
                      </p>
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
        <h2 className="mb-4 text-xl font-semibold">High Risk Dialogs</h2>
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
                    User: &quot;{result.message.content}&quot;
                  </p>
                  <p className="text-sm text-red-700">
                    Risk Score: {(result.risk.score * 100).toFixed(1)}%
                  </p>
                </div>
              ))
          ) : (
            <p className="p-3 text-gray-600">
              No high risk dialogs detected in this conversation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface RiskBgClassProps {
  level: string;
}

function getRiskBgClass(level: RiskBgClassProps['level']): string {
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

export default RiskAnalysisDashboard;
