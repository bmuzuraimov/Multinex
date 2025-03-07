import React, { useState } from 'react';
import { useExerciseContext } from '../contexts/ExerciseContext';

const ExerciseSidebar: React.FC = () => {
  const { hasQuiz, summary, essayWordCount, setMode } = useExerciseContext();
  const [showHintsModal, setShowHintsModal] = useState(false);
  
  return (
    <div className='z-fixed min-w-xs max-w-sm h-[calc(100vh-64px)] p-6 bg-white border-r border-primary-100 flex flex-col font-montserrat'>
      <div className='flex-1 overflow-hidden flex flex-col'>
        <h2 className='font-manrope text-title-sm font-semibold text-primary-900 mb-6'>Summary</h2>
        {summary.length > 0 ? (
          <ul className='space-y-3 overflow-y-auto flex-1'>
            {summary.map((s, index) => (
              <li
                key={index}
                className='rounded-lg p-4 transition-all duration-200 ease-in-out shadow-sm bg-primary-50 text-primary-800 hover:bg-primary-100 hover:shadow-md'
              >
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-secondary-400 text-sm font-normal leading-relaxed p-4 bg-secondary-50 rounded-lg'>
            To enable paragraph summaries:
            <br />
            1. Before uploading
            <br />
            2. Open "Advanced"
            <br />
            3. Check "Include Summary"
          </div>
        )}
      </div>

      <div className='flex-shrink-0 flex flex-col items-center gap-4 mt-6 border-t border-primary-100 pt-6'>
        <div className='w-full p-4 rounded-lg bg-primary-50'>
          <div className='space-y-2.5'>
            <div className='flex items-center gap-3'>
              <span className='text-danger'>●</span>
              <span className='text-sm text-primary-800 font-satoshi'>Write it down</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-success'>●</span>
              <span className='text-sm text-primary-800 font-satoshi'>Type it</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-secondary-500'>●</span>
              <span className='text-sm text-primary-800 font-satoshi'>Listen to it</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowHintsModal(true)}
          className='flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 font-satoshi'
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>More hints</span>
        </button>

        {showHintsModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-modal backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl max-w-md shadow-xl">
              <h3 className="text-title-xsm font-manrope font-semibold text-primary-900 mb-4">Hints</h3>
              <ul className="space-y-3 text-primary-800 font-satoshi">
                <li className="flex items-center gap-3">
                  <span className="font-medium">Tab:</span> Autocomplete the current word
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-medium">Click Text:</span> Move cursor to clicked position
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-medium">Color:</span> Change the color of the highlighted text
                </li>
              </ul>
              <button
                onClick={() => setShowHintsModal(false)}
                className="mt-6 px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className='flex flex-col gap-y-3 items-center justify-between w-full'>
          {hasQuiz && (
            <button
              onClick={() => setMode('test')}
              className='w-full px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md'
            >
              Take Test
            </button>
          )}
          <span className='text-sm text-secondary-400 font-satoshi'>
            Total words: {essayWordCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSidebar;
