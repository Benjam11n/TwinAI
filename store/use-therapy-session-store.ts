import { create } from 'zustand';
import { ChatMessage, ConversationHistoryEntry, Patient } from '@/types';

interface TherapySessionState {
  patient: Patient | null;

  isTranscribing: boolean;
  transcription: ChatMessage[];
  conversationHistory: ConversationHistoryEntry[];
  patientNotes: string;

  // Actions
  setPatient: (patient: TherapySessionState['patient']) => void;
  setTranscription: (transcription: ChatMessage[]) => void;
  setConversationHistory: (
    conversationHistory: ConversationHistoryEntry[]
  ) => void;
  setIsTranscribing: (isTranscribing: boolean) => void;
  setPatientNotes: (patientNotes: string) => void;
  resetSession: () => void;
}

export const useTherapySessionStore = create<TherapySessionState>((set) => ({
  patient: null,
  isTranscribing: false,
  transcription: [],
  conversationHistory: [],
  patientNotes: '',

  // Actions
  setPatient: (patient) => set({ patient }),
  setTranscription: (transcription) => set({ transcription }),
  setConversationHistory: (conversationHistory) => set({ conversationHistory }),
  setIsTranscribing: (isTranscribing) => set({ isTranscribing }),
  setPatientNotes: (patientNotes) => set({ patientNotes }),
  resetSession: () =>
    set({
      isTranscribing: false,
      conversationHistory: [],
    }),
}));
