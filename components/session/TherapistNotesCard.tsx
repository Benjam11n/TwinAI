'use client';

import { Card } from '@/components/ui/card';

interface TherapistNotesCardProps {
  notes?: string;
}

export default function TherapistNotesCard({ notes }: TherapistNotesCardProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Therapist Notes</h2>
      <div className="rounded-lg border bg-muted/30 p-4">
        {notes ? (
          <pre className="whitespace-pre-wrap font-sans">{notes}</pre>
        ) : (
          <p className="py-6 text-center text-muted-foreground">
            No notes were recorded for this session.
          </p>
        )}
      </div>
    </Card>
  );
}
