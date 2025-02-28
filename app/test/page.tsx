'use client';

import React, { useEffect, useState } from 'react';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Brain } from 'lucide-react';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';

export default function InterviewPage() {
  const { role } = useInterviewStore();
  const [activeTab, setActiveTab] = useState('interview');

  const {
    connected,
    connect,
    disconnect,
    volume,
    isTranscribing,
    aiTranscription,
    isModelTurn,
    addDocuments,
    initializeRAG,
  } = useLiveAPIContext();

  // Connect when the component mounts
  useEffect(() => {
    if (!connected) {
      connect().catch((error) => {
        console.error('Failed to connect:', error);
      });
    }

    // Cleanup function to disconnect when component unmounts
    return () => {
      if (connected) {
        disconnect();
      }
    };
  }, [connect, disconnect, connected]);

  return (
    <div className="container mx-auto space-y-6 py-6">
      <h1 className="text-2xl font-bold">
        {role?.title} Interview at {role?.company}
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        <TabsContent value="interview" className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Interviewer</h2>
                <div className="flex gap-2">
                  <Button
                    variant={isModelTurn ? 'secondary' : 'default'}
                    disabled={!connected || isModelTurn}
                  >
                    {isModelTurn ? (
                      <MicOff className="mr-2 size-4" />
                    ) : (
                      <Mic className="mr-2 size-4" />
                    )}
                    {isModelTurn ? 'AI is speaking' : 'Speak Now'}
                  </Button>
                </div>
              </div>

              <div className="h-72 overflow-y-auto rounded-md bg-muted p-4">
                {aiTranscription ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Brain className="size-4 text-primary" />
                      </div>
                      <div>
                        <div className="rounded-lg bg-primary/10 p-3">
                          <p>{aiTranscription}</p>
                        </div>
                        {isTranscribing && (
                          <span className="text-xs text-muted-foreground">
                            Processing...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    {connected
                      ? 'Waiting for the interviewer to speak...'
                      : 'Connecting...'}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(volume * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">Volume</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <DocumentUploader
            onDocumentsAdded={addDocuments}
            onInitializeRAG={initializeRAG}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
