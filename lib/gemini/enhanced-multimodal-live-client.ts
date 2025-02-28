import {
  isModelTurn,
  isServerContentMessage,
  isTurnComplete,
} from '@/types/multimodal-live-types';

import { pcmToWav } from './audio.utils';
import {
  MultimodalLiveAPIClientConnection,
  MultimodalLiveClient,
} from './multimodal-live-client';
import { TranscriptionService } from '../transcription/transcription-service';
import { blobToJSON } from '../utils';
import { ChatMessage } from '@/types';

export class EnhancedMultimodalLiveClient extends MultimodalLiveClient {
  private transcriptionService: TranscriptionService;
  private accumulatedPcmData: string[] = [];
  private conversationHistory: ChatMessage[] = [];

  constructor(config: MultimodalLiveAPIClientConnection) {
    super(config);
    this.transcriptionService = new TranscriptionService(config.apiKey);
  }

  protected async receive(blob: Blob) {
    // First call the parent's receive method
    await super.receive(blob);

    // Parse the blob to get the message
    const response = await blobToJSON(blob);

    if (isServerContentMessage(response)) {
      const { serverContent } = response;

      // Handle audio data collection
      if (isModelTurn(serverContent)) {
        const audioParts = serverContent.modelTurn.parts.filter(
          (p) => p.inlineData && p.inlineData.mimeType.startsWith('audio/pcm')
        );

        // Accumulate PCM data
        audioParts.forEach((part) => {
          if (part.inlineData?.data) {
            this.accumulatedPcmData.push(part.inlineData.data);
          }
        });
      }

      // When turn is complete, process accumulated audio for transcription
      if (isTurnComplete(serverContent) && this.accumulatedPcmData.length > 0) {
        this.emit('isTranscribing', true);
        try {
          const fullPcmData = this.accumulatedPcmData.join('');
          const wavData = await pcmToWav(fullPcmData, 24000);

          const transcription = await this.transcriptionService.transcribeAudio(
            wavData,
            'audio/wav'
          );

          // Add to conversation history
          this.conversationHistory.push({
            role: 'assistant',
            content: transcription,
            timestamp: Date.now(),
          });

          // Emit the aiTranscription event
          this.emit('aiTranscription', transcription);
          this.emit('conversationUpdate', this.conversationHistory);

          this.log('client.transcription', `Transcription completed`);

          // Clear accumulated data
          this.accumulatedPcmData = [];
        } catch (error) {
          console.error('Transcription error:', error);
          //   this.log('client.error', `Transcription failed: ${error.message}`);
        } finally {
          this.emit('isTranscribing', false);
        }
      }
    }
  }
}
