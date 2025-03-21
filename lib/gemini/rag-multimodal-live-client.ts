'use client';

import {
  MultimodalLiveClient,
  MultimodalLiveAPIClientConnection,
} from './multimodal-live-client';
import { RAGDocument } from '@/lib/rag/rag-service';
import {
  addPatientRAGDocuments,
  checkRAGInitialization,
  clearRAG,
  clearRAGForPatient,
  getRAGDocumentsForPatient,
  initializeRAGWithDocuments,
  queryRAGForPatient,
} from '@/lib/actions/rag-actions';

export class RAGMultimodalLiveClient extends MultimodalLiveClient {
  private hasInitializedRAG = false;
  private currentPatientId: string | null = null;

  constructor(connection: MultimodalLiveAPIClientConnection) {
    super(connection);
  }

  /**
   * Set current patient context
   */
  setPatientContext(patientId: string) {
    this.currentPatientId = patientId;
    console.log(`[RAG] Set patient context to ${patientId}`);
  }

  /**
   * Add documents to the RAG system for the current patient
   */
  async addDocuments(documents: RAGDocument[]) {
    if (!this.currentPatientId) {
      console.warn(
        '[RAG] No patient context set, documents will not be associated with a patient'
      );
      // Fall back to general RAG action if you want
      // Or throw an error if patient context is required
    }

    console.log(`[RAG] Adding ${documents.length} documents to RAG`);
    const result = await addPatientRAGDocuments(
      documents,
      this.currentPatientId || 'unknown-patient'
    );

    if (!result.success) {
      console.error('Failed to add documents:', result.error);
      throw new Error(result.error);
    }

    this.hasInitializedRAG = true;
    return result;
  }

  /**
   * Query the RAG system for the current patient context
   */
  async queryRAG(query: string, maxResults = 3) {
    if (!this.hasInitializedRAG) {
      console.warn('[RAG] RAG not initialized, initializing now...');
      await this.initializeRAG();
    }

    if (!this.currentPatientId) {
      console.warn(
        '[RAG] No patient context set, querying without patient filter'
      );
      // Fall back to general query or handle as appropriate
    }

    console.log(
      `[RAG] Querying RAG for patient ${this.currentPatientId}: "${query}"`
    );
    const result = await queryRAGForPatient(
      query,
      this.currentPatientId || 'unknown-patient',
      maxResults
    );

    if (!result.success) {
      console.error('RAG query failed:', result.error);
      throw new Error(result.error);
    }

    return result.context;
  }

  async initializeRAG(documents?: RAGDocument[]) {
    if (!documents || documents.length === 0) {
      console.error('Cannot initialize RAG: No documents provided');
      throw new Error('No documents provided for RAG initialization');
    }

    try {
      // Call your server action to initialize RAG with the provided documents
      const result = await initializeRAGWithDocuments(documents);
      if (!result.success) {
        throw new Error(result.error);
      }
      this.hasInitializedRAG = true;
      return result;
    } catch (error) {
      console.error('Error initializing RAG:', error);
      throw error;
    }
  }

  /**
   * Fetch entries for a specific patient
   */
  async getEntriesForPatient(patientId: string): Promise<RAGDocument[]> {
    try {
      // Call your server action to get patient-specific entries
      const result = await getRAGDocumentsForPatient(patientId);
      if (result.success) {
        return result.documents;
      } else {
        console.error('Failed to fetch entries:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching patient entries:', error);
      return [];
    }
  }

  /**
   * Get initialization status for a patient
   */
  async getRAGInitializationStatus(
    patientId: string
  ): Promise<{ initialized: boolean }> {
    try {
      // Call your server action to check initialization status
      const result = await checkRAGInitialization(patientId);
      return { initialized: result.initialized };
    } catch (error) {
      console.error('Error checking RAG initialization:', error);
      return { initialized: false };
    }
  }

  /**
   * Clear RAG for a specific patient
   */
  async clearRAGForPatient(patientId: string) {
    try {
      // Call your server action to clear patient-specific entries
      const result = await clearRAGForPatient(patientId);
      if (!result.success) {
        throw new Error(result.error);
      }
      this.hasInitializedRAG = false;
      return result;
    } catch (error) {
      console.error('Error clearing RAG for patient:', error);
      throw error;
    }
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
}
