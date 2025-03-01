'use client';

import { useTranscription } from '@/contexts/LiveTranscriptionContext';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { useEffect } from 'react';

interface UserTranscriptionProps {
  isModelTurn: boolean;
}

const UserTranscription = ({ isModelTurn }: UserTranscriptionProps) => {
  const {
    startTranscription,
    stopTranscription,
    isRecording,
    transcription,
    isTranscribing,
  } = useTranscription();

  const { conversationHistory, setConversationHistory } =
    useTherapySessionStore();

  useEffect(() => {
    if (transcription) {
      setConversationHistory([
        ...conversationHistory,
        {
          role: 'therapist',
          content: transcription,
          timestamp: Date.now(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcription]);

  useEffect(() => {
    if (!isModelTurn && !isRecording && !isTranscribing) {
      startTranscription();
    } else if (isModelTurn && isRecording) {
      stopTranscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModelTurn, isRecording, isTranscribing]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopTranscription();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  return null;
};

export default UserTranscription;
