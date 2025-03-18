'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranscription } from '@/contexts/LiveTranscriptionContext';
import { IPatientDoc } from '@/database';

interface SessionInfoProps {
  patient: IPatientDoc;
  sessionActive: boolean;
  sessionDuration: number;
  formatDuration: () => string;
  isSaving: boolean;
}

export default function SessionInfo({
  patient,
  sessionActive,
  sessionDuration,
  formatDuration,
  isSaving,
}: SessionInfoProps) {
  const { clearTranscription, stopTranscription, isRecording } =
    useTranscription();

  // Reset all session data
  const resetSession = () => {
    if (sessionActive && isRecording) {
      stopTranscription();
    }

    clearTranscription();
    toast.info('Session data cleared');
  };

  return (
    <Card className="p-6 md:col-span-1">
      <h2 className="mb-4 text-xl font-semibold">Session Info</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Patient</h3>
          <p className="text-lg">{patient?.name || 'Unknown Patient'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Condition Profile
          </h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {patient?.conditions?.map((condition, index) => (
              <span
                key={index}
                className={`rounded-full px-3 py-1 text-xs ${
                  index % 3 === 0
                    ? 'bg-blue-100 text-blue-800'
                    : index % 3 === 1
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                {condition}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Session Duration
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`size-2 rounded-full ${sessionActive ? 'animate-pulse bg-green-500' : 'bg-gray-300'}`}
            ></div>
            <p className="text-lg">{formatDuration()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={resetSession}
            disabled={isSaving}
          >
            <Trash2 size={16} />
            Reset Session
          </Button>
        </div>
      </div>
    </Card>
  );
}
