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

export function DigitalTwinCard({ patientName }: { patientName: string }) {
  const router = useRouter();
  const { setConversationHistory } = useTherapySessionStore();
  const { clearTranscription } = useTranscription();

  return (
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
          Interact with {patientName}'s digital twin for simulation and analysis
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
                Practice therapeutic approaches with an AI simulation based on
                the patient's data and previous sessions.
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
            clearTranscription();
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
  );
}
