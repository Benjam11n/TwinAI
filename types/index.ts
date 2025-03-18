export interface ConversationHistoryEntry {
  role: 'twin' | 'therapist';
  content: string;
  timestamp: number;
}

export interface ChatMessage {
  content: string;
  timestamp: number;
}

export type RiskAnalysis = {
  results: {
    message: ConversationHistoryEntry;
    risk: {
      score: number;
      riskLevel: string;
    };
  }[];
  highestRisk: {
    message: ConversationHistoryEntry;
    risk: {
      score: number;
      riskLevel: string;
    };
  };
  overallRiskLevel: string;
};

export type Risk = { score: number; riskLevel: string };

export interface SentimentScore {
  label: 'positive' | 'neutral' | 'negative';
  score: number;
}

export interface SentimentAnalysisData {
  text: string;
  sentiment: SentimentScore[];
  dominant_sentiment: 'positive' | 'neutral' | 'negative';
}

export interface SentimentAnalysisResponse {
  success: boolean;
  data: SentimentAnalysisData;
  status: number;
}

// For use in components with timestamp
export interface SentimentResult extends SentimentAnalysisData {
  timestamp: string | number | Date;
}

export interface SessionView {
  patientId: { _id: string; name: string };
  date: Date;
  patientNotes: string;
  conversationHistory: ConversationHistoryEntry[];
  mood: number;
}
