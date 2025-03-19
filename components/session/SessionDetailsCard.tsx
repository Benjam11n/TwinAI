'use client';

import { Card } from '@/components/ui/card';
import { SessionView } from '@/types';

interface SessionDetailsCardProps {
  session: SessionView;
}

export default function SessionDetailsCard({
  session,
}: Readonly<SessionDetailsCardProps>) {
  const sessionDate = new Date(session.date);

  return (
    <Card className="h-full p-6">
      <h2 className="mb-4 text-xl font-semibold">Session Details</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Patient</h3>
          <p className="text-lg">
            {session.patientId.name || 'Unknown Patient'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
          <p>{sessionDate.toLocaleDateString()}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
          <p>{sessionDate.toLocaleTimeString()}</p>
        </div>
      </div>
    </Card>
  );
}
