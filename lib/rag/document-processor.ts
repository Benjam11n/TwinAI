/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

/**
 * Process documents for RAG
 */
export class DocumentProcessor {
  /**
   * Split a document into chunks
   */
  static async splitDocument(
    text: string,
    metadata: Record<string, any> = {},
  ): Promise<{ content: string; metadata: Record<string, any> }[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitText(text);

    return chunks.map((chunk) => ({
      content: chunk,
      metadata: {
        ...metadata,
        chunk_id: `chunk_${Math.random().toString(36).substring(2, 9)}`,
      },
    }));
  }

  /**
   * Process multiple documents
   */
  static async processDocuments(
    documents: { content: string; metadata?: Record<string, any> }[],
  ): Promise<{ content: string; metadata: Record<string, any> }[]> {
    const allChunks: { content: string; metadata: Record<string, any> }[] = [];

    for (const doc of documents) {
      const chunks = await this.splitDocument(doc.content, doc.metadata);
      allChunks.push(...chunks);
    }

    return allChunks;
  }
}
