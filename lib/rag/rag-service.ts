/* eslint-disable @typescript-eslint/no-explicit-any */
import { RAGVectorStore } from './vector-store';
import { DocumentProcessor } from './document-processor';

export interface RAGDocument {
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Main RAG service that combines document processing and retrieval
 */
export class RAGService {
  private vectorStore: RAGVectorStore;

  constructor(apiKey: string) {
    this.vectorStore = new RAGVectorStore(apiKey);
  }

  /**
   * Initialize the RAG service with documents
   */
  async initialize(documents: RAGDocument[]) {
    console.log(`Processing ${documents.length} documents for RAG`);

    // Process documents into chunks
    const processedDocs = await DocumentProcessor.processDocuments(documents);
    console.log(`Created ${processedDocs.length} chunks`);

    // Initialize vector store
    await this.vectorStore.initializeStore(processedDocs);
    console.log('Vector store initialized');

    return processedDocs.length;
  }

  /**
   * Retrieve relevant contexts for a query
   */
  async query(query: string, maxResults = 3): Promise<string> {
    const results = await this.vectorStore.search(query, maxResults);

    // Combine results into a context string
    return results.map((doc) => doc.pageContent).join('\n\n');
  }

  /**
   * Generate a prompt with RAG context
   */
  async generatePromptWithContext(
    query: string,
    basePrompt: string,
    maxResults = 3
  ): Promise<string> {
    const context = await this.query(query, maxResults);

    return `
${basePrompt}

Relevant context from documents:
${context}

Please use this context to help answer questions when relevant.
`;
  }
}
