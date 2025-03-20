import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LiveTherapySessionLoading() {
  return (
    <div className="space-y-8 py-8">
      {/* Header with title and controls */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-80" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-44 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>

      {/* Session cards grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Session Info Card */}
        <Card className="border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-7 w-48" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-7 w-32" />
              </div>
            </div>

            <div className="flex items-center justify-center pt-4">
              <Skeleton className="h-9 w-36" />
            </div>
          </CardContent>
        </Card>

        {/* Live Transcription Card */}
        <Card className="col-span-2 border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-44" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-4">
              <Skeleton className="h-5 w-3/4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
