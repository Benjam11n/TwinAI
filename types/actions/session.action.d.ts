declare global {
  interface CreateSessionParams {
    patientId: string;
    date?: Date;
    patientNotes?: string;
    conversationHistory?: {
      role: 'twin' | 'therapist';
      content: string;
      timestamp?: number;
    }[];
    mood: number;
  }

  interface GetSessionParams {
    sessionId: string;
  }

  interface GetPatientSessionParams {
    patientId: string;
  }
}

export {};
