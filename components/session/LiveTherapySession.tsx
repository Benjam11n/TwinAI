'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { useTranscription } from '@/contexts/LiveTranscriptionContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Textarea } from '../ui/textarea';

export default function LiveTherapySession() {
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<null | NodeJS.Timeout>(
    null
  );

  const {
    transcription: therapyTranscription,
    setTranscription,
    patient,
    setPatientNotes: setStorePatientNotes,
  } = useTherapySessionStore();

  const {
    startTranscription,
    stopTranscription,
    isRecording,
    transcription,
    isTranscribing,
    clearTranscription,
  } = useTranscription();

  const toggleSession = async () => {
    if (!sessionActive) {
      await startTranscription();
      setSessionActive(true);

      const interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);

      toast.success('Therapy session started');
    } else {
      stopTranscription();
      setSessionActive(false);

      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      if (transcription) {
        setTranscription([
          ...therapyTranscription,
          {
            content: transcription,
            timestamp: Date.now(),
          },
        ]);
      }

      toast.info('Therapy session ended');
    }
  };

  // Format session duration as MM:SS
  const formatDuration = () => {
    const minutes = Math.floor(sessionDuration / 60);
    const seconds = sessionDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const saveSession = () => {
    if (!transcription) return;

    if (patientNotes) {
      setStorePatientNotes(patientNotes);
    }

    toast.success('Session saved to store');
  };

  // Reset all session data
  const resetSession = () => {
    if (sessionActive) {
      stopTranscription();
      setSessionActive(false);

      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }

    clearTranscription();
    setPatientNotes('');
    setSessionDuration(0);
    toast.info('Session data cleared');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (isRecording) {
        stopTranscription();
      }
    };
  }, [timerInterval, isRecording, stopTranscription]);

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{`Therapy Session with ${patient?.name}`}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleSession}
            variant={sessionActive ? 'destructive' : 'default'}
            className="gap-2"
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
          <Button
            variant="destructive"
            onClick={() => {
              saveSession();
              router.push(ROUTES.DASHBOARD);
              if (transcription) {
                setTranscription([
                  ...therapyTranscription,
                  {
                    content: transcription,
                    timestamp: Date.now(),
                  },
                ]);
              }
            }}
          >
            End Session
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Session Info</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Patient
              </h3>
              <p className="text-lg">{patient?.name || 'Sarah Johnson'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Condition Profile
              </h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {patient?.conditions?.map((condition, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-3 py-1 text-xs ${
                      index % 3 === 0
                        ? 'bg-blue-100 text-blue-800'
                        : index % 3 === 1
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Session Duration
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${sessionActive ? 'animate-pulse bg-green-500' : 'bg-gray-300'}`}
                ></div>
                <p className="text-lg">{formatDuration()}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={saveSession}
                disabled={!transcription}
              >
                <Save size={16} />
                Save Session
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={resetSession}
              >
                <Trash2 size={16} />
                Reset Session
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Live Transcription</h2>

          {isTranscribing && (
            <div className="mb-4 flex items-center gap-2">
              <div className="size-3 animate-pulse rounded-full bg-blue-500"></div>
              <p className="text-sm text-muted-foreground">
                Processing audio...
              </p>
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
      </div>
    </div>
  );
}
