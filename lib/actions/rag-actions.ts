'use server';

import { RAGDocument, RAGService } from '../rag/rag-service';

// Singleton RAG service instance
let ragService: RAGService | null = null;

// Initialize the RAG service on demand
function getRAGService() {
  if (!ragService) {
    ragService = new RAGService({
      hfApiKey: process.env.HF_API_KEY!,
      pineconeApiKey: process.env.PINECONE_API_KEY!,
      pineconeHostUrl: process.env.PINECONE_HOST_URL,
      pineconeIndex: process.env.PINECONE_INDEX!,
    });
  }
  return ragService;
}

export async function addRAGDocuments(documents: RAGDocument[]) {
  try {
    const service = getRAGService();

    // Try to add documents first (for existing service)
    try {
      await service.addDocuments(documents);
    } catch (e) {
      // If fails (possibly because not initialized), try to initialize
      await service.initialize(documents);
    }

    return { success: true, count: documents.length };
  } catch (error) {
    console.error('Error adding RAG documents:', error);
    return {
      success: false,
      error: `Failed to add documents: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function initializeRAG() {
  try {
    const service = getRAGService();
    await service.initialize([]);
    return { success: true };
  } catch (error) {
    console.error('Error initializing RAG:', error);
    return {
      success: false,
      error: `Failed to initialize RAG: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function clearRAG() {
  // Since we can't directly clear Pinecone, we'll just reset our service
  ragService = null;
  return { success: true };
}

export async function queryRAG(query: string, maxResults = 3) {
  try {
    const service = getRAGService();
    const context = await service.query(query, maxResults);
    return { success: true, context };
  } catch (error) {
    console.error('Error querying RAG:', error);
    return {
      success: false,
      context: '',
      error: `Query failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
