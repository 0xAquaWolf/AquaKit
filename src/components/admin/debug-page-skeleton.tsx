'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export function DebugPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="p-6 pt-0 space-y-6">
              {/* Current User Info */}
              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
              </div>

              {/* Link Additional Providers */}
              <div>
                <Skeleton className="h-6 w-48 mb-3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-36" />
                </div>
              </div>

              {/* Email Search */}
              <div>
                <Skeleton className="h-6 w-44 mb-3" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>

              {/* All Users Summary */}
              <div>
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-28 mb-2" />
                      <div className="max-h-40 space-y-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 border rounded"
                          >
                            <Skeleton className="h-3 flex-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Cleanup */}
              <div className="border-t pt-4">
                <Skeleton className="h-6 w-36 mb-3" />
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-64" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
