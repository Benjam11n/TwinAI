declare global {
  interface CreateDTSessionParams {
    patientId: string;
    date?: Date;
    conversationHistory?: {
      content: string;
      timestamp?: number;
    }[];
    risk: number;
  }

  interface GetSDTessionParams {
    sessionId: string;
  }
}

export {};
