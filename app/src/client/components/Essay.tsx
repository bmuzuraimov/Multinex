import React, { memo, useCallback } from 'react';
import { TRACKING_MAP, BORDER_MAP } from '../../shared/constants';


const Essay: React.FC<{
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setCurrentCharacterIndex: (index: number) => void;
  textSize: string;
}> = ({ essay, essayCharsRef, setCurrentCharacterIndex, textSize }) => {
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

  // Add a new function to handle clicks
  const handleCharacterClick = useCallback((index: number, e: React.MouseEvent<HTMLSpanElement>) => {
    // Remove cursor styling from all characters
    essayCharsRef.current.forEach(el => {
      if (el) {
        el.classList.remove(BORDER_MAP[textSize], 'border-sky-400', 'dark:border-white');
      }
    });

    // Add cursor styling to clicked character
    e.currentTarget.classList.add(BORDER_MAP[textSize], 'border-sky-400', 'dark:border-white');
    setCurrentCharacterIndex(index);
  }, [essayCharsRef, setCurrentCharacterIndex, textSize]);

  return (
    <>
      {characters.map((char, index) => {
        if (char === '\n') {
          return (
            <span
              className={`text-${textSize} cursor-pointer ${TRACKING_MAP[textSize]} text-sky-200 dark:text-sky-400`}
              ref={(el) => setRef(el, index)}
              key={index}
              onClick={(e) => handleCharacterClick(index, e)}
            >
              ↵<br />
            </span>
          );
        }

        return (
          <span
            ref={(el) => setRef(el, index)}
            key={index}
            onClick={(e) => handleCharacterClick(index, e)}
            className={`text-${textSize} cursor-pointer ${TRACKING_MAP[textSize]} text-gray-500 dark:text-gray-300 mix-blend-normal dark:mix-blend-lighten ${
              index === 0 ? `${BORDER_MAP[textSize]} border-sky-400 dark:border-sky-300` : ''
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
