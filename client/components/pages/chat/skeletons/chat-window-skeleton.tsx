'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type ChatWindowSkeletonProps = {
  className?: string;
  rows?: number;
  animate?: boolean;
};

export default function ChatWindowSkeleton({
  className,
  rows = 6,
  animate = true,
}: ChatWindowSkeletonProps) {
  const items = Array.from({ length: rows });

  return (
    <div className={cn('flex flex-col gap-4 h-full rounded-md overflow-hidden mb-4', className)}>
      <div className="flex flex-col items-start gap-4">
        {items.map((_, idx) => {
          const isUser = idx % 2 === 1;
          return (
            <div
              key={idx}
              data-sender={isUser ? 'user' : 'system'}
              className={cn(
                'flex items-start w-9/12 gap-4',
                isUser && 'flex-row-reverse ml-auto'
              )}
            >
              <div className="rounded-full">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>

              <div
                className={cn(
                  'flex flex-col gap-2 p-3 rounded-md bg-primary-foreground/40 text-muted min-w-[40%] max-w-full'
                )}
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                {idx % 3 !== 0 && <Skeleton className="h-4 w-1/2" />}

                <div className="pt-1">
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        ${!animate ? `.animate-pulse { animation: none; }` : ''}
      `}</style>
    </div>
  );
}
