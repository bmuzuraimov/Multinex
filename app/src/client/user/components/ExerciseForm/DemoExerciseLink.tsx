import React from 'react';
import { Link } from 'react-router-dom';
import { BsFiletypeAi } from 'react-icons/bs';
import { DemoExerciseResult } from './types';

interface DemoExerciseLinkProps {
  demo_exercise: DemoExerciseResult;
}

const DemoExerciseLink: React.FC<DemoExerciseLinkProps> = ({ demo_exercise }) => {
  return (
    <Link
      to={`/create-demo`}
      className='w-full h-full flex flex-col items-center bg-white transition-all duration-300 ease-in-out pointer-events-auto'
    >
      <div className='flex h-full items-center justify-center w-full max-w-5xl mx-auto px-6 py-12'>
        <div className='flex flex-col items-center p-8 justify-center w-full rounded-2xl cursor-pointer bg-gradient-to-br from-primary-50 to-white border border-primary-100 shadow-lg hover:shadow-xl transition-all duration-300'>
          <div className='flex flex-col items-center space-y-6'>
            <div className='p-6 bg-primary-50 rounded-full shadow-sm'>
              <BsFiletypeAi className='w-12 h-12 text-primary-500' />
            </div>
            <div className='text-center space-y-2'>
              <h3 className='font-manrope text-title-sm font-semibold text-gray-900'>Ready to start your exercise</h3>
              <p className='font-satoshi text-lg text-primary-900'>"{demo_exercise?.exercise?.name}"</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DemoExerciseLink; 