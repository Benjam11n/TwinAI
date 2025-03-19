'use client';

import React, { useEffect, useState } from 'react';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { analyzeConversationRisks, cn } from '@/lib/utils';
import Link from 'next/link';
import {
  ArrowLeft,
  FileWarning,
  Hourglass,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createDTSession } from '@/lib/actions/dtsession.action';
import { IPatientDoc } from '@/database';
import { ROUTES } from '@/constants/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ReturnButton = ({ patientId }: { patientId: string }) => (
  <Link href={ROUTES.PATIENT_DASHBOARD(patientId)}>
    <Button variant="outline" className="gap-2">
      <ArrowLeft className="size-4" />
      Return to Dashboard
    </Button>
  </Link>
);

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
        return;
      }

      if (riskAnalysis.overallRiskLevel === 'low') {
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

  if (loading) {
    return (
      <div className="container mx-auto space-y-6 p-8">
        <ReturnButton patientId={patient._id as string} />
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <CardContent className="pt-6">
            <Hourglass className="mx-auto mb-4 size-16 animate-pulse text-muted-foreground" />
            <CardTitle className="mb-2 text-xl">
              Analyzing Conversation
            </CardTitle>
            <CardDescription className="max-w-md">
              We&apos;re processing your conversation history to identify
              potential risk patterns.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto space-y-6 p-8">
        <ReturnButton patientId={patient._id as string} />
        <Card className="border-destructive/20">
          <CardHeader className="flex flex-col items-center pb-2 text-center">
            <AlertTriangle className="mb-4 size-16 text-destructive" />
            <CardTitle>Analysis Error</CardTitle>
            <CardDescription className="text-destructive">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              There was a problem analyzing your conversation. Please try again
              later or contact support if this issue persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conversationHistory.length) {
    return (
      <div className="container mx-auto space-y-6 p-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <ReturnButton patientId={patient._id as string} />
          <Button
            onClick={saveAnalysisToDatabase}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="size-4" />
            {isSaving ? 'Saving...' : 'Save Analysis'}
          </Button>
        </div>
        <Card className="text-center">
          <CardHeader className="flex flex-col items-center">
            <FileWarning className="mb-4 size-16 text-muted-foreground" />
            <CardTitle>No Conversation Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              There isn&apos;t any conversation history to analyze yet.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/therapy-session">
              <Button>Start a New Session</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!riskAnalysis?.results?.length) {
    return (
      <div className="container mx-auto space-y-6 p-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <ReturnButton patientId={patient._id as string} />
          <Button
            onClick={saveAnalysisToDatabase}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="size-4" />
            {isSaving ? 'Saving...' : 'Save Analysis'}
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <FileWarning className="mb-4 size-16 text-muted-foreground" />
            <CardTitle>No Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              We couldn&apos;t generate any risk analysis from the current
              conversation. This typically happens when conversations are very
              short or contain only system messages.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function for risk level styling
  const getRiskTextClass = (level: string): string => {
    switch (level) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBgClass = (level: string): string => {
    switch (level) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <ReturnButton patientId={patient._id as string} />
        <Button
          onClick={saveAnalysisToDatabase}
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="size-4" />
          {isSaving ? 'Saving...' : 'Save Analysis'}
        </Button>
      </div>

      <h1 className="mb-6 text-2xl font-bold">Risk Analysis Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'rounded-md p-3 text-lg font-medium',
              getRiskBgClass(riskAnalysis.overallRiskLevel)
            )}
          >
            Risk Level: {riskAnalysis.overallRiskLevel.toUpperCase()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <Card
                    key={result.message.timestamp}
                    className="overflow-hidden"
                  >
                    <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 font-medium">User:</h3>
                        <div className="min-h-[80px] rounded-md bg-muted p-3">
                          {result.message.content}
                        </div>
                        <div
                          className={cn(
                            'mt-3 rounded-md p-2 text-center font-medium',
                            getRiskBgClass(result.risk.riskLevel)
                          )}
                        >
                          Risk: {result.risk.riskLevel.toUpperCase()} (
                          {(result.risk.score * 100).toFixed(1)}%)
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Your Response:</h3>
                        <div className="min-h-[80px] rounded-md bg-primary/10 p-3">
                          {nextMessage.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })
            .filter(Boolean)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>High Risk Dialogs</CardTitle>
        </CardHeader>
        <CardContent>
          {riskAnalysis.results.filter((r) => r.risk.riskLevel === 'high')
            .length > 0 ? (
            <div className="space-y-3">
              {riskAnalysis.results
                .filter((r) => r.risk.riskLevel === 'high')
                .map((result) => (
                  <div
                    key={result.message.timestamp}
                    className="rounded-md border-destructive/20 bg-destructive/5 p-3"
                  >
                    <p className="mb-1 font-medium">
                      User: &quot;{result.message.content}&quot;
                    </p>
                    <p className={cn('text-sm', getRiskTextClass('high'))}>
                      Risk Score: {(result.risk.score * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No high risk dialogs detected in this conversation.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAnalysisDashboard;
