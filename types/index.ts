export interface ConversationHistoryEntry {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

export interface ChatMessage {
  content: string;
  timestamp: number;
}

export type PatientCondition =
  | 'Depression'
  | 'Anxiety'
  | 'PTSD'
  | 'Stress'
  | 'Other';

export type Patient = {
  name: string;
  conditions: PatientCondition[];
};
