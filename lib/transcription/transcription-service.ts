import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-flash-8b';

export class TranscriptionService {
  private model;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  async transcribeAudio(
    audioBase64: string,
    mimeType: string = 'audio/wav'
  ): Promise<string> {
    try {
      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: audioBase64,
          },
        },
        {
          text: 'Please transcribe the spoken language in this audio accurately. Ignore any background noise or non-speech sounds.',
        },
      ]);
      return result.response.text();
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }
}
