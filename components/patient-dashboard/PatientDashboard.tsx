'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { patients } from '@/data/data';
import { LiveSessionCard } from './LiveSessionCard';
import { DigitalTwinCard } from './DigitalTwinCard';
import { MoodAnalysisCard } from './MoodAnalysisCard';
import { TreatmentPlansCard } from './TreatmentPlansCard';
import { RecentSessionsCard } from './RecentSessionsCard';
import { ManualKnowledgeEntryForm } from './ManualKnowledgeEntry';
import { DocumentUploader } from './DocumentUploader';
import { KnowledgeBaseEntries } from './KnowledgeBaseEntries';

export default function PatientDashboard({ patient }: { patient: string }) {
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
  const currentPatient = patients.find((p) => p.name === decodedPatientName);

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-bold tracking-tight">
            {decodedPatientName}&apos;s Therapy Dashboard
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col space-y-6">
            {/* Analytics and Treatment Section */}
            <div className="grid gap-6 md:grid-cols-3">
              <MoodAnalysisCard />
              <TreatmentPlansCard patient={currentPatient || patients[0]} />
              <RecentSessionsCard />
            </div>

            {/* Session Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <LiveSessionCard patient={currentPatient || null} />
              <DigitalTwinCard patientName={decodedPatientName} />
            </div>

            {/* Knowledge Base Section */}
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
