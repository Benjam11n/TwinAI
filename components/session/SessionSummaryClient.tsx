'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SessionView } from '@/types';
import { useSentimentAnalysis } from './useSentimentAnalysis';
import SessionHeader from './SessionHeader';
import TranscriptCard from './TranscriptCard';
import TherapistNotesCard from './TherapistNotesCard';
import SentimentAnalysisSection from './SentimentAnalysisSection';
import SessionDetailsCard from './SessionDetailsCard';

interface SessionSummaryClientProps {
  session?: SessionView;
}

export default function SessionSummaryClient({
  session,
}: Readonly<SessionSummaryClientProps>) {
  const router = useRouter();
  const { sentimentResults, isAnalyzing } = useSentimentAnalysis(
    session?.conversationHistory
  );

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

  const sessionDate = new Date(session.date);
  const patientId = String(session.patientId._id);

  return (
    <div className="container mx-auto py-8">
      <SessionHeader sessionDate={sessionDate} patientId={patientId} />

      <div className="grid gap-6 md:grid-cols-12">
        {/* Sentiment Analysis */}
        <SentimentAnalysisSection
          isAnalyzing={isAnalyzing}
          sentimentResults={sentimentResults}
        />

        {/* Left column - Session Details */}
        <div className="md:col-span-4">
          <SessionDetailsCard session={session} />
        </div>

        {/* Right column - Transcription and Notes */}
        <div className="md:col-span-8">
          {/* Transcription */}
          <TranscriptCard transcripts={session.conversationHistory || []} />

          {/* Patient Notes */}
          <TherapistNotesCard notes={session.patientNotes} />
        </div>
      </div>
    </div>
  );
}
