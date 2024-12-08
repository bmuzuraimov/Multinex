import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Essay from './Essay';
import { BsPlayFill, BsStopFill, BsSkipEndFill } from 'react-icons/bs';
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
}

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
}) => {
  return (
    <div className='w-full h-[calc(100vh-64px)] flex flex-col'>
      <div
        className={`relative flex-1 w-5/6 mx-auto leading-10 ${
          keyboardVisible ? 'h-2/3 pt-8 pb-4' : 'h-full pt-8'
        }`}
      >
        <p className='h-full overflow-y-auto'>
          <Essay essay={essay} essayCharsRef={essayCharsRef} setCurrentCharacterIndex={setCurrentCharacterIndex} setKeyboardState={setKeyboardState} />
        </p>
        <div
          className='absolute -bottom-0 left-0 right-0 bg-blue-600 h-1 rounded-full'
          style={{ width: `${progress}%` }}
        ></div>
        <button
          onClick={togglePlayback}
          className='absolute bottom-4 right-4 z-99 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
        >
          {isPlaying ? <BsStopFill className='w-5 h-5' /> : <BsPlayFill className='w-5 h-5' />}
        </button>
        {/* <button
          onClick={skipParagraph}
          className='absolute bottom-4 right-16 z-99 p-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white transition-colors'
        >
          <BsSkipEndFill className='w-5 h-5' />
        </button> */}
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