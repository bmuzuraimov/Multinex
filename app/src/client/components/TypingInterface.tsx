import React, { useState, useEffect, useCallback } from 'react';
import Essay from './Essay';
import { BsPlayFill, BsStopFill, BsTextareaT, BsSpeedometer, BsKeyboard, BsArrowRight } from 'react-icons/bs';
import { TEXT_SIZES, PLAYBACK_SPEEDS } from '../../shared/constants';

interface TypingInterfaceProps {
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  progress: number;
  isPlaying: boolean;
  togglePlayback: () => void;
  setCurrentCharacterIndex: (index: number) => void;
  setSpeed: (speed: number) => void;
  speed: number;
  currentCharacterIndex: number;
  onSubmitExercise: () => void;
  setErrorIndices: React.Dispatch<React.SetStateAction<number[]>>;
}



const TypingInterface: React.FC<TypingInterfaceProps> = ({
  essay,
  essayCharsRef,
  progress,
  isPlaying,
  togglePlayback,
  setCurrentCharacterIndex,
  setSpeed,
  speed,
  currentCharacterIndex,
  onSubmitExercise,
  setErrorIndices
}) => {
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [textSize, setTextSize] = useState('2xl');

  const onKeyPress = useCallback(
    async (button: string) => {
      const currentCharacterElement = essayCharsRef.current[currentCharacterIndex];
      const nextCharacterElement = essayCharsRef.current[currentCharacterIndex + 1];
      (currentCharacterElement as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (currentCharacterIndex + 1 === essay.length) {
        onSubmitExercise();
      }

      if (button === '{backspace}') {
        if (currentCharacterIndex === 0) return;
        const prevCharacterElement = essayCharsRef.current[currentCharacterIndex - 1];
        const classesToRemove = [
          'bg-lime-200',
          'dark:bg-lime-800',
          'bg-red-200',
          'dark:bg-red-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white',
        ] as const;
        const currentClassesToRemove = ['border-b-4', 'border-sky-400', 'dark:border-white'];
        prevCharacterElement?.classList.remove(...classesToRemove);
        currentCharacterElement?.classList.remove(...currentClassesToRemove);
        prevCharacterElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
        setCurrentCharacterIndex(currentCharacterIndex - 1);

        return;
      }

      if (button === '{tab}') {
        // Find the start of the current word
        let wordStart = currentCharacterIndex;
        while (wordStart > 0 && essay[wordStart - 1] !== ' ' && essay[wordStart - 1] !== '\n') {
          wordStart--;
        }
        // Find the end of the current word
        let wordEnd = currentCharacterIndex;
        while (wordEnd < essay.length && essay[wordEnd] !== ' ' && essay[wordEnd] !== '\n') {
          wordEnd++;
        }

        // Remove old highlight from current character
        const currentCharElement = essayCharsRef.current[currentCharacterIndex];
        if (currentCharElement) {
          currentCharElement.classList.remove('border-b-4', 'border-sky-400', 'dark:border-white');
        }

        // Highlight the entire word
        for (let i = wordStart; i < wordEnd; i++) {
          const charElement = essayCharsRef.current[i];
          if (charElement) {
            charElement.classList.add('bg-lime-200', 'dark:bg-lime-800');
            charElement.classList.remove(
              'bg-red-200',
              'dark:bg-red-800',
              'border-b-4',
              'border-sky-400',
              'dark:border-white'
            );
          }
        }

        // Update progress
        const newProgress = (wordEnd / essay.length) * 100;

        // Update character index
        setCurrentCharacterIndex(wordEnd);

        // Add border bottom to next character
        const nextCharElement = essayCharsRef.current[wordEnd];
        if (nextCharElement) {
          nextCharElement.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
        }

        return;
      }

      const isCorrect =
        button === essay[currentCharacterIndex] ||
        (button === '{space}' && essay[currentCharacterIndex] === ' ') ||
        (button === '{enter}' && essay[currentCharacterIndex] === '\n');

      if (isCorrect) {
        currentCharacterElement?.classList.add('bg-lime-200', 'dark:bg-lime-800');
        currentCharacterElement?.classList.remove(
          'bg-red-200',
          'dark:bg-red-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white'
        );
      } else {
        setErrorIndices((prevIndices) => [...prevIndices, currentCharacterIndex]);
        currentCharacterElement?.classList.add('bg-red-200', 'dark:bg-red-800');
        currentCharacterElement?.classList.remove(
          'bg-lime-200',
          'dark:bg-lime-800',
          'border-b-4',
          'border-sky-400',
          'dark:border-white'
        );
      }

      nextCharacterElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
      setCurrentCharacterIndex(currentCharacterIndex + 1);

    },
    [
      essay,
      currentCharacterIndex,
      essayCharsRef,
      setCurrentCharacterIndex,
      setErrorIndices,
      onSubmitExercise,
    ]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        onKeyPress('{tab}');
        return;
      }
      if (e.key === 'Backspace') {
        onKeyPress('{backspace}');
        return;
      }
      if (e.key === 'Enter') {
        onKeyPress('{enter}');
        return;
      }
      if (e.key === ' ') {
        onKeyPress('{space}');
        return;
      }
      if (e.key.length === 1) {
        onKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col'>
      <div
        className='absolute top-0 left-0 right-0 bg-blue-600 h-1 rounded-full'
        style={{ width: `${progress}%` }}
      ></div>
      <div className='relative flex-1 w-5/6 mx-auto leading-10 h-full pt-8'>
        {currentCharacterIndex === 0 && (
          <div className='absolute top-6 left-0 flex flex-row items-center space-x-2 z-999 transform -translate-x-[105%] bg-white dark:bg-gray-800 p-1 rounded-lg animate-pulse'>
              <BsKeyboard className='w-5 h-5' />
              <span>Start typing</span>
              <BsArrowRight className='w-5 h-5' />
          </div>
        )}
        <p className='h-full overflow-y-auto'>
          <Essay 
            essay={essay} 
            essayCharsRef={essayCharsRef} 
            setCurrentCharacterIndex={setCurrentCharacterIndex} 
            textSize={textSize}
          />
        </p>
        
        {/* Text Size Controls */}
        <div className='absolute bottom-4 right-36 z-50'>
          <button
            onClick={() => {
              setShowTextSizeMenu(!showTextSizeMenu);
              setShowSpeedMenu(false);
            }}
            className='p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
          >
            <BsTextareaT className='w-5 h-5' />
          </button>
          
          {showTextSizeMenu && (
            <div className='absolute bottom-14 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-48'>
              <div className='flex flex-col space-y-2'>
                <label className='text-sm text-gray-600 dark:text-gray-300'>Text Size</label>
                <input
                  type='range'
                  min='0'
                  max={TEXT_SIZES.length - 1}
                  value={TEXT_SIZES.indexOf(textSize)}
                  onChange={(e) => setTextSize(TEXT_SIZES[parseInt(e.target.value)])}
                  className='w-full accent-teal-500'
                />
                <div className='text-xs text-gray-500 dark:text-gray-400 text-center'>
                  {textSize}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Speed Controls */}
        <div className='absolute bottom-4 right-20 z-50'>
          <button
            onClick={() => {
              setShowSpeedMenu(!showSpeedMenu);
              setShowTextSizeMenu(false);
            }}
            className='p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
          >
            <BsSpeedometer className='w-5 h-5' />
          </button>
          
          {showSpeedMenu && (
            <div className='absolute bottom-14 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-48'>
              <div className='flex flex-col space-y-2'>
                <label className='text-sm text-gray-600 dark:text-gray-300'>Playback Speed</label>
                <input
                  type='range'
                  min='200'
                  max='1000'
                  step='200'
                  value={1200 - speed}
                  onChange={(e) => setSpeed(1200 - parseInt(e.target.value))}
                  className='w-full accent-teal-500'
                />
                <div className='text-xs text-gray-500 dark:text-gray-400 text-center'>
                  {PLAYBACK_SPEEDS[speed as keyof typeof PLAYBACK_SPEEDS]}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Playback Button */}
        <button
          onClick={togglePlayback}
          className='absolute bottom-4 right-4 z-50 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
        >
          {isPlaying ? <BsStopFill className='w-5 h-5' /> : <BsPlayFill className='w-5 h-5' />}
        </button>
      </div>
    </div>
  );
};

export default TypingInterface;