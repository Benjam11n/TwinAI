import { LucideIcon } from 'lucide-react';

export interface Role {
  title: string;
  company: string;
  description: string;
  preset: string;
}

export interface PresetType {
  id: string;
  name: string;
  description: string;
  personality: string;
}

export interface FeedbackMetric {
  category: string;
  score: number;
  feedback: string;
  icon: LucideIcon;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
