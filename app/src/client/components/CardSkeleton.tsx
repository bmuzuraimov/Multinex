import React from 'react';
import { Card, CardContent, CardHeader } from '../shadcn/components/ui/card';
import { Skeleton } from '../shadcn/components/ui/skeleton';
import { cn } from '../../shared/utils';

interface CardSkeletonProps {
  rows?: number;
  blocksPerRow?: number;
  className?: string;
  showHeader?: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 3,
  blocksPerRow = 2,
  className,
  showHeader = true,
}) => {
  return (
    <Card className={cn(
      'w-full overflow-hidden bg-white/50 backdrop-blur-sm border border-primary-100/20 shadow-lg',
      className
    )}>
      {showHeader && (
        <CardHeader className="space-y-4 p-6">
          <Skeleton className="h-8 w-3/4 bg-primary-100/60" />
          <Skeleton className="h-4 w-1/2 bg-primary-50/40" />
        </CardHeader>
      )}
      
      <CardContent className="p-6 pt-0">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              'grid gap-4',
              {
                'grid-cols-1': blocksPerRow === 1,
                'grid-cols-2': blocksPerRow === 2,
                'grid-cols-3': blocksPerRow === 3,
                'grid-cols-4': blocksPerRow === 4,
              },
              rowIndex !== 0 && 'mt-6'
            )}
          >
            {Array.from({ length: blocksPerRow }).map((_, blockIndex) => (
              <div key={blockIndex} className="space-y-3">
                <Skeleton className="h-5 w-full bg-primary-100/40" />
                <Skeleton className="h-4 w-4/5 bg-primary-50/30" />
                <Skeleton className="h-4 w-3/5 bg-primary-50/20" />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
