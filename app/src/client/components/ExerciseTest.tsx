import React, { useState } from 'react';
import { type Option } from 'wasp/entities';
import { useExerciseContext } from '../contexts/ExerciseContext';

const ExerciseTest: React.FC<{
  title: string;
  questions: any[];
}> = ({ title, questions }) => {
  const { setMode } = useExerciseContext();
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleOptionChange = (questionId: string, optionValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light tracking-tight text-gray-900 dark:text-gray-100 mb-2">
              {title} <span className="font-semibold">Assessment</span>
            </h1>
            <div className="h-1 w-24 bg-teal-500 mx-auto rounded-full"></div>
          </div>
          <div className="text-gray-400 dark:text-gray-500 text-sm font-normal leading-relaxed p-4 text-center">
            To enable assessment questions:<br/>
            1. Before uploading<br/>
            2. Open "Advanced"<br/> 
            3. Check "Include MC Quiz"
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => setMode('typing')}
              className="group relative px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-medium rounded-lg shadow-lg hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-teal-400 group-hover:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Begin Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            {title} <span className="font-semibold">Assessment</span>
          </h1>
          <div className="h-1 w-24 bg-teal-500 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div 
              key={question.id} 
              className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
            >
              <h2 className="text-xl text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-6">
                <span className="text-teal-600 dark:text-teal-400 mr-3">Q{qIndex + 1}.</span>
                {question.text}
              </h2>
              
              <div className="space-y-4 pl-8">
                {question.options.map((option: Option, oIndex: number) => {
                  const isSelected = selectedOptions[question.id] === option.text;
                  const isCorrect = option.isCorrect && showResults;
                  
                  return (
                    <div 
                      key={oIndex}
                      className={`relative flex items-center p-4 rounded-lg transition-all duration-200
                        ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                    >
                      <input
                        type="radio"
                        id={`question-${qIndex}-option-${oIndex}`}
                        name={`question-${qIndex}`}
                        value={option.text}
                        onChange={() => handleOptionChange(question.id, option.text)}
                        className="h-5 w-5 text-teal-600 border-2 border-gray-300 dark:border-gray-600 focus:ring-teal-500 focus:ring-offset-2"
                      />
                      <label
                        htmlFor={`question-${qIndex}-option-${oIndex}`}
                        className={`ml-4 text-base ${
                          showResults && option.isCorrect
                            ? 'text-green-600 dark:text-green-400 font-medium'
                            : showResults && isSelected && !option.isCorrect
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.text}
                      </label>
                    </div>
                  );
                })}
              </div>

              {showResults && (
                <div className="mt-6 pl-8">
                  {selectedOptions[question.id] ? (
                    question.options.find((opt: Option) => opt.text === selectedOptions[question.id])?.isCorrect ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Correct Response</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 dark:text-red-400">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-medium">Incorrect Response</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-medium">No Response Selected</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-6 mt-12">
          <button
            type="button"
            onClick={handleSubmit}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-blue-400 group-hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Verify Responses
          </button>
          <button
            type="button"
            onClick={() => setMode('typing')}
            className="group relative px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-medium rounded-lg shadow-lg hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-teal-400 group-hover:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Begin Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTest;
