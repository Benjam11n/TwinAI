import { BarChart3, ChevronRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { moodHistory } from '@/data/data';

export function MoodAnalysisCard() {
  const latestMood = moodHistory[0].score;
  const previousMood = moodHistory[1].score;
  const change = latestMood - previousMood;
  const isImproving = change > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <BarChart3 className="mr-2 size-5 text-muted-foreground" />
          Mood Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Current Mood Level
              </span>
              <span className="text-sm font-medium">{latestMood}%</span>
            </div>
            <Progress value={latestMood} className="mt-2 h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trend</span>
            <span className={isImproving ? 'text-primary' : 'text-red-600'}>
              <TrendingUp
                className={`mr-1 inline size-4 ${isImproving ? '' : 'rotate-180'}`}
              />
              {Math.abs(change)}% {isImproving ? 'improvement' : 'decline'}
            </span>
          </div>

          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground">
              {latestMood > 60
                ? 'Patient shows positive mood indicators with good engagement.'
                : latestMood > 40
                  ? 'Patient shows moderate mood with some concerns present.'
                  : 'Patient displays significant mood issues requiring attention.'}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full justify-between"
            size="sm"
          >
            View Detailed Analysis
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
