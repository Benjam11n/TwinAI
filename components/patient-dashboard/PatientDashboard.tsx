'use client';

import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { LiveSessionCard } from './LiveSessionCard';
import { DigitalTwinCard } from './DigitalTwinCard';
import { MoodAnalysisCard } from './MoodAnalysisCard';
import { TreatmentPlansCard } from './TreatmentPlansCard';
import { RecentSessionsCard } from './RecentSessionsCard';
import { ManualKnowledgeEntryForm } from './ManualKnowledgeEntry';
import { DocumentUploader } from './DocumentUploader';
import { KnowledgeBaseEntries } from './KnowledgeBaseEntries';
import { IPatientDoc, ISessionDoc, ITreatmentPlanDoc } from '@/database';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';

interface PatientDashboardProps {
  patient: IPatientDoc;
  treatmentPlans: ITreatmentPlanDoc[] | undefined;
  pastSessions: ISessionDoc[] | undefined;
}

export default function PatientDashboard({
  patient,
  treatmentPlans,
  pastSessions,
}: Readonly<PatientDashboardProps>) {
  const { addManualEntry } = useLiveAPIContext();
  const { setPatient } = useTherapySessionStore();

  useEffect(() => {
    if (patient) {
      setPatient(patient);
    }
  }, [patient, setPatient]);

  const { name } = patient;

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <header className="mt-14 flex h-12 items-center justify-between px-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-2xl">
            {name}&apos;s Dashboard
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col space-y-6">
            {/* Session Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <LiveSessionCard patient={patient || null} />
              <DigitalTwinCard patient={patient} />
            </div>
            {/* Analytics and Treatment Section */}
            <div className="grid gap-6 md:grid-cols-3">
              <MoodAnalysisCard />
              <TreatmentPlansCard
                patient={patient}
                treatmentPlans={treatmentPlans}
              />
              <RecentSessionsCard pastSessions={pastSessions} />
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
                <DocumentUploader />
              </TabsContent>
              <KnowledgeBaseEntries />
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
