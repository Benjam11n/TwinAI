import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-flash-8b';

export class TranscriptionService {
  private model;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  async transcribeAudio(audioBase64: string, mimeType: string = 'audio/wav'): Promise<string> {
    try {
      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: audioBase64,
          },
        },
        {
          text: `Please transcribe the spoken language in this audio accurately. 
          If there is no clear speech or only background noise, respond with EMPTY_AUDIO.
          Ignore any background noise, non-speech sounds, or unclear mumbling.
          Only transcribe actual speech that you can confidently understand.`,
        },
      ]);

      const transcription = result.response.text();

      if (transcription.includes('EMPTY_AUDIO') || transcription.trim() === '') {
        return '';
      }

      return transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }
}
