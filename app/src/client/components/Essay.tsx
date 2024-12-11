import React, { memo, useCallback } from 'react';

interface EssayProps {
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setCurrentCharacterIndex: (index: number) => void;
  setKeyboardState: (state: string) => void;
  textSize: string;
}

interface TextSizes {
  'xs': string;
  'sm': string;
  'base': string;
  'lg': string;
  'xl': string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
}

const Essay: React.FC<EssayProps> = ({ essay, essayCharsRef, setCurrentCharacterIndex, setKeyboardState, textSize }) => {
  // Split the essay outside of the JSX
  const characters = essay.split('');

  // Map text sizes to tracking values
  const trackingMap: Record<string, string> = {
    'xs': 'tracking-tight',
    'sm': 'tracking-tight',
    'base': 'tracking-normal',
    'lg': 'tracking-normal', 
    'xl': 'tracking-normal',
    '2xl': 'tracking-normal',
    '3xl': 'tracking-wide',
    '4xl': 'tracking-wider',
    '5xl': 'tracking-[0.1em]',
    '6xl': 'tracking-[0.15em]',
    '7xl': 'tracking-[0.2em]',
    '8xl': 'tracking-[0.25em]',
    '9xl': 'tracking-[0.3em]'
  };

  // Map text sizes to border widths
  const borderMap: Record<string, string> = {
    'xs': 'border-b-[1px]',
    'sm': 'border-b-2',
    'base': 'border-b-2',
    'lg': 'border-b-3',
    'xl': 'border-b-3',
    '2xl': 'border-b-4',
    '3xl': 'border-b-[5px]',
    '4xl': 'border-b-[6px]',
    '5xl': 'border-b-[7px]',
    '6xl': 'border-b-[8px]',
    '7xl': 'border-b-[9px]',
    '8xl': 'border-b-[10px]',
    '9xl': 'border-b-[11px]'
  };

  // Ref callback to avoid reassigning functions
  const setRef = useCallback(
    (el: HTMLSpanElement | null, index: number) => {
      if (el) {
        essayCharsRef.current[index] = el;
      }
    },
    [essayCharsRef]
  );

  return (
    <>
      {characters.map((char, index) => {
        if (char === '\n') {
          return (
            <span
              className={`text-${textSize} cursor-pointer ${trackingMap[textSize]} text-sky-200 dark:text-sky-400`}
              ref={(el) => setRef(el, index)}
              key={index}
              onClick={(e) => {
                setCurrentCharacterIndex(index);
                e.currentTarget.classList.add(borderMap[textSize], 'border-sky-400', 'dark:border-white');
              }}
            >
              ↵<br />
            </span>
          );
        }

        return (
          <span
            ref={(el) => setRef(el, index)}
            key={index}
            onClick={(e) => {
              setCurrentCharacterIndex(index);
              setKeyboardState(/[A-Z~!#$%^&*()_+{}|:"<>?]/.test(char) ? 'shift' : 'default');
              e.currentTarget.classList.add(borderMap[textSize], 'border-sky-400', 'dark:border-white');
            }}
            className={`text-${textSize} cursor-pointer ${trackingMap[textSize]} text-gray-500 dark:text-gray-300 mix-blend-normal dark:mix-blend-lighten ${
              index === 0 ? `${borderMap[textSize]} border-sky-400 dark:border-sky-300` : ''
            } ${char === ' ' ? 'px-1 mx-0.5' : ''}`}
          >
            {char}
          </span>
        );
      })}
    </>
  );
};

export default memo(Essay);
