'use client';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';
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

export function DigitalTwinCard({
  patientName,
  patientId,
}: {
  patientName: string;
  patientId: string;
}) {
  const router = useRouter();
  const { setConversationHistory } = useTherapySessionStore();
  const { clearTranscription } = useTranscription();

  return (
    <Card className="flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <div className="mr-3 rounded-full bg-primary/20 p-2 dark:bg-green-900/30">
              <Brain className="size-5 text-green-600 dark:text-green-400" />
            </div>
            Digital Twin Session
          </CardTitle>
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 font-normal text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300"
          >
            AI-Powered
          </Badge>
        </div>
        <CardDescription className="pt-1">
          Interact with {patientName}&apos;s digital twin for simulation and
          analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="rounded-lg border border-green-100 bg-primary/10 p-4 dark:border-green-900/30">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="mb-4 rounded-full bg-primary/20 p-4 dark:bg-green-900/30">
                <Brain className="size-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-1 font-medium">AI Digital Twin</h3>
              <p className="text-sm text-muted-foreground">
                Practice therapeutic approaches with an AI simulation based on
                the patient&apos;s data and previous sessions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          onClick={() => {
            router.push(ROUTES.DTSESSION(patientId));
            setConversationHistory([]);
            clearTranscription();
          }}
          className="w-full gap-2"
          variant="secondary"
        >
          <Brain className="size-4" />
          Start Digital Twin Session
        </Button>
      </CardFooter>
    </Card>
  );
}
