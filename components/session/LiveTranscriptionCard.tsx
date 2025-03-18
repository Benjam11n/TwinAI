'use client';

import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface LiveTranscriptionCardProps {
  isTranscribing: boolean;
  transcription: string | null;
  sessionActive: boolean;
  patientNotes: string;
  setPatientNotes: (notes: string) => void;
}

export default function LiveTranscriptionCard({
  isTranscribing,
  transcription,
  sessionActive,
  patientNotes,
  setPatientNotes,
}: LiveTranscriptionCardProps) {
  return (
    <Card className="p-6 md:col-span-2">
      <h2 className="mb-4 text-xl font-semibold">Live Transcription</h2>

      {isTranscribing && (
        <div className="mb-4 flex items-center gap-2">
          <div className="size-3 animate-pulse rounded-full bg-blue-500"></div>
          <p className="text-sm text-muted-foreground">Processing audio...</p>
        </div>
      )}

      <div className="mb-4 flex items-center rounded-lg border bg-muted/30 p-4">
        {transcription ? (
          <pre className="whitespace-pre-wrap font-sans text-sm">
            {transcription}
          </pre>
        ) : (
          <p className="text-center text-muted-foreground">
            {sessionActive
              ? 'Listening... Transcription will appear here.'
              : 'Start the session to begin recording and transcribing.'}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Therapist Notes
        </h3>
        <Textarea
          className="h-60 w-full rounded-md border bg-background p-2"
          placeholder="Add your session notes here..."
          value={patientNotes}
          onChange={(e) => setPatientNotes(e.target.value)}
        ></Textarea>
      </div>
    </Card>
  );
}
