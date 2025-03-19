import {
  isModelTurn,
  isServerContentMessage,
  isTurnComplete,
  LiveConfig,
} from '@/types/multimodal-live-types';
import { pcmToWav } from './audio.utils';
import {
  MultimodalLiveAPIClientConnection,
  MultimodalLiveClient,
} from './multimodal-live-client';
import { TranscriptionService } from '../transcription/transcription-service';
import { blobToJSON } from '../utils';
import { ConversationHistoryEntry } from '@/types';
import { RAGDocument, RAGService } from '../rag/rag-service';

export class RAGMultimodalLiveClient extends MultimodalLiveClient {
  private readonly transcriptionService: TranscriptionService;
  private readonly ragService: RAGService;
  private accumulatedPcmData: string[] = [];
  private readonly conversationHistory: ConversationHistoryEntry[] = [];
  private ragInitialized: boolean = false;
  private documents: RAGDocument[] = [];

  constructor(config: MultimodalLiveAPIClientConnection) {
    super(config);
    this.transcriptionService = new TranscriptionService(config.apiKey);
    this.ragService = new RAGService(config.apiKey);
  }

  /**
   * Add documents to the RAG system
   */
  async addDocuments(documents: RAGDocument[]): Promise<void> {
    this.documents = [...this.documents, ...documents];
    this.ragInitialized = false;
    console.log(
      `Added ${documents.length} documents to RAG. Total: ${this.documents.length}`
    );
  }

  /**
   * Initialize RAG with current documents
   */
  async initializeRAG(): Promise<void> {
    if (this.documents.length === 0) {
      console.warn('No documents provided for RAG initialization');
      return;
    }

    try {
      const chunkCount = await this.ragService.initialize(this.documents);
      this.ragInitialized = true;
      console.log(
        `RAG initialized with ${chunkCount} chunks from ${this.documents.length} documents`
      );
    } catch (error) {
      console.error('RAG initialization failed:', error);
      throw error;
    }
  }

  /**
   * Connect with RAG capabilities
   */
  async connect(config: LiveConfig): Promise<boolean> {
    // If RAG not initialized and we have documents, initialize it
    if (!this.ragInitialized && this.documents.length > 0) {
      await this.initializeRAG();
    }

    return super.connect(config);
  }

  /**
   * Send message with RAG-enhanced prompt when appropriate
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(parts: any[]): Promise<void> {
    // Check if this is a text message that could benefit from RAG
    const textParts = parts.filter((p) => p.text);

    // If we have initialized RAG and this contains text, enhance with context
    if (this.ragInitialized && textParts.length > 0) {
      const userQuery = textParts[0].text;

      try {
        // Get context for the user's message
        const enhancedPrompt = await this.ragService.generatePromptWithContext(
          userQuery,
          userQuery,
          3 // Get top 3 most relevant chunks
        );

        // Replace the original text with the RAG-enhanced prompt
        const enhancedParts = [...parts];
        enhancedParts.forEach((part) => {
          if (part.text) {
            part.text = enhancedPrompt;
          }
        });

        // Log that we're using RAG
        console.log('Sending message with RAG enhancement');

        // Send the enhanced message
        return super.send(enhancedParts);
      } catch (error) {
        console.error('Error enhancing message with RAG:', error);
        // Fall back to regular sending if RAG fails
        return super.send(parts);
      }
    }

    // If RAG not initialized or no text parts, send normally
    return super.send(parts);
  }

  /**
   * Handle user message with RAG enhancement
   */
  async handleUserMessage(message: string): Promise<void> {
    if (this.ragInitialized) {
      try {
        // Enhance the user message with relevant context
        const enhancedMessage = await this.ragService.generatePromptWithContext(
          message,
          message
        );

        // Send the enhanced message
        return this.send([{ text: enhancedMessage }]);
      } catch (error) {
        console.error('Error enhancing user message with RAG:', error);
        // Fall back to regular sending if RAG fails
        return this.send([{ text: message }]);
      }
    }

    // If RAG not initialized, process normally
    return this.send([{ text: message }]);
  }

  /**
   * Process blob messages from the server
   */
  protected async receive(blob: Blob): Promise<void> {
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
            role: 'twin',
            content: transcription,
            timestamp: Date.now(),
          });

          // If RAG is initialized, enhance future responses with context
          if (this.ragInitialized) {
            // Store the transcription in context for future reference
            await this.ragService.query(transcription, 0); // Just to index it, not using results
          }

          // Emit the aiTranscription event
          this.emit('aiTranscription', transcription);
          this.emit('conversationUpdate', this.conversationHistory);
          this.log('client.transcription', `Transcription completed`);

          // Clear accumulated data
          this.accumulatedPcmData = [];
        } catch (error) {
          console.error('Transcription error:', error);
        } finally {
          this.emit('isTranscribing', false);
        }
      }
    }
  }

  /**
   * Clear all RAG data
   */
  async clearRAG(): Promise<void> {
    try {
      this.documents = [];
      this.ragInitialized = false;
      console.log('RAG data cleared successfully');
    } catch (error) {
      console.error('Failed to clear RAG data:', error);
      throw error;
    }
  }
}
