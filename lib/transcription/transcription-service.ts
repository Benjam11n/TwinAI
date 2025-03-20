import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-flash-8b';

export class TranscriptionService {
  private readonly model;

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
          text: `Please transcribe the spoken language in this audio accurately.
            If there is no clear speech or only background noise, respond with EMPTY_AUDIO.
            Ignore any background noise, non-speech sounds, or unclear mumbling.
            Only transcribe actual speech that you can confidently understand.`,
        },
      ]);
      let transcription = result.response.text();

      // Check for specific P patterns at the end of the transcription
      if (/[Pp](\s+[Pp]){2,}$/.test(transcription)) {
        // Remove the P pattern from the end
        transcription = transcription.replace(/[Pp](\s+[Pp]){2,}$/, '').trim();

        // If nothing meaningful remains, return empty string
        if (!transcription || transcription.length < 3) {
          return '';
        }
      }

      // Enhanced filtering for various patterns indicating unclear audio
      if (
        // Explicit empty markers
        transcription.includes('EMPTY_AUDIO') ||
        transcription.trim() === '' ||
        // Repetitive single letters with spaces, hyphens, or periods
        /^(\s*[A-Za-z](\s+|-+|\.+))+[A-Za-z]?$/.test(transcription) ||
        // Specific patterns with P
        /P[\s-]+P[\s-]+P/.test(transcription) ||
        // Repeated consonants (more than 3)
        /([bcdfghjklmnpqrstvwxyz])\1{3,}/i.test(transcription) ||
        // Patterns like "Ppppp" or other repeated single consonants
        /\b[bcdfghjklmnpqrstvwxyz]{4,}\b/i.test(transcription) ||
        // Check for "I guess" followed by nonsense (common pattern)
        /I guess[\s.,]+([A-Za-z](\s+|\.+|-+)){2,}$/.test(transcription)
      ) {
        return '';
      }

      return transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }
}
