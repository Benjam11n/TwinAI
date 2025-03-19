'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { useTranscription } from '@/contexts/LiveTranscriptionContext';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/actions/session.action';
import { ROUTES } from '@/constants/routes';
import { IPatientDoc } from '@/database';
import SessionInfo from './SessionInfo';
import LiveTranscriptionCard from './LiveTranscriptionCard';
import SessionControls from './SessionControls';

interface LiveTherapySessionProps {
  patient: IPatientDoc;
}

export default function LiveTherapySession({
  patient,
}: Readonly<LiveTherapySessionProps>) {
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const { transcription: therapyTranscription, setTranscription } =
    useTherapySessionStore();

  const {
    startTranscription,
    stopTranscription,
    isRecording,
    transcription,
    isTranscribing,
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

  const endSessionAndNavigate = async () => {
    if (!patient?._id) {
      toast.error('No patient selected');
      return;
    }

    setIsSaving(true);
    try {
      // If there's active transcription, add it to the store
      if (transcription) {
        setTranscription([
          ...therapyTranscription,
          {
            content: transcription,
            timestamp: Date.now(),
          },
        ]);
      }

      // Create the session in the database
      const sessionData = {
        patientId: patient._id as string,
        date: new Date(),
        patientNotes: patientNotes,
        conversationHistory: [
          ...therapyTranscription,
          ...(transcription
            ? [
                {
                  content: transcription,
                  timestamp: Date.now(),
                },
              ]
            : []),
        ],
        mood: 100,
      };

      const result = await createSession(sessionData);

      if (result.success) {
        toast.success('Session saved successfully');

        // Navigate to the session summary page
        if (result.data?._id) {
          router.push(
            ROUTES.SESSION_ANALYSIS(
              patient._id as string,
              result?.data?._id as string
            )
          );
        } else {
          router.push(ROUTES.PATIENT_DASHBOARD(patient._id as string));
        }
      } else {
        toast.error('Failed to save session');
        console.error('Error saving session:', result);
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
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
        <SessionControls
          sessionActive={sessionActive}
          isSaving={isSaving}
          toggleSession={toggleSession}
          endSession={endSessionAndNavigate}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SessionInfo
          patient={patient}
          sessionActive={sessionActive}
          sessionDuration={sessionDuration}
          formatDuration={formatDuration}
          isSaving={isSaving}
        />

        <LiveTranscriptionCard
          isTranscribing={isTranscribing}
          transcription={transcription}
          sessionActive={sessionActive}
          patientNotes={patientNotes}
          setPatientNotes={setPatientNotes}
        />
      </div>
    </div>
  );
}
