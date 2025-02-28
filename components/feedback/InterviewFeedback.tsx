import React from 'react';
import { Card } from '@/components/ui/card';
import { FeedbackMetric } from '@/types';

interface InterviewFeedbackProps {
  metrics: FeedbackMetric[];
}

export function InterviewFeedback({ metrics }: InterviewFeedbackProps) {
  return (
    <div className="animate-fadeIn w-full space-y-4">
      <h3 className="text-lg font-semibold">Response Analysis</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {metrics.map((metric, index) => (
          <Card key={index} className="space-y-2 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <metric.icon className="size-4 text-primary" />
              </div>
              <h4 className="font-medium">{metric.category}</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${metric.score}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {metric.score}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{metric.feedback}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
