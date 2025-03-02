declare global {
  interface CreateSessionParams {
    patientId: string;
    date?: Date;
    patientNotes?: string;
    conversationHistory?: {
      content: string;
      timestamp?: number;
    }[];
    mood: number;
  }

  interface GetSessionParams {
    sessionId: string;
  }

  interface GetPatientSessionParams {
    id: string;
  }
}

export {};
