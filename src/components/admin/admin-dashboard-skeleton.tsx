'use client';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-9 w-80" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>

          {/* Admin Management Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <Skeleton className="h-6 w-44 mb-3" />
                <div className="space-y-2">
                  {/* Admin user skeletons */}
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Skeleton className="h-6 w-52 mb-3" />
                <Skeleton className="h-4 w-80 mb-3" />
                <Skeleton className="h-9 w-48" />
              </div>
            </div>
          </div>

          {/* Debug Tools Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="p-6 pt-0 space-y-6">
              {/* Quick Links */}
              <div>
                <Skeleton className="h-6 w-28 mb-3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>

              <Separator />

              {/* Link Additional Providers */}
              <div>
                <Skeleton className="h-6 w-48 mb-3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-36" />
                </div>
              </div>

              <Separator />

              {/* Email Search */}
              <div>
                <Skeleton className="h-6 w-44 mb-3" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>

              <Separator />

              {/* All Users Summary */}
              <div>
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-28 mb-2" />
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm p-2 border rounded"
                            >
                              <Skeleton className="h-3 flex-1" />
                              <Skeleton className="h-3 w-12" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <Skeleton className="h-6 w-40 mb-3" />
                <Skeleton className="h-4 w-96 mb-3" />
                <Skeleton className="h-9 w-56" />
              </div>
            </div>
          </div>

          {/* Setup Instructions Skeleton */}
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
              <Skeleton className="h-7 w-60" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="p-6 pt-0 space-y-6">
              <div>
                <Skeleton className="h-6 w-48 mb-3" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-full mb-2" />
                      {i === 1 && (
                        <Skeleton className="h-12 w-full rounded-md" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
