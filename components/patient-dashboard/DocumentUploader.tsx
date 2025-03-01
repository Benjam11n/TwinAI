'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UploadCloud, FileText, X, Check, AlertCircle } from 'lucide-react';
import { RAGDocument } from '@/lib/rag/rag-service';

type DocumentUploaderProps = {
  onDocumentsAdded: (documents: RAGDocument[]) => Promise<void>;
  onInitializeRAG: () => Promise<void>;
};

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentsAdded,
  onInitializeRAG,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(Array.from(fileList));
    }
  };

  const processFiles = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newDocuments: RAGDocument[] = [];

      for (const file of files) {
        // Only process text files for simplicity
        if (
          file.type === 'text/plain' ||
          file.name.endsWith('.txt') ||
          file.name.endsWith('.md')
        ) {
          const text = await file.text();
          newDocuments.push({
            content: text,
            metadata: {
              filename: file.name,
              fileType: file.type,
              uploadDate: new Date().toISOString(),
            },
          });
        } else {
          console.warn(`Skipping unsupported file type: ${file.type}`);
        }
      }

      if (newDocuments.length === 0) {
        setError('No supported files found. Please upload text files.');
        setIsLoading(false);
        return;
      }

      // Add to state
      setDocuments((prev) => [...prev, ...newDocuments]);

      // Call the parent handler
      await onDocumentsAdded(newDocuments);

      setSuccess(`${newDocuments.length} documents processed successfully`);
      setFiles([]);
    } catch (err) {
      setError(
        `Error processing files: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRAG = async () => {
    if (documents.length === 0) {
      setError('No documents to initialize RAG with');
      return;
    }

    setIsInitializing(true);
    setError(null);
    setSuccess(null);

    try {
      await onInitializeRAG();
      setSuccess('RAG initialized successfully');
    } catch (err) {
      setError(
        `Error initializing RAG: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>
          Upload documents to enhance your model with relevant information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="documents">Upload Documents</Label>
            <div className="flex items-center gap-2">
              <Input
                id="documents"
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".txt,.md,.pdf"
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={processFiles}
                disabled={isLoading || files.length === 0}
              >
                {isLoading ? 'Processing...' : 'Process'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: .txt, .md (PDF support coming soon)
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded bg-red-50 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="size-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded bg-primary/10 p-2 text-primary dark:bg-green-900/20 dark:text-green-400">
              <Check className="size-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}
        </div>

        {documents.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Available Documents</h3>
                <span className="text-xs text-muted-foreground">
                  {documents.length} documents
                </span>
              </div>
              <div className="max-h-36 space-y-2 overflow-y-auto">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-muted p-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="max-w-xs truncate text-sm">
                        {doc.metadata?.filename || `Document ${index + 1}`}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDocument(index)}
                      className="size-6"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={initializeRAG}
          disabled={isInitializing || documents.length === 0}
        >
          {isInitializing ? (
            'Initializing...'
          ) : (
            <>
              <UploadCloud className="mr-2 size-4" />
              Initialize Knowledge Base
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
