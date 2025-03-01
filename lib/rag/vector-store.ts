/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from 'langchain/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

/**
 * Vector store for storing and retrieving embedded documents
 */
export class RAGVectorStore {
  private vectorStore: MemoryVectorStore | null = null;
  private embeddingModel: GoogleGenerativeAIEmbeddings;

  constructor(apiKey: string) {
    this.embeddingModel = new GoogleGenerativeAIEmbeddings({
      apiKey,
      modelName: 'models/embedding-001',
    });
  }

  /**
   * Initialize the vector store with documents
   */
  async initializeStore(
    documents: { content: string; metadata?: Record<string, any> }[]
  ) {
    // Convert to LangChain Document format
    const docs = documents.map(
      (doc) =>
        new Document({ pageContent: doc.content, metadata: doc.metadata || {} })
    );

    this.vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      this.embeddingModel
    );
    return this.vectorStore;
  }

  /**
   * Search for relevant documents based on a query
   */
  async search(query: string, k = 3): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error(
        'Vector store not initialized. Call initializeStore first.'
      );
    }

    const results = await this.vectorStore.similaritySearch(query, k);
    return results;
  }
}
