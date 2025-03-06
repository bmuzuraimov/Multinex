import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BsPlayFill, BsStopFill, BsTextareaT, BsKeyboard, BsArrowRight } from 'react-icons/bs';
import { TEXT_SIZES } from '../../shared/constants';
import { useExerciseContext } from '../contexts/ExerciseContext';
import { cn } from '../../shared/utils';

const ExerciseInterface: React.FC = () => {
  const { essayList, textSize, setTextSize, highlightedNodes, setHighlightedNodes, onSubmitExercise } =
    useExerciseContext();
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);

  const [currentSpanRef, setCurrentSpanRef] = useState<HTMLSpanElement | null>(null);
  const isProcessingRef = useRef(false);
  const lastKeyTimeRef = useRef(0);
  const KEY_THROTTLE_MS = 50; // Throttle key events to 50ms

  // Create update callback
  const handleUpdate = useCallback(() => {
    setHighlightedNodes(
      essayList
        .getNodes()
        .filter((node) => node.highlight)
        .map((node) => node.id)
    );
  }, [essayList, setHighlightedNodes]);

  // Set up the update callback when essayList is created
  useEffect(() => {
    // @ts-ignore - Add onUpdate to TextList instance
    essayList.onUpdate = handleUpdate;
  }, [essayList, handleUpdate]);

  // Handle keyboard input
  useEffect(() => {
    let isProcessing = false;

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Throttle key events to prevent excessive processing
      const now = Date.now();
      if (now - lastKeyTimeRef.current < KEY_THROTTLE_MS) {
        return;
      }
      lastKeyTimeRef.current = now;

      // Prevent multiple simultaneous executions
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        if (essayList.getNodes().length - 1 === essayList.getCursor()?.id) {
          onSubmitExercise();
        } else {
          // Schedule UI updates separately from key processing
          if (currentSpanRef) {
            requestAnimationFrame(() => {
              currentSpanRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
          }
          
          await essayList.handleKeyDown(e);
          
          // Schedule state updates in the next frame
          requestAnimationFrame(() => {
            handleUpdate();
          });
        }
      } finally {
        isProcessingRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [essayList, currentSpanRef, handleUpdate, onSubmitExercise]);

  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col relative'>
      <div
        className='absolute top-0 left-0 right-0 bg-teal-500 h-1 rounded-full'
        style={{ width: `${((essayList.getCursor()?.id ?? 0) / essayList.getNodes().length) * 100}%` }}
      ></div>
      <div className='relative flex-1 w-5/6 mx-auto leading-10 h-full pb-12 pt-8 scrollbar-hide'>
        {essayList.getCursor()?.id === 0 && (
          <div className='absolute top-6 left-0 flex flex-row items-center space-x-2 z-modal transform -translate-x-[105%] bg-white dark:bg-gray-800 p-1 rounded-lg animate-pulse'>
            <BsKeyboard className='w-5 h-5' />
            <span>Start typing</span>
            <BsArrowRight className='w-5 h-5' />
          </div>
        )}
        <div className='h-full overflow-y-auto mb-16 scrollbar-hide'>
          {essayList.getNodes().map((textNode) => {
            return (
              <span
                ref={(el) => {
                  if (textNode.id === essayList.getCursor()?.id) {
                    setCurrentSpanRef(el);
                  }
                }}
                className={cn(
                  textNode.baseCharClass,
                  textNode.currentClass,
                  highlightedNodes.includes(textNode.id) ? textNode.highlightClass : ''
                )}
                onClick={() => {
                  essayList.setCursor(textNode);
                  setHighlightedNodes(
                    essayList
                      .getNodes()
                      .filter((node) => node.highlight)
                      .map((node) => node.id)
                  );
                }}
                key={textNode.id}
              >
                {textNode.value.startsWith('\n') ? '↵' : textNode.value}
                {Array(textNode.value.split('\n').length - 1).fill(<br />)}
              </span>
            );
          })}
        </div>

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
          onClick={() => essayList.togglePlayback()}
          className='absolute bottom-4 right-4 z-50 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
        >
          {false ? <BsStopFill className='w-5 h-5' /> : <BsPlayFill className='w-5 h-5' />}
        </button>
      </div>
    </div>
  );
};

export default ExerciseInterface;
