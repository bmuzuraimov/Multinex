import React, { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Essay from './Essay';
import { BsPlayFill, BsStopFill, BsSkipEndFill, BsTextareaT, BsSpeedometer, BsKeyboard, BsArrowRight } from 'react-icons/bs';
import { ENGLISH_LAYOUT } from '../../shared/constants';

interface TypingInterfaceProps {
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  progress: number;
  keyboardVisible: boolean;
  keyboardRef: React.MutableRefObject<any>;
  onKeyPress: (button: string) => void;
  keyboardState: string;
  isPlaying: boolean;
  togglePlayback: () => void;
  skipParagraph: () => void;
  setCurrentCharacterIndex: (index: number) => void;
  setKeyboardState: (state: string) => void;
  setSpeed: (speed: number) => void;
  speed: number;
  currentCharacterIndex: number;
}

const TEXT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
const SPEEDS = [1000, 800, 600, 400, 200];
const SPEED_LABELS = ['60 WPM', '75 WPM', '100 WPM', '150 WPM', '300 WPM'];

const TypingInterface: React.FC<TypingInterfaceProps> = ({
  essay,
  essayCharsRef,
  progress,
  keyboardVisible,
  keyboardRef,
  onKeyPress,
  keyboardState,
  isPlaying,
  togglePlayback,
  skipParagraph,
  setCurrentCharacterIndex,
  setKeyboardState,
  setSpeed,
  speed,
  currentCharacterIndex,
}) => {
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [textSize, setTextSize] = useState('2xl');

  const handleSpeedChange = (value: number) => {
    setSpeed(SPEEDS[value]);
  };

  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col'>
      <div
        className='absolute top-0 left-0 right-0 bg-blue-600 h-1 rounded-full'
        style={{ width: `${progress}%` }}
      ></div>
      <div
        className={`relative flex-1 w-5/6 mx-auto leading-10 ${
          keyboardVisible ? 'h-2/3 pt-8 pb-4' : 'h-full pt-8'
        }`}
      >
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
            setKeyboardState={setKeyboardState} 
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
                  min='0'
                  max={SPEEDS.length - 1}
                  value={SPEEDS.indexOf(speed)}
                  onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                  className='w-full accent-teal-500'
                />
                <div className='text-xs text-gray-500 dark:text-gray-400 text-center'>
                  {SPEED_LABELS[SPEEDS.indexOf(speed)]}
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
      <div className={`flex-1 h-1/3 bg-white dark:bg-gray-800 ${!keyboardVisible ? 'hidden' : ''}`}>
        <div className='w-5/6 h-full mx-auto'>
          <style>
            {`
              .dark .simple-keyboard {
                background-color: rgb(31, 41, 55);
                border-radius: 0.5rem;
              }
              .dark .simple-keyboard .hg-button {
                background-color: rgb(55, 65, 81);
                color: rgb(229, 231, 235);
                border: none;
                box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
              }
              .dark .simple-keyboard .hg-button:hover {
                background-color: rgb(75, 85, 99);
              }
              .dark .simple-keyboard .hg-button.hg-activeButton {
                background-color: rgb(55, 65, 81);
              }
            `}
          </style>
          <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            onKeyPress={onKeyPress}
            theme='hg-theme-default hg-layout-default'
            layoutName={keyboardState}
            layout={ENGLISH_LAYOUT}
            physicalKeyboardHighlight
            physicalKeyboardHighlightPress
            physicalKeyboardHighlightTextColor='yellow'
          />
        </div>
      </div>
    </div>
  );
};

export default TypingInterface;