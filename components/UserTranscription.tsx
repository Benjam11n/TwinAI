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

  // Add transcription to conversation when it changes
  useEffect(() => {
    if (transcription) {
      setConversationHistory([
        ...conversationHistory,
        {
          role: 'user',
          content: transcription,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [transcription]);

  useEffect(() => {
    if (!isModelTurn && !isRecording && !isTranscribing) {
      startTranscription();
    } else if (isModelTurn && isRecording) {
      stopTranscription();
    }
  }, [isModelTurn, isRecording, isTranscribing]);

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopTranscription();
      }
    };
  }, [isRecording]);

  return null;
};

export default UserTranscription;
