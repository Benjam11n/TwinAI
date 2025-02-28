import { create } from 'zustand';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { ChatMessage, PresetType } from '@/types';
import { DEFAULT_PRESETS } from '@/constants';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const DEFAULT_ROLE = { title: '', company: '', description: '' };
const DEFAULT_PRESET = DEFAULT_PRESETS[0];

interface InterviewState {
  role: {
    title: string;
    company: string;
    description: string;
  };
  resume: string;
  preset: PresetType;
  isTranscribing: boolean;
  conversationHistory: ChatMessage[];

  setRole: (role: InterviewState['role']) => void;
  setConversationHistory: (conversationHistory: ChatMessage[]) => void;
  setResume: (resume: string) => void;
  setIsTranscribing: (isTranscribing: boolean) => void;
  setPreset: (preset: PresetType) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  role: DEFAULT_ROLE,
  resume: '',
  preset: DEFAULT_PRESET,
  isTranscribing: false,
  conversationHistory: [],

  setRole: (role) => set({ role }),
  setConversationHistory: (conversationHistory) => set({ conversationHistory }),
  setResume: (resume) => set({ resume }),
  setIsTranscribing: (isTranscribing) => set({ isTranscribing }),
  setPreset: (preset) => set({ preset }),
}));
