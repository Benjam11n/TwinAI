'use client';

import { useRouter } from 'next/navigation';
import { Mic } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { useTranscription } from '@/contexts/LiveTranscriptionContext';
import { IPatientDoc } from '@/database';

export function LiveSessionCard({ patient }: { patient: IPatientDoc }) {
  const router = useRouter();
  const { setPatient } = useTherapySessionStore();
  const { clearTranscription } = useTranscription();

  return (
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
          Conduct a real-time therapy session with {patient?.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 rounded-full bg-primary/5 p-4">
                <Mic className="size-10 text-primary/60" />
              </div>
              <h3 className="mb-1 font-medium">Voice-Enabled Session</h3>
              <p className="text-sm text-muted-foreground">
                Start recording and transcribing your therapy conversation. All
                sessions are securely saved for later review.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          onClick={() => {
            router.push(ROUTES.SESSION(patient._id as string));
            setPatient(patient);
            clearTranscription();
          }}
          className="w-full gap-2"
          variant="default"
        >
          <Mic className="size-4" />
          Start Live Session
        </Button>
      </CardFooter>
    </Card>
  );
}
