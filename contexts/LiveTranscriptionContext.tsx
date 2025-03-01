'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import { TranscriptionService } from '@/lib/transcription/transcription-service';

interface TranscriptionContextType {
  startTranscription: () => Promise<void>;
  stopTranscription: () => void;
  isRecording: boolean;
  transcription: string;
  isTranscribing: boolean;
  clearTranscription: () => void;
}

interface TranscriptionProviderProps {
  children: React.ReactNode;
  apiKey: string;
}

const TranscriptionContext = createContext<
  TranscriptionContextType | undefined
>(undefined);

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useTranscription must be used within a TranscriptionProvider'
    );
  }
  return context;
};

export const TranscriptionProvider = ({
  children,
  apiKey,
}: TranscriptionProviderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const intervalRef = useRef(null);
  const transcriptionServiceRef = useRef(null);

  // Initialize the transcription service
  useEffect(() => {
    if (apiKey) {
      transcriptionServiceRef.current = new TranscriptionService(apiKey);
    }
  }, [apiKey]);

  // Function to convert blob to base64
  const convertBlobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Function to send audio data to transcription service
  const transcribeAudio = async (audioData) => {
    setIsTranscribing(true);
    try {
      const base64Audio = await convertBlobToBase64(audioData);

      // Use the TranscriptionService with Gemini
      const result = await transcriptionServiceRef.current.transcribeAudio(
        base64Audio,
        audioData.type
      );

      return result || '';
    } catch (error) {
      console.error('Error during transcription:', error);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  };

  // Start recording and transcription
  const startTranscription = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Process audio chunks at regular intervals for live transcription
      intervalRef.current = setInterval(async () => {
        if (chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          const newTranscript = await transcribeAudio(audioBlob);

          if (newTranscript) {
            setTranscription(newTranscript);
          }

          // Clear processed chunks
          chunksRef.current = [];
        }
      }, 10000); // Process every 10 seconds

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording and transcription
  const stopTranscription = async () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    // Clear the processing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop media recorder
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());

    // Process any remaining audio chunks
    if (chunksRef.current.length > 0) {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
      const finalTranscript = await transcribeAudio(audioBlob);

      if (finalTranscript) {
        setTranscription(finalTranscript);
      }

      chunksRef.current = [];
    }

    setIsRecording(false);
  };

  // Clear transcription
  const clearTranscription = () => {
    setTranscription('');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const value = {
    startTranscription,
    stopTranscription,
    isRecording,
    transcription,
    isTranscribing,
    clearTranscription,
  };

  return (
    <TranscriptionContext.Provider value={value}>
      {children}
    </TranscriptionContext.Provider>
  );
};
