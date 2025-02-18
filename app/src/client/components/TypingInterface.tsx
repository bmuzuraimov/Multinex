import React, { useState, useEffect, useCallback } from 'react';
import Essay from './Essay';
import { BsPlayFill, BsStopFill, BsTextareaT, BsKeyboard, BsArrowRight } from 'react-icons/bs';
import { TEXT_SIZES } from '../../shared/constants';
import { useExerciseContext } from '../contexts/ExerciseContext';

const TypingInterface: React.FC = () => {
  const {
    essay,
    essayCharsRef,
    progress,
    isPlaying,
    togglePlayback,
    setCurrentCharacterIndex,
    currentCharacterIndex,
    onSubmitExercise,
    setErrorIndices,
    textSize,
    setTextSize,
  } = useExerciseContext();

  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  

  const handleBackspace = useCallback(
    (
      currentCharacterIndex: number,
      currentCharacterElement: HTMLElement | null,
      essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>,
      setCurrentCharacterIndex: (index: number) => void
    ) => {
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

      // If previous character is 'write' type, traverse back until non-write
      let newIndex = currentCharacterIndex - 1;
      if (prevCharacterElement?.getAttribute('type') === 'write') {
        while (newIndex > 0 && essayCharsRef.current[newIndex]?.getAttribute('type') === 'write') {
          essayCharsRef.current[newIndex]?.classList.remove(...classesToRemove);
          newIndex--;
        }
      }

      const finalPrevElement = essayCharsRef.current[newIndex];
      finalPrevElement?.classList.remove(...classesToRemove);
      currentCharacterElement?.classList.remove(...currentClassesToRemove);
      finalPrevElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
      setCurrentCharacterIndex(newIndex);
    },
    []
  );

  const handleTab = useCallback(
    (
      currentCharacterIndex: number,
      essay: string,
      essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>,
      setCurrentCharacterIndex: (index: number) => void
    ) => {
      let wordStart = currentCharacterIndex;
      while (wordStart > 0 && essay[wordStart - 1] !== ' ' && essay[wordStart - 1] !== '\n') {
        wordStart--;
      }
      let wordEnd = currentCharacterIndex;
      while (wordEnd < essay.length && essay[wordEnd] !== ' ' && essay[wordEnd] !== '\n') {
        wordEnd++;
      }

      const currentCharElement = essayCharsRef.current[currentCharacterIndex];
      if (currentCharElement) {
        currentCharElement.classList.remove('border-b-4', 'border-sky-400', 'dark:border-white');
      }

      for (let i = wordStart; i < wordEnd; i++) {
        const charElement = essayCharsRef.current[i];
        if (charElement?.getAttribute('type') === 'type') {
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

      setCurrentCharacterIndex(wordEnd);

      const nextCharElement = essayCharsRef.current[wordEnd];
      if (nextCharElement?.getAttribute('type') === 'type') {
        nextCharElement.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
      }
    },
    []
  );

  const handleCharacterInput = useCallback(
    (
      button: string,
      currentCharacterIndex: number,
      essay: string,
      currentCharacterElement: HTMLElement | null,
      nextCharacterElement: HTMLElement | null,
      setErrorIndices: React.Dispatch<React.SetStateAction<number[]>>,
      setCurrentCharacterIndex: (index: number) => void
    ) => {
      // 1. Handle write mode first since it has special behavior
      if (currentCharacterElement?.getAttribute('type') === 'write') {
        let nextIndex = currentCharacterIndex;
        while (nextIndex < essay.length && essayCharsRef.current[nextIndex]?.getAttribute('type') === 'write') {
          essayCharsRef.current[nextIndex]?.classList.add('bg-red-500/20');
          nextIndex++;
        }
        setCurrentCharacterIndex(nextIndex);
        // Underline the next character if it's type mode
        if (essayCharsRef.current[nextIndex]?.getAttribute('type') === 'type') {
          essayCharsRef.current[nextIndex]?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
        }
        if (essayCharsRef.current[nextIndex]?.getAttribute('type') === 'hear') {
          togglePlayback();
        }
        return;
      }

      // 2. Check if input is correct for type mode
      const isCorrect =
        button === essay[currentCharacterIndex] ||
        (button === '{space}' && essay[currentCharacterIndex] === ' ') ||
        (button === '{enter}' && essay[currentCharacterIndex] === '\n');

      // 3. Handle type mode character feedback
      if (currentCharacterElement?.getAttribute('type') === 'type') {
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
      }

      // 4. Handle next character cursor and playback
      if (nextCharacterElement) {
        if (nextCharacterElement?.getAttribute('type') === 'type') {
          nextCharacterElement?.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
        }
        
        // Start playback if next char is hear mode
        if (nextCharacterElement?.getAttribute('type') === 'hear' && !isPlaying) {
          togglePlayback();
        }
      }

      // 5. Advance cursor position
      setCurrentCharacterIndex(currentCharacterIndex + 1);
    },
    [isPlaying, togglePlayback]
  );

  const onKeyPress = useCallback(
    async (button: string) => {
      const currentCharacterElement = essayCharsRef.current[currentCharacterIndex];
      const nextCharacterElement = essayCharsRef.current[currentCharacterIndex + 1];
      (currentCharacterElement as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (currentCharacterIndex + 1 === essay.length) {
        onSubmitExercise();
      }

      if (button === '{backspace}') {
        handleBackspace(
          currentCharacterIndex,
          currentCharacterElement as HTMLElement,
          essayCharsRef,
          setCurrentCharacterIndex
        );
        return;
      }

      if (button === '{tab}') {
        handleTab(currentCharacterIndex, essay, essayCharsRef, setCurrentCharacterIndex);
        return;
      }

      handleCharacterInput(
        button,
        currentCharacterIndex,
        essay,
        currentCharacterElement as HTMLElement,
        nextCharacterElement as HTMLElement,
        setErrorIndices,
        setCurrentCharacterIndex
      );
    },
    [
      essay,
      currentCharacterIndex,
      essayCharsRef,
      setCurrentCharacterIndex,
      setErrorIndices,
      onSubmitExercise,
      handleBackspace,
      handleTab,
      handleCharacterInput,
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
        className='absolute top-0 left-0 right-0 bg-teal-500 h-1 rounded-full'
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
          <Essay/>
        </p>

        {/* Text Size Controls */}
        <div className='absolute bottom-4 right-20 z-50'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTextSizeMenu(!showTextSizeMenu);
            }}
            className='p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
          >
            <BsTextareaT className='w-5 h-5' />
          </button>

          {showTextSizeMenu && (
            <div
              className='absolute bottom-14 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-48'
              onClick={(e) => e.stopPropagation()}
            >
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
                <div className='text-xs text-gray-500 dark:text-gray-400 text-center'>{textSize}</div>
              </div>
            </div>
          )}
        </div>
        {/* Playback Button */}
        <button
          onClick={() => togglePlayback()}
          className='absolute bottom-4 right-4 z-50 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
        >
          {isPlaying ? <BsStopFill className='w-5 h-5' /> : <BsPlayFill className='w-5 h-5' />}
        </button>
      </div>
    </div>
  );
};

export default TypingInterface;
