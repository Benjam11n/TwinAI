'use client';

import {
  MultimodalLiveClient,
  MultimodalLiveAPIClientConnection,
} from './multimodal-live-client';
import { RAGDocument } from '@/lib/rag/rag-service';
import {
  addRAGDocuments,
  clearRAG,
  initializeRAG,
  queryRAG,
} from '@/lib/actions/rag-actions';

export class RAGMultimodalLiveClient extends MultimodalLiveClient {
  private hasInitializedRAG = false;

  constructor(connection: MultimodalLiveAPIClientConnection) {
    super(connection);
  }

  /**
   * Add documents to the RAG system
   */
  async addDocuments(documents: RAGDocument[]) {
    console.log(`Adding ${documents.length} documents to RAG`);
    const result = await addRAGDocuments(documents);

    if (!result.success) {
      console.error('Failed to add documents:', result.error);
      throw new Error(result.error);
    }

    this.hasInitializedRAG = true;
    return result;
  }

  /**
   * Initialize the RAG system
   */
  async initializeRAG() {
    console.log('Initializing RAG');
    const result = await initializeRAG();

    if (!result.success) {
      console.error('Failed to initialize RAG:', result.error);
      throw new Error(result.error);
    }

    this.hasInitializedRAG = true;
    return result;
  }

  /**
   * Clear the RAG system
   */
  async clearRAG() {
    console.log('Clearing RAG');
    const result = await clearRAG();
    this.hasInitializedRAG = false;
    return result;
  }

  /**
   * Query the RAG system
   */
  async queryRAG(query: string, maxResults = 3) {
    if (!this.hasInitializedRAG) {
      console.warn('RAG not initialized, initializing now...');
      await this.initializeRAG();
    }

    console.log(`Querying RAG: "${query}"`);
    const result = await queryRAG(query, maxResults);

    if (!result.success) {
      console.error('RAG query failed:', result.error);
      throw new Error(result.error);
    }

    return result.context;
  }
}
