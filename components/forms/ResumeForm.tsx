'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useInterviewStore } from '@/store/useInterviewStore';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import Link from 'next/link';
import { useNavigationFlow } from '@/hooks/use-navigation-flow';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface UploadedFile {
  name: string;
  content: string;
}

async function extractPdfText(file: File): Promise<string> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    // Load the PDF document
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
    let fullText = '';

    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      let pageText = '';
      let lastItem = null;

      // Process text items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const item of textContent.items as any[]) {
        if (lastItem) {
          // Add appropriate spacing
          if (item.x < lastItem.x) {
            // New line if x-coordinate decreases
            pageText += '\n';
          } else if (
            lastItem.y !== item.y &&
            !lastItem.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/)
          ) {
            // Space if y-coordinate changes and not mid-word
            pageText += ' ';
          }
        }

        pageText += item.str;
        lastItem = item;

        // Add newline for EOL markers
        if (item.hasEOL) {
          pageText += '\n';
        }
      }

      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    } else {
      throw new Error('Failed to extract text from PDF');
    }
  }
}

export default function ResumeForm() {
  const router = useRouter();
  const { navigateNext } = useNavigationFlow();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setResume } = useInterviewStore();

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsLoading(true);
    try {
      const newFiles: UploadedFile[] = [];

      if (uploadedFiles.length === 0) {
        return;
      }

      if (files.length + uploadedFiles.length > 5) {
        throw new Error('Maximum of 5 files can be uploaded');
      }

      for (const file of uploadedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(
            `File ${file.name} is too large. Maximum size is 2MB`
          );
        }

        let content: string;

        if (file.type === 'application/pdf') {
          // Handle PDF files
          content = await extractPdfText(file);
        } else if (
          file.type === 'text/plain' ||
          file.type.includes('document')
        ) {
          // Handle text and document files
          content = await file.text();
        } else {
          throw new Error(`Unsupported file type: ${file.type}`);
        }

        // Store the extracted content
        newFiles.push({
          name: file.name,
          content: content,
        });
      }

      setFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error', {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = () => {
    const combinedContent = files
      .map((file) => `[${file.name}]\n${file.content}`)
      .join('\n\n');
    setResume(combinedContent);
    navigateNext();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Upload Your Documents</h1>
          <p className="text-muted-foreground">
            Add any relevant documents to help us understand your background
          </p>
        </div>
        <Card className="animate-fadeIn glass-panel w-full max-w-2xl">
          <CardHeader></CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`
            flex cursor-pointer flex-col items-center
            justify-center gap-4 rounded-lg border-2 border-dashed
            p-8 transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
            ${files.length === 0 ? 'min-h-[200px]' : ''}
          `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="size-8 text-muted-foreground" />
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">
                  Drag & drop your files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX, and TXT files
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files)
                }
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Uploaded Files:</p>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between rounded-md bg-secondary/50 p-2"
                    >
                      <span className="truncate text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.name);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={files.length === 0 || isLoading}
              >
                {isLoading ? 'Processing...' : 'Next Step'}
              </Button>

              <Link
                href={ROUTES.HOME}
                className="text-center text-sm text-muted-foreground hover:text-primary"
              >
                Go back
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
