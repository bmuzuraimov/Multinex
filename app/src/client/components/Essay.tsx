import React, { memo, useCallback } from 'react';

interface EssayProps {
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setCurrentCharacterIndex: (index: number) => void;
  setKeyboardState: (state: string) => void;
}

const Essay: React.FC<EssayProps> = ({ essay, essayCharsRef, setCurrentCharacterIndex, setKeyboardState }) => {
  // Split the essay outside of the JSX
  const characters = essay.split('');

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
              className='text-4xl cursor-pointer tracking-wider text-sky-200 dark:text-sky-400'
              ref={(el) => setRef(el, index)}
              key={index}
              onClick={(e) => {
                setCurrentCharacterIndex(index);
                e.currentTarget.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
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
              e.currentTarget.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
            }}
            className={`text-4xl cursor-pointer tracking-wider text-gray-500 dark:text-gray-300 mix-blend-normal dark:mix-blend-lighten ${
              index === 0 ? 'border-b-4 border-sky-400 dark:border-sky-300' : ''
            } ${char === ' ' ? 'px-1 mr-1' : 'mr-0.5'}`}
          >
            {char}
          </span>
        );
      })}
    </>
  );
};

export default memo(Essay);
