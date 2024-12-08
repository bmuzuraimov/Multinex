import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='relative inline-flex'>
        <div className='w-8 h-8 bg-gray-500 rounded-full'></div>
        <div className='w-8 h-8 bg-gray-500 rounded-full absolute top-0 left-0 animate-ping'></div>
        <div className='w-8 h-8 bg-gray-500 rounded-full absolute top-0 left-0 animate-pulse'></div>
      </div>
    </div>
  );
};

export default Loading;
