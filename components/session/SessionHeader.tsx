'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';

interface SessionHeaderProps {
  sessionDate: Date;
  patientId: string;
}

export default function SessionHeader({
  sessionDate,
  patientId,
}: Readonly<SessionHeaderProps>) {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => router.push(ROUTES.PATIENT_DASHBOARD(patientId))}
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Patient
        </Button>
        <h1 className="text-3xl font-bold">Session Summary</h1>
        <p className="text-muted-foreground">{sessionDate.toLocaleString()}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Download size={16} /> Export Summary
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText size={16} /> Print Report
        </Button>
      </div>
    </div>
  );
}
