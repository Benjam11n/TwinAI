/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentProcessor } from './document-processor';
import { RAGVectorStore } from './vector-store';

export interface RAGDocument {
  content: string;
  metadata?: Record<string, any>;
}

export interface RAGServiceConfig {
  hfApiKey: string;
  pineconeApiKey: string;
  pineconeHostUrl: string;
  pineconeIndex: string;
  embeddingModel?: string;
  pineconeNamespace?: string;
}

/**
 * Main RAG service that combines document processing and retrieval with HuggingFace embeddings
 */
export class RAGService {
  private vectorStore: RAGVectorStore;

  constructor(config: RAGServiceConfig) {
    this.vectorStore = new RAGVectorStore(
      config.hfApiKey,
      config.pineconeApiKey,
      config.pineconeHostUrl,
      config.pineconeIndex,
      config.embeddingModel || 'BAAI/bge-small-en-v1.5',
      config.pineconeNamespace || ''
    );
  }

  /**
   * Initialize the RAG service with documents
   */
  async initialize(documents: RAGDocument[]) {
    console.log(`Processing ${documents.length} documents for RAG`);
    // Process documents into chunks
    const processedDocs = await DocumentProcessor.processDocuments(documents);
    console.log(`Created ${processedDocs.length} chunks`);
    await this.vectorStore.initializeStore(processedDocs);
    console.log(
      'Vector store initialized with Pinecone using HuggingFace embeddings'
    );
    return processedDocs.length;
  }

  /**
   * Add more documents to the existing vector store
   */
  async addDocuments(documents: RAGDocument[]) {
    console.log(`Processing ${documents.length} additional documents for RAG`);
    const processedDocs = await DocumentProcessor.processDocuments(documents);
    console.log(`Created ${processedDocs.length} additional chunks`);
    await this.vectorStore.addDocuments(processedDocs);
    console.log('Documents added to Pinecone vector store');
    return processedDocs.length;
  }

  /**
   * Remove documents from the vector store by metadata filter
   */
  async removeDocuments(filter: Record<string, any>) {
    await this.vectorStore.deleteDocuments(filter);
    console.log('Documents removed from Pinecone vector store');
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
