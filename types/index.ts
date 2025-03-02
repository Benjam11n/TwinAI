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
