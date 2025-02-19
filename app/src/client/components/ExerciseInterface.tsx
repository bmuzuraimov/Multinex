import React, { useState, useEffect } from 'react';
import { BsPlayFill, BsStopFill, BsTextareaT, BsKeyboard, BsArrowRight } from 'react-icons/bs';
import { TEXT_SIZES } from '../../shared/constants';
import { useExerciseContext } from '../contexts/ExerciseContext';
import { cn } from '../../shared/utils';

const ExerciseInterface: React.FC = () => {
  const { essayList, textSize, setTextSize } = useExerciseContext();
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([0]);
  const [currentSpanRef, setCurrentSpanRef] = useState<HTMLSpanElement | null>(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      currentSpanRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      essayList.handleKeyDown(e);
      setHighlightedNodes(essayList.getNodes().filter(node => node.highlight).map(node => node.id));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [essayList, currentSpanRef]);

  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col relative'>
      <div 
        className='absolute top-0 left-0 right-0 bg-teal-500 h-1 rounded-full' 
        style={{ width: `${((essayList.getCursor()?.id ?? 0) / essayList.getNodes().length) * 100}%` }}
      ></div>
      <div className='relative flex-1 w-5/6 mx-auto leading-10 h-full pt-8'>
        {essayList.getCursor()?.id === 0 && (
          <div className='absolute top-6 left-0 flex flex-row items-center space-x-2 z-999 transform -translate-x-[105%] bg-white dark:bg-gray-800 p-1 rounded-lg animate-pulse'>
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
                }}
                key={textNode.id}
              >
                {textNode.value === '\n' ? '↵' : textNode.value}
                {textNode.value === '\n' && <br />}
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
