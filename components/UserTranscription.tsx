import { useState, useRef, useEffect } from 'react';
import { TranscriptionService } from '@/lib/transcription/transcription-service';
import { useInterviewStore } from '@/store/useInterviewStore';

const API_KEY = process.env.GEMINI_API_KEY as string;

const UserTranscription = ({ isModelTurn }: { isModelTurn: boolean }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const {
    conversationHistory,
    setConversationHistory,
    isTranscribing,
    setIsTranscribing,
  } = useInterviewStore();

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsTranscribing(true);
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          const base64Audio = await convertBlobToBase64(audioBlob);

          const transcriptionService = new TranscriptionService(API_KEY);
          const result =
            await transcriptionService.transcribeAudio(base64Audio);
          setTranscription(result);
        } catch (error) {
          console.error('Error processing audio:', error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const convertBlobToBase64 = (blob) => {
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

  // Automatically start/stop recording based on isModelTurn
  useEffect(() => {
    if (!isModelTurn && !isRecording && !isTranscribing) {
      startRecording();
    } else if (isModelTurn && isRecording) {
      stopRecording();
    }
  }, [isModelTurn, isRecording, isTranscribing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, []);

  return null;
};

export default UserTranscription;
