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
      config.pineconeIndex,
      config.embeddingModel || 'BAAI/bge-small-en-v1.5',
      config.pineconeNamespace || ''
    );
  }

  /**
   * Initialize the RAG service with documents
   */
  async initialize(documents: RAGDocument[]) {
    if (documents.length === 0) {
      throw new Error('Cannot initialize RAG with empty documents.');
    }

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
    if (documents.length === 0) {
      return 0; // No documents to add
    }

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
   * Get documents for a specific patient
   */
  async getDocumentsByPatient(patientId: string): Promise<RAGDocument[]> {
    console.log(`Fetching documents for patient ${patientId}`);
    const filter = { patientId };
    try {
      // Query all documents with this patient ID
      const results = await this.vectorStore.getAllWithFilter(filter);

      // Convert back to RAGDocument format
      const documents = results.map((doc) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
      }));

      console.log(
        `Found ${documents.length} documents for patient ${patientId}`
      );
      return documents;
    } catch (error) {
      console.error(
        `Error fetching documents for patient ${patientId}:`,
        error
      );
      return [];
    }
  }

  /**
   * Check if RAG is initialized for a specific patient
   */
  async isInitializedForPatient(patientId: string): Promise<boolean> {
    try {
      // Try to get at least one document for this patient
      // If it returns any results, RAG is initialized
      const filter = { patientId };
      const results = await this.vectorStore.searchWithFilter('', filter, 1);
      return results.length > 0;
    } catch (error) {
      console.error(
        `Error checking initialization for patient ${patientId}:`,
        error
      );
      return false;
    }
  }

  /**
   * Clear all documents for a specific patient
   */
  async clearForPatient(patientId: string): Promise<void> {
    console.log(`Clearing all documents for patient ${patientId}`);
    const filter = { patientId };
    await this.removeDocuments(filter);
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
   * Retrieve relevant contexts for a query with metadata filtering
   */
  async queryWithFilter(
    query: string,
    filter: Record<string, any>,
    maxResults = 3
  ): Promise<string> {
    const results = await this.vectorStore.searchWithFilter(
      query,
      filter,
      maxResults
    );
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
