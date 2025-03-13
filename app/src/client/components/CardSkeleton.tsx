import React from 'react';

const CardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-2.5 animate-pulse">
      <div className="flex items-center w-full gap-2">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[20%]"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-[15%]"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
      </div>
      <div className="flex items-center w-full gap-2">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 flex-1"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-[15%]"></div>
      </div>
      <div className="flex items-center w-full gap-2">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[50%]"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
      </div>
      <div className="flex items-center w-full gap-2">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 flex-1"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-[15%]"></div>
      </div>
      <div className="flex items-center w-full gap-2">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-[20%]"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-[15%]"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 flex-1"></div>
      </div>
      <div className="flex items-center w-full gap-2">
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-[50%]"></div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 flex-1"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default CardSkeleton;
