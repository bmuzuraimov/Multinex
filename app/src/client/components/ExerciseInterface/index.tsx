import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BsTextareaT, BsKeyboard, BsArrowRight, BsPalette } from 'react-icons/bs';
import { TEXT_SIZES } from '../../../shared/constants';
import { useExerciseContext } from '../../contexts/ExerciseContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { cn } from '../../../shared/utils';

const ExerciseInterface: React.FC = () => {
  const { essay_list, text_size, set_text_size, highlighted_nodes, set_highlighted_nodes, submit_exercise } =
    useExerciseContext();
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [writeColor, setWriteColor] = useLocalStorage('writeColor', '#ffc9c9');
  const [typeColor, setTypeColor] = useLocalStorage('typeColor', '#a2f8da');
  const [listenColor, setListenColor] = useLocalStorage('listenColor', '#a8d3ff');
  const [currentSpanRef, setCurrentSpanRef] = useState<HTMLSpanElement | null>(null);
  const isProcessingRef = useRef(false);
  const lastKeyTimeRef = useRef(0);
  const KEY_THROTTLE_MS = 50; // Throttle key events to 50ms

  // Create update callback
  const handleUpdate = useCallback(() => {
    set_highlighted_nodes(
      essay_list
        .getNodes()
        .filter((node) => node.highlight)
        .map((node) => node.id)
    );
  }, [essay_list, set_highlighted_nodes]);

  // Set up the update callback when essayList is created
  useEffect(() => {
    // @ts-ignore - Add onUpdate to TextList instance
    essay_list.onUpdate = handleUpdate;
  }, [essay_list, handleUpdate]);

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
        if (essay_list.getNodes().length - 1 === essay_list.getCursor()?.id) {
          submit_exercise();
        } else {
          // Schedule UI updates separately from key processing
          if (currentSpanRef) {
            requestAnimationFrame(() => {
              currentSpanRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
          }

          await essay_list.handleKeyDown(e);

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
  }, [essay_list, currentSpanRef, handleUpdate, submit_exercise]);

  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col relative'>
      <div
        className='absolute top-0 left-0 right-0 bg-teal-500 h-1 rounded-full'
        style={{ width: `${((essay_list.getCursor()?.id ?? 0) / essay_list.getNodes().length) * 100}%` }}
      ></div>
      <div className='relative flex-1 w-5/6 mx-auto leading-10 h-full pb-12 pt-8 scrollbar-hide'>
        {essay_list.getCursor()?.id === 0 && (
          <div className='absolute top-6 left-0 flex flex-row items-center space-x-2 z-modal transform -translate-x-[105%] bg-white dark:bg-gray-800 p-1 rounded-lg animate-pulse'>
            <BsKeyboard className='w-5 h-5' />
            <span>Start typing</span>
            <BsArrowRight className='w-5 h-5' />
          </div>
        )}
        <div className='h-full overflow-y-auto mb-16 scrollbar-hide'>
          {essay_list.getNodes().map((textNode) => {
            return (
              <span
                key={textNode.id}
                ref={(el) => {
                  if (textNode.id === essay_list.getCursor()?.id) {
                    setCurrentSpanRef(el);
                  }
                }}
                className={cn(
                  textNode.baseCharClass,
                  textNode.currentClass,
                  highlighted_nodes.includes(textNode.id) ? textNode.highlightClass : ''
                )}
                onClick={() => {
                  essay_list.setCursor(textNode);
                  set_highlighted_nodes(
                    essay_list
                      .getNodes()
                      .filter((node) => node.highlight)
                      .map((node) => node.id)
                  );
                }}
              >
                {textNode.value.startsWith('\n') ? '↵' : textNode.value}
                {Array(textNode.value.match(/\n+$/)?.[0]?.length || 0).fill(null).map((_, i) => (
                  <br key={`br-${textNode.id}-${i}`}/>
                ))}
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
                  value={TEXT_SIZES.indexOf(text_size)}
                  onChange={(e) => set_text_size(TEXT_SIZES[parseInt(e.target.value)])}
                  className='w-full accent-teal-500'
                />
                <div className='text-xs text-gray-500 dark:text-gray-400 text-center'>{text_size}</div>
              </div>
            </div>
          )}
        </div>
        {/* Color Controls */}
        <div className='absolute bottom-4 right-4 z-50'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorMenu(!showColorMenu);
            }}
            className='p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
          >
            <BsPalette className='w-5 h-5' />
          </button>

          {showColorMenu && (
            <div
              className='absolute bottom-14 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-48'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex flex-col'>
                <div>
                  <label className='text-sm text-gray-600 dark:text-gray-300'>Write Color</label>
                  <input
                    type='color'
                    value={writeColor}
                    onChange={(e) => setWriteColor(e.target.value)}
                    className='w-full h-8 rounded cursor-pointer'
                  />
                </div>
                <div>
                  <label className='text-sm text-gray-600 dark:text-gray-300'>Type Color</label>
                  <input
                    type='color'
                    value={typeColor}
                    onChange={(e) => setTypeColor(e.target.value)}
                    className='w-full h-8 rounded cursor-pointer'
                  />
                </div>
                <div>
                  <label className='text-sm text-gray-600 dark:text-gray-300'>Listen Color</label>
                  <input
                    type='color'
                    value={listenColor}
                    onChange={(e) => setListenColor(e.target.value)}
                    className='w-full h-8 rounded cursor-pointer'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseInterface;
