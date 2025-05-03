import React, { useState } from 'react';
import { type Option } from 'wasp/entities';
import { useExerciseContext } from '../../../../contexts/ExerciseContext';
import { cn } from '../../../../../shared/utils';

const ExerciseTest: React.FC<{
  title: string;
  questions: any[];
}> = ({ title, questions }) => {
  const context = useExerciseContext();
  const [selected_options, setSelected_options] = useState<{ [key: string]: string }>({});
  const [show_results, setShow_results] = useState<boolean>(false);

  const handleOptionChange = (question_id: string, option_value: string) => {
    setSelected_options((prev: { [key: string]: string }) => ({
      ...prev,
      [question_id]: option_value,
    }));
  };

  const handleSubmit = () => {
    setShow_results(true);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-white font-manrope py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-montserrat text-title-xl font-light tracking-tight text-primary-900 mb-4">
              {title} <span className="font-semibold">Assessment</span>
            </h1>
            <div className="h-1 w-24 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          <div className="text-secondary-600 font-satoshi text-base leading-relaxed p-6 text-center bg-secondary-50 rounded-xl shadow-sm">
            To enable assessment questions:<br/>
            1. Before uploading<br/>
            2. Open "Advanced"<br/> 
            3. Check "Include MC Quiz"
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="button"
              onClick={() => context?.set_mode('typing')}
              className="group relative px-8 py-3 bg-primary-500 text-white font-satoshi text-sm font-medium rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-primary-300 group-hover:text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <div className="min-h-screen bg-white font-manrope py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-montserrat text-title-xl font-light tracking-tight text-primary-900 mb-4">
            {title} <span className="font-semibold">Assessment</span>
          </h1>
          <div className="h-1 w-24 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div 
              key={question.id} 
              className="bg-white rounded-xl shadow-lg p-8 border border-primary-100 hover:border-primary-200 transition-all duration-300"
            >
              <h2 className="font-montserrat text-title-sm text-primary-900 leading-relaxed mb-6">
                <span className="text-primary-500 mr-3">Q{qIndex + 1}.</span>
                {question.text}
              </h2>
              
              <div className="space-y-4 pl-8">
                {question.options.map((option: Option, oIndex: number) => {
                  const isSelected = selected_options[question.id] === option.text;
                  const isCorrect = option.is_correct && show_results;
                  
                  return (
                    <div 
                      key={oIndex}
                      className={cn(
                        'relative flex items-center p-4 rounded-lg transition-all duration-200',
                        isSelected ? 'bg-primary-50' : 'hover:bg-secondary-50'
                      )}
                    >
                      <input
                        type="radio"
                        id={`question-${qIndex}-option-${oIndex}`}
                        name={`question-${qIndex}`}
                        value={option.text}
                        onChange={() => handleOptionChange(question.id, option.text)}
                        className="h-5 w-5 text-primary-500 border-2 border-primary-200 focus:ring-primary-500 focus:ring-offset-2"
                      />
                      <label
                        htmlFor={`question-${qIndex}-option-${oIndex}`}
                        className={cn(
                          'ml-4 font-satoshi text-base',
                          show_results && option.is_correct
                            ? 'text-success font-medium'
                            : show_results && isSelected && !option.is_correct
                            ? 'text-danger'
                            : 'text-primary-800'
                        )}
                      >
                        {option.text}
                      </label>
                    </div>
                  );
                })}
              </div>

              {show_results && (
                <div className="mt-6 pl-8 font-satoshi">
                  {selected_options[question.id] ? (
                    question.options.find((opt: Option) => opt.text === selected_options[question.id])?.is_correct ? (
                      <div className="flex flex-col">
                        <div className="flex items-center text-success">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Correct Response</span>
                        </div>
                        {question.options.find((opt: Option) => opt.text === selected_options[question.id])?.explanation && (
                          <p className="mt-2 text-primary-700 bg-primary-50 p-3 rounded-lg">
                            {question.options.find((opt: Option) => opt.text === selected_options[question.id])?.explanation}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center text-danger">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="font-medium">Incorrect Response</span>
                        </div>
                        {question.options.find((opt: Option) => opt.text === selected_options[question.id])?.explanation && (
                          <p className="mt-2 text-danger-700 bg-danger-50 p-3 rounded-lg">
                            {question.options.find((opt: Option) => opt.text === selected_options[question.id])?.explanation}
                          </p>
                        )}
                        {question.options.find((opt: Option) => opt.is_correct)?.explanation && (
                          <p className="mt-2 text-success-700 bg-success-50 p-3 rounded-lg">
                            <span className="font-medium">Correct explanation: </span>
                            {question.options.find((opt: Option) => opt.is_correct)?.explanation}
                          </p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="flex items-center text-tertiary-500">
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
            className="group relative px-8 py-3 bg-secondary-500 text-white font-satoshi text-sm font-medium rounded-lg shadow-md hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-300"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-secondary-300 group-hover:text-secondary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Verify Responses
          </button>
          <button
            type="button"
            onClick={() => context?.set_mode('typing')}
            className="group relative px-8 py-3 bg-primary-500 text-white font-satoshi text-sm font-medium rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-primary-300 group-hover:text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
