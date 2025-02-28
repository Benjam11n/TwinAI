'use client';

// import { InterviewFeedback } from '@/components/feedback/InterviewFeedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { useNavigationFlow } from '@/hooks/use-navigation-flow';
import { useInterviewStore } from '@/store/useInterviewStore';

export default function ReviewPage() {
  const { retryInterview, resetProgress } = useNavigationFlow();
  const { connected, connect, disconnect } = useLiveAPIContext();
  const { conversationHistory } = useInterviewStore();

  const startInterview = async () => {
    if (connected) {
      disconnect();
    }
    connect();
    retryInterview();
  };

  return (
    <div className="animate-fadeIn mx-auto w-full max-w-7xl space-y-8 p-8">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Interview Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Overall Score */}
            <Card className="p-4">
              <h3 className="mb-2 text-lg font-semibold">Overall Score</h3>
              <div className="text-4xl font-bold text-primary">
                {/* {Math.floor(
                  currentFeedback.reduce((acc, curr) => acc + curr.score, 0) /
                    currentFeedback.length
                )} */}
                %
              </div>
            </Card>

            {/* Message Count */}
            <Card className="p-4">
              <h3 className="mb-2 text-lg font-semibold">Responses</h3>
              <div className="text-4xl font-bold text-primary">
                {conversationHistory.filter((m) => m.role === 'user').length}
              </div>
            </Card>
          </div>

          {/* Detailed Metrics */}
          {/* <InterviewFeedback metrics={{}} /> */}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={startInterview}>Try Again</Button>
            <Button variant="outline" onClick={resetProgress}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
