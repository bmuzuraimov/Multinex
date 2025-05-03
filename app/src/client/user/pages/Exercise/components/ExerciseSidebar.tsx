import React, { useState } from 'react';
import { useExerciseContext } from '../../../../contexts/ExerciseContext';
import { Link } from 'react-router-dom';
import { 
  BsArrowLeft, 
  BsPencil, 
  BsChevronLeft, 
  BsChevronRight,
  BsInfoCircle,
  BsPen,
  BsKeyboard,
  BsVolumeUp,
  BsCheckCircle
} from 'react-icons/bs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../../../../shadcn/components/ui/dialog';
import { Button } from '../../../../shadcn/components/ui/button';

const ExerciseSidebar: React.FC = () => {
  const { has_quiz, essay_word_count, set_mode, mode, course_id, course_name, topic_terms } = useExerciseContext() || {};
  const [isOpen, setIsOpen] = useState(true);
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-sticky left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-r-lg shadow-lg border-y border-r border-primary-100 hover:bg-primary-50 transition-all duration-300 group"
      >
        <BsChevronRight className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
      </button>
    );
  }

  return (
    <aside className={`z-sticky min-w-xs w-72 max-w-xs h-[calc(100vh-64px)] bg-white border-r border-primary-100 flex flex-col font-montserrat relative transition-all duration-300 ease-in-out shadow-md ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button
        onClick={() => setIsOpen(false)}
        className="absolute -right-3 top-12 p-1.5 text-primary-600 hover:text-primary-700 bg-white shadow-md border border-primary-100 rounded-full transition-colors"
        aria-label="Close sidebar"
      >
        <BsChevronLeft className="w-4 h-4" />
      </button>

      {/* Header section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b border-primary-200">
        {course_id && (
          <Link 
            to={`/course/${course_id}`} 
            className="flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors mb-2 text-sm font-medium"
          >
            <BsArrowLeft className="w-3.5 h-3.5" />
            <span>Back to course</span>
          </Link>
        )}
        
        {course_name && (
          <h1 className="text-lg font-semibold text-primary-900 truncate">
            {course_name}
          </h1>
        )}
      </div>

      {/* Controls section */}
      <div className="p-4 border-b border-primary-100">
        <button
          onClick={() => set_mode?.(mode === 'editing' ? 'typing' : 'editing')}
          className={`flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'editing' 
              ? 'bg-primary-600 text-white shadow-md hover:bg-primary-700' 
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          }`}
        >
          <BsPencil className="w-4 h-4" />
          <span>{mode === 'editing' ? 'Exit Editor Mode' : 'Edit Content'}</span>
        </button>
      </div>

      {/* Summary section */}
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        <h2 className="font-manrope text-sm uppercase tracking-wider font-semibold text-primary-700 mb-3">Summary</h2>
        {topic_terms?.length && topic_terms?.length > 0 && (
          <ul className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent pr-2 flex-1">
            {topic_terms?.map((s: string, index: number) => (
              <li
                key={index}
                className="capitalize rounded-lg p-3 transition-all duration-200 ease-in-out shadow-sm bg-white border border-primary-100 text-primary-800 hover:border-primary-300 hover:shadow"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Learning tools section */}
      <div className="flex-shrink-0 flex flex-col gap-4 p-4 border-t border-primary-100 bg-gray-50">
        <div className="w-full p-4 rounded-lg bg-white border border-primary-100 shadow-sm">
          <h3 className="text-sm font-medium text-primary-800 mb-3">Learning Methods</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <BsPen className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm text-primary-700 font-medium">Write it down</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <BsKeyboard className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm text-primary-700 font-medium">Type it</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <BsVolumeUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm text-primary-700 font-medium">Listen to it</span>
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 font-medium"
            >
              <BsInfoCircle className="w-4 h-4" />
              <span>View Keyboard Shortcuts</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-primary-900">Keyboard Shortcuts</DialogTitle>
            </DialogHeader>
            <ul className="space-y-3 text-primary-800 py-4">
              <li className="flex items-center gap-3 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Tab</kbd>
                <span>Autocomplete the current word</span>
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Click</kbd>
                <span>Move cursor to clicked position</span>
              </li>
              <li className="flex items-center gap-3 p-2 hover:bg-primary-50 rounded-lg transition-colors">
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+C</kbd>
                <span>Change text color</span>
              </li>
            </ul>
            <DialogFooter>
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                type="button"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col gap-y-3 w-full">
          {has_quiz && (
            <button
              onClick={() => set_mode?.('test')}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <BsCheckCircle className="w-4 h-4" />
              <span>Take Quiz</span>
            </button>
          )}
          <div className="flex items-center justify-center w-full">
            <span className="text-sm text-primary-500 font-medium">
              {essay_word_count} words
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ExerciseSidebar;
