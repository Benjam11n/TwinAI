'use client';

import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface SessionControlsProps {
  sessionActive: boolean;
  isSaving: boolean;
  toggleSession: () => Promise<void>;
  endSession: () => Promise<void>;
}

export default function SessionControls({
  sessionActive,
  isSaving,
  toggleSession,
  endSession,
}: Readonly<SessionControlsProps>) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={toggleSession}
        variant={sessionActive ? 'destructive' : 'default'}
        className="gap-2"
        disabled={isSaving}
      >
        {sessionActive ? (
          <>
            <MicOff size={16} />
            End Transcription
          </>
        ) : (
          <>
            <Mic size={16} />
            Start Transcription
          </>
        )}
      </Button>
      <Button variant="destructive" onClick={endSession} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'End Session'}
      </Button>
    </div>
  );
}
