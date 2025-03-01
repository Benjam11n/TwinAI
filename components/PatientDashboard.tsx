'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentUploader } from '@/components/DocumentUploader';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { ManualKnowledgeEntryForm } from './ManualKnowledgeEntry';
import { KnowledgeBaseEntries } from './KnowledgeBaseEntries';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { Badge } from './ui/badge';
import { patients } from '@/data/data';

export default function PatientDashboard({ patient }: { patient: string }) {
  const router = useRouter();
  const { setPatient, setConversationHistory } = useTherapySessionStore();

  const {
    addDocuments,
    initializeRAG,
    addManualEntry,
    knowledgeBaseEntries,
    clearRAG,
  } = useLiveAPIContext();

  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitialize = async () => {
    await initializeRAG();
    setIsInitialized(true);
  };

  const decodedPatientName = decodeURIComponent(patient || '');
  const currentPatient = patients.find(
    (patient) => patient.name === decodedPatientName
  );

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-bold tracking-tight">
            {decodedPatientName}'s Therapy Dashboard
          </h1>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col space-y-6">
            {/* Session Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Live Session Card */}
              <Card className="flex flex-col transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="mr-3 rounded-full bg-primary/10 p-2">
                        <Mic className="size-5 text-primary" />
                      </div>
                      Live Therapy Session
                    </CardTitle>
                    <Badge variant="outline" className="font-normal">
                      Real-time
                    </Badge>
                  </div>
                  <CardDescription className="pt-1">
                    Conduct a real-time therapy session with{' '}
                    {decodedPatientName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="mb-4 rounded-full bg-primary/5 p-4">
                          <Mic className="size-10 text-primary/60" />
                        </div>
                        <h3 className="mb-1 font-medium">
                          Voice-Enabled Session
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Start recording and transcribing your therapy
                          conversation. All sessions are securely saved for
                          later review.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    onClick={() => {
                      router.push(ROUTES.SESSION);
                      setPatient(currentPatient || null);
                    }}
                    className="w-full gap-2"
                    variant="default"
                  >
                    <Mic className="size-4" />
                    Start Live Session
                  </Button>
                </CardFooter>
              </Card>

              {/* Digital Twin Session Card */}
              <Card className="flex flex-col transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="mr-3 rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                        <Brain className="size-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Digital Twin Session
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="border-purple-200 bg-purple-50 font-normal text-purple-700 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      AI-Powered
                    </Badge>
                  </div>
                  <CardDescription className="pt-1">
                    Interact with {decodedPatientName}'s digital twin for
                    simulation and analysis
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/30 dark:bg-purple-900/10">
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900/30">
                          <Brain className="size-10 text-purple-500 dark:text-purple-400" />
                        </div>
                        <h3 className="mb-1 font-medium">AI Digital Twin</h3>
                        <p className="text-sm text-muted-foreground">
                          Practice therapeutic approaches with an AI simulation
                          based on the patient's data and previous sessions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    onClick={() => {
                      router.push(ROUTES.DTSESSION);
                      setConversationHistory([]);
                    }}
                    className="w-full gap-2"
                    variant="secondary"
                    style={{
                      backgroundColor: 'rgb(250, 245, 255)',
                      color: 'rgb(107, 33, 168)',
                      borderColor: 'rgb(233, 213, 255)',
                    }}
                  >
                    <Brain className="size-4" />
                    Start Digital Twin Session
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Digital Twin Knowledge Base */}
            <Tabs defaultValue="manual" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="documents">Document Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <ManualKnowledgeEntryForm onEntryAdded={addManualEntry} />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentUploader
                  onDocumentsAdded={addDocuments}
                  onInitializeRAG={initializeRAG}
                />
              </TabsContent>

              <KnowledgeBaseEntries
                entries={knowledgeBaseEntries}
                onClearAll={clearRAG}
                onInitialize={handleInitialize}
                isInitialized={isInitialized}
              />
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
