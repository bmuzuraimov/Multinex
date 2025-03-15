import React from 'react';
import * as JSX from 'react/jsx-runtime';
import { cn } from '../../shared/utils';

interface CardSkeletonProps {
  rows?: number;
  blocksPerRow?: number;
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 6,
  blocksPerRow = 3,
  className = "w-5/6 mx-auto p-6 sm:p-12 lg:p-20"
}) => {
  return (
    <div className={cn(`${className} space-y-2.5 animate-pulse`, className)}>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center w-full gap-2">
          {[...Array(blocksPerRow)].map((_, blockIndex) => {
            // Alternate between different widths and bg colors for visual variety
            const isHighlighted = (rowIndex + blockIndex) % 2 === 0;
            const width = blockIndex === blocksPerRow - 1 ? "flex-1" : 
                         blockIndex === 0 ? "w-[20%]" : "w-[15%]";
            
            return (
              <div
                key={blockIndex}
                className={`h-2.5 ${
                  isHighlighted 
                    ? "bg-gray-200 dark:bg-gray-700" 
                    : "bg-gray-300 dark:bg-gray-600"
                } rounded-full ${width}`}
              ></div>
            );
          })}
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default CardSkeleton;
