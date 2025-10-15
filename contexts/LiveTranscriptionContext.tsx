'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
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

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscription must be used within a TranscriptionProvider');
  }
  return context;
};

export const TranscriptionProvider = ({ children, apiKey }: TranscriptionProviderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcriptionServiceRef = useRef<TranscriptionService | null>(null);

  // Initialize the transcription service
  useEffect(() => {
    if (apiKey) {
      transcriptionServiceRef.current = new TranscriptionService(apiKey);
    }
  }, [apiKey]);

  // Function to convert blob to base64
  const convertBlobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const transcribeAudio = async (audioData: Blob): Promise<string> => {
    setIsTranscribing(true);
    try {
      const base64Audio = await convertBlobToBase64(audioData);

      if (!transcriptionServiceRef.current) {
        throw new Error('Transcription service not initialized');
      }

      const result = await transcriptionServiceRef.current.transcribeAudio(
        base64Audio,
        audioData.type,
      );

      return result || '';
    } catch (error) {
      console.error('Error during transcription:', error);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  };

  // Start recording but don't transcribe yet
  const startTranscription = async (): Promise<void> => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  // Stop recording and only then transcribe the entire audio
  const stopTranscription = async (): Promise<void> => {
    if (!isRecording || !mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

    // Wait for the final ondataavailable event to fire
    await new Promise<void>((resolve) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => resolve();
      } else {
        resolve();
      }
    });

    // Process the entire audio at once
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

  const clearTranscription = (): void => {
    setTranscription('');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  const value: TranscriptionContextType = {
    startTranscription,
    stopTranscription,
    isRecording,
    transcription,
    isTranscribing,
    clearTranscription,
  };

  return <TranscriptionContext.Provider value={value}>{children}</TranscriptionContext.Provider>;
};
