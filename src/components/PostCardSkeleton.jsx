"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
              <Skeleton className="w-5 h-5 rounded-md" />
            </div>

            {/* Content */}
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-4/5 h-4" />

            {/* Image (if any) */}
            <Skeleton className="w-full h-60 rounded-lg" />

            {/* Actions */}
            <div className="flex space-x-4 pt-2">
              <Skeleton className="w-14 h-5 rounded-md" />
              <Skeleton className="w-16 h-5 rounded-md" />
            </div>

            {/* Comment Input */}
            <div className="flex space-x-3 pt-4 border-t">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-full h-20 rounded-md" />
                <div className="flex justify-end">
                  <Skeleton className="w-20 h-8 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
