import { useState } from "react";

interface ExerciseSidebarProps {
  hasQuiz: boolean;
  paragraphIndex: number;
  summary: string[];
  essay_length: number;
  setMode: (mode: 'prompt' | 'typing' | 'submitted' | 'test') => void;
}

const ExerciseSidebar: React.FC<ExerciseSidebarProps> = ({ paragraphIndex, hasQuiz, summary, essay_length, setMode }) => {
  const [showHintsModal, setShowHintsModal] = useState(false);

  return (
    <div className='z-99 min-w-[230px] max-w-[400px] h-[calc(100vh-64px)] p-6 bg-white dark:bg-gray-800 border-r border-gray-200/50 dark:border-gray-700 flex flex-col'>
      <div className='flex-1 overflow-hidden flex flex-col'>
        <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-100 mb-6'>Summary</h2>
        {summary.length > 0 ? (
          <ul className='space-y-2 overflow-y-auto flex-1'>
            {summary.map((s, index) => (
              <li
                key={index}
                className={`rounded-lg p-3 transition duration-200 ease-in-out shadow-sm 
                ${
                  paragraphIndex === index
                    ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 font-bold'
                    : paragraphIndex > index
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-gray-400 dark:text-gray-500 text-sm font-normal leading-relaxed p-4'>
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

      <div className='flex-shrink-0 flex flex-col gap-4 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4'>
        <button 
          onClick={() => setShowHintsModal(true)}
          className='flex items-center gap-2 text-sm text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300'
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>View Typing Hints</span>
        </button>

        {showHintsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Typing Hints</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="font-medium">Tab:</span> Autocomplete the current word
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">Click Text:</span> Move cursor to clicked position
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">Playback:</span> Read the text aloud
                </li>
              </ul>
              <button
                onClick={() => setShowHintsModal(false)}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Total words: {essay_length}
          </span>

          {hasQuiz && (
            <button
              onClick={() => setMode('test')}
              className='px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-50 transition-colors duration-200'
            >
              Take Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSidebar;
