'use server';

import { RAGDocument, RAGService } from '../rag/rag-service';

// Singleton RAG service instance
let ragService: RAGService | null = null;

// Initialize the RAG service on demand
function getRAGService() {
  if (!ragService) {
    ragService = new RAGService({
      hfApiKey: process.env.HUGGINGFACE_API_KEY!,
      pineconeApiKey: process.env.PINECONE_API_KEY!,
      pineconeIndex: process.env.PINECONE_INDEX!,
    });
  }
  return ragService;
}

export async function clearRAG() {
  // Since we can't directly clear Pinecone, we'll just reset our service
  ragService = null;
  return { success: true };
}

export async function queryRAGForPatient(
  query: string,
  patientId: string,
  maxResults = 3
) {
  try {
    console.log(`[RAG] Querying for patient ${patientId}: "${query}"`);
    const service = getRAGService();

    // Use metadata filtering to find only documents for this patient
    const patientFilter = { patientId };
    const context = await service.queryWithFilter(
      query,
      patientFilter,
      maxResults
    );

    return { success: true, context };
  } catch (error) {
    console.error('Error querying RAG for patient:', error);
    return {
      success: false,
      context: '',
      error: `Query failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function addPatientRAGDocuments(
  documents: RAGDocument[],
  patientId: string
) {
  try {
    console.log(
      `[RAG] Adding ${documents.length} documents for patient ${patientId}`
    );

    // Add patientId to all document metadata
    const docsWithPatientId = documents.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        patientId,
      },
    }));

    const service = getRAGService();

    try {
      await service.addDocuments(docsWithPatientId);
    } catch {
      await service.initialize(docsWithPatientId);
    }

    return { success: true, count: docsWithPatientId.length };
  } catch (error) {
    console.error('Error adding patient RAG documents:', error);
    return {
      success: false,
      error: `Failed to add documents: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function getRAGDocumentsForPatient(patientId: string) {
  try {
    const service = getRAGService();
    const documents = await service.getDocumentsByPatient(patientId);
    return { success: true, documents };
  } catch (error) {
    console.error('Error getting patient documents:', error);
    return {
      success: false,
      documents: [],
      error: `Failed to get documents: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function checkRAGInitialization(patientId: string) {
  try {
    const service = getRAGService();
    const initialized = await service.isInitializedForPatient(patientId);
    return { success: true, initialized };
  } catch (error) {
    console.error('Error checking RAG initialization:', error);
    return { success: false, initialized: false };
  }
}

export async function clearRAGForPatient(patientId: string) {
  try {
    const service = getRAGService();
    await service.clearForPatient(patientId);
    return { success: true };
  } catch (error) {
    console.error('Error clearing RAG for patient:', error);
    return {
      success: false,
      error: `Failed to clear RAG: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function initializeRAGWithDocuments(documents: RAGDocument[]) {
  try {
    if (documents.length === 0) {
      return {
        success: false,
        error: 'Cannot initialize RAG with empty documents.',
      };
    }

    const service = getRAGService();
    await service.initialize(documents);
    return { success: true };
  } catch (error) {
    console.error('Error initializing RAG with documents:', error);
    return {
      success: false,
      error: `Failed to initialize RAG: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
