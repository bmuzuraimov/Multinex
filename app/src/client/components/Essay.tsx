import React, { memo, useCallback, useMemo } from 'react';
import { TRACKING_MAP, BORDER_MAP } from '../../shared/constants';
import { useExerciseContext } from '../contexts/ExerciseContext';

type Mode = 'hear' | 'type' | 'write';

const Essay: React.FC = () => {
  const { essay, audioTimestamps, togglePlayback, isPlaying, setAudioTime, formattedEssay, essayCharsRef, setCurrentCharacterIndex, textSize } = useExerciseContext();

  const colorMap = useMemo(() => ({
    hear: 'text-blue-900 dark:text-gray-300',
    type: 'text-green-900 dark:text-gray-300',
    write: 'text-red-900 dark:text-gray-300',
  }), []);

  const fontMap = useMemo(() => ({
    hear: 'font-montserrat',
    type: 'font-manrope',
    write: 'font-courgette',
  }), []);

  const setRef = useCallback(
    (el: HTMLSpanElement | null, index: number, tagType: string, wordIndex?: number) => {
      if (el) {
        essayCharsRef.current[index] = el;
        if (tagType) {
          el.setAttribute('type', tagType);
          if (tagType === 'hear' && typeof wordIndex === 'number') {
            el.setAttribute('word-index', wordIndex.toString());
          }
        }
      }
    },
    [essayCharsRef]
  );

  const handleCharacterClick = useCallback(
    (index: number, e: React.MouseEvent<HTMLSpanElement>) => {
      const borderClasses = [BORDER_MAP[textSize], 'border-sky-400', 'dark:border-white'];
      
      essayCharsRef.current.forEach((el) => {
        if (el) {
          el.classList.remove(...borderClasses);
        }
      });
      
      e.currentTarget.classList.add(...borderClasses);
      const wordIndex = e.currentTarget.getAttribute('word-index');
      if (wordIndex) {
        setAudioTime(parseInt(JSON.parse(audioTimestamps[parseInt(wordIndex)]).start));
      }
      if(isPlaying && e.currentTarget.getAttribute('type') !== 'hear') {
        togglePlayback();
      }
      setCurrentCharacterIndex(index);
    },
    [essayCharsRef, setCurrentCharacterIndex, textSize, essay]
  );

  const baseCharClass = useMemo(() => `text-${textSize} cursor-pointer ${TRACKING_MAP[textSize]}`, [textSize]);
  const newlineClass = useMemo(() => `${baseCharClass} text-sky-200 dark:text-sky-400`, [baseCharClass]);
  const firstCharBorder = useMemo(() => `${BORDER_MAP[textSize]} border-sky-400 dark:border-sky-300`, [textSize]);

  let globalIndex = 0;
  let globalWordIndex = -1;
  let isInWord = false;
  
  // Function to process text sections and track word indices
  const processSection = (text: string[], mode: Mode) => {
    return text.map((char) => {
      const currentIndex = globalIndex++;
      
      if (char === '\n') {
        isInWord = false;
        return {
          char,
          globalIndex: currentIndex,
          isNewline: true,
        };
      }

      if (char === ' ') {
        isInWord = false;
        return {
          char,
          globalIndex: currentIndex,
          isSpace: true,
        };
      }

      // Start of a new word
      if (!isInWord) {
        isInWord = true;
        if (mode === 'hear') {
          globalWordIndex++;
        }
      }

      return {
        char,
        globalIndex: currentIndex,
        wordIndex: mode === 'hear' ? globalWordIndex : undefined,
      };
    });
  };

  return (
    <>
      {formattedEssay.map((section, sectionIndex) => {
        const processedChars = processSection(section.text, section.mode);
        
        return (
          <span key={sectionIndex} className={`${colorMap[section.mode]} ${fontMap[section.mode]}`}>
            {processedChars.map(({ char, globalIndex, isNewline, isSpace, wordIndex }) => {
              if (isNewline) {
                return (
                  <span
                    className={newlineClass}
                    ref={(el) => setRef(el, globalIndex, section.mode)}
                    key={globalIndex}
                    onClick={(e) => handleCharacterClick(globalIndex, e)}
                  >
                    {section.mode === 'type' ? '↵' : ''}<br />
                  </span>
                );
              }

              const charClass = `${baseCharClass} mix-blend-normal dark:mix-blend-lighten ${
                globalIndex === 0 ? firstCharBorder : ''
              } ${isSpace ? 'px-1 mx-0.5' : ''}`;

              return (
                <span
                  ref={(el) => setRef(el, globalIndex, section.mode, wordIndex)}
                  key={globalIndex}
                  onClick={(e) => handleCharacterClick(globalIndex, e)}
                  className={charClass}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
};

export default memo(Essay);