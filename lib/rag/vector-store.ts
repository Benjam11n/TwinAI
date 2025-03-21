/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document } from '@langchain/core/documents';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

/**
 * Vector store for storing and retrieving embedded documents using Pinecone with HuggingFace embeddings
 */
export class RAGVectorStore {
  private vectorStore: PineconeStore | null = null;
  private embeddingModel: HuggingFaceInferenceEmbeddings;
  private pineconeClient: Pinecone;
  private indexName: string;
  private namespace: string;

  constructor(
    hfApiKey: string,
    pineconeApiKey: string,
    pineconeHostUrl: string,
    indexName: string,
    embeddingModel: string = 'BAAI/bge-small-en-v1.5',
    namespace: string = ''
  ) {
    // Initialize HuggingFace embedding model
    this.embeddingModel = new HuggingFaceInferenceEmbeddings({
      apiKey: hfApiKey,
      model: embeddingModel,
    });

    // Initialize Pinecone client
    this.pineconeClient = new Pinecone({
      apiKey: pineconeApiKey,
      controllerHostUrl: pineconeHostUrl,
    });

    this.indexName = indexName;
    this.namespace = namespace;
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

    // Get the Pinecone index
    const index = this.pineconeClient.Index(this.indexName);

    // Create the vector store
    this.vectorStore = await PineconeStore.fromDocuments(
      docs,
      this.embeddingModel,
      {
        pineconeIndex: index,
        namespace: this.namespace,
      }
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

  /**
   * Add additional documents to the existing vector store
   */
  async addDocuments(
    documents: { content: string; metadata?: Record<string, any> }[]
  ) {
    if (!this.vectorStore) {
      throw new Error(
        'Vector store not initialized. Call initializeStore first.'
      );
    }

    const docs = documents.map(
      (doc) =>
        new Document({ pageContent: doc.content, metadata: doc.metadata || {} })
    );

    await this.vectorStore.addDocuments(docs);
  }

  /**
   * Delete documents from the vector store by filter
   */
  async deleteDocuments(filter: Record<string, any>) {
    if (!this.vectorStore) {
      throw new Error(
        'Vector store not initialized. Call initializeStore first.'
      );
    }

    // Get the Pinecone index
    const index = this.pineconeClient.Index(this.indexName);

    // Delete documents that match the filter
    await index.namespace(this.namespace).deleteMany({
      filter: filter,
    });
  }
}
