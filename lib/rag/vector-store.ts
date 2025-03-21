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
    indexName: string,
    embeddingModel: string = 'BAAI/bge-small-en-v1.5',
    namespace: string = ''
  ) {
    // Initialize HuggingFace embedding model with proper authorization
    this.embeddingModel = new HuggingFaceInferenceEmbeddings({
      apiKey: hfApiKey,
      model: embeddingModel,
    });

    // Initialize Pinecone client according to the v2 API
    this.pineconeClient = new Pinecone({
      apiKey: pineconeApiKey,
    });

    this.indexName = indexName;
    this.namespace = namespace;

    console.log(
      `[RAG] Initialized vector store with index '${indexName}' and model '${embeddingModel}'`
    );
  }

  /**
   * Initialize the vector store with documents
   */
  async initializeStore(
    documents: { content: string; metadata?: Record<string, any> }[]
  ) {
    console.log(`[RAG] Initializing store with ${documents.length} documents`);

    // Convert to LangChain Document format
    const docs = documents.map(
      (doc) =>
        new Document({ pageContent: doc.content, metadata: doc.metadata || {} })
    );

    // Get the Pinecone index
    const index = this.pineconeClient.Index(this.indexName);

    // Create the vector store with proper authentication
    this.vectorStore = await PineconeStore.fromDocuments(
      docs,
      this.embeddingModel,
      {
        pineconeIndex: index,
        namespace: this.namespace,
      }
    );

    console.log('[RAG] Vector store initialized successfully');
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

    console.log(`[RAG] Searching for: "${query}" (top ${k} results)`);
    const results = await this.vectorStore.similaritySearch(query, k);
    console.log(`[RAG] Found ${results.length} results`);

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

    console.log(`[RAG] Adding ${documents.length} documents to existing store`);

    // Process in smaller batches to avoid timeouts
    const BATCH_SIZE = 5;

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      console.log(
        `[RAG] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(documents.length / BATCH_SIZE)}`
      );

      const docs = batch.map(
        (doc) =>
          new Document({
            pageContent: doc.content,
            metadata: doc.metadata || {},
          })
      );

      await this.vectorStore.addDocuments(docs);
    }

    console.log('[RAG] Documents added successfully');
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

    console.log(
      `[RAG] Deleting documents with filter: ${JSON.stringify(filter)}`
    );

    // Get the Pinecone index
    const index = this.pineconeClient.Index(this.indexName);

    // Delete documents that match the filter
    await index.namespace(this.namespace).deleteMany({
      filter: filter,
    });

    console.log('[RAG] Documents deleted successfully');
  }

  /**
   * Search for relevant documents based on a query with metadata filtering
   */
  async searchWithFilter(
    query: string,
    filter: Record<string, any>,
    k = 3
  ): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error(
        'Vector store not initialized. Call initializeStore first.'
      );
    }

    console.log(
      `[RAG] Searching with filter ${JSON.stringify(filter)}: "${query}" (top ${k} results)`
    );
    const results = await this.vectorStore.similaritySearch(query, k, filter);
    return results;
  }

  /**
   * Get all documents matching a filter
   */
  async getAllWithFilter(
    filter: Record<string, any>,
    limit = 100
  ): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error(
        'Vector store not initialized. Call initializeStore first.'
      );
    }

    console.log(
      `[RAG] Getting all documents with filter ${JSON.stringify(filter)}`
    );

    try {
      // Use the empty query approach with the vectorStore's similaritySearch
      const results = await this.vectorStore.similaritySearch(
        '',
        limit,
        filter
      );
      console.log(`[RAG] Found ${results.length} documents matching filter`);
      return results;
    } catch (error) {
      console.error('[RAG] Error getting documents with filter:', error);
      return [];
    }
  }
}
