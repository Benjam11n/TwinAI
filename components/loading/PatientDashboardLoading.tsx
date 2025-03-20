import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientDashboardLoading() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <header className="mt-14 flex h-12 items-center justify-between px-6">
          <Skeleton className="h-8 w-64" />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col space-y-6">
            {/* Session Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              <SessionCardSkeleton />
              <SessionCardSkeleton />
            </div>
            {/* Analytics and Treatment Section Skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
              <AnalyticsCardSkeleton />
              <AnalyticsCardSkeleton />
              <AnalyticsCardSkeleton />
            </div>
            {/* Knowledge Base Section Skeleton */}
            <div className="space-y-4">
              <Tabs defaultValue="manual" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="documents">Document Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-md" />
                </TabsContent>
                <TabsContent value="documents" className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-md" />
                </TabsContent>
              </Tabs>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SessionCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="mt-8 flex items-center justify-center">
        <Skeleton className="size-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="mx-auto h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="mt-6">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

function AnalyticsCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Skeleton className="size-6" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
