import { useCallback, useEffect, useState } from 'react';

interface UsePlaybackProps {
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setCurrentCharacterIndex: (index: number | ((prev: number) => number)) => void;
  onSubmitExercise: () => void;
}

const usePlayback = ({ essay, essayCharsRef, setCurrentCharacterIndex, onSubmitExercise }: UsePlaybackProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInterval, setPlaybackInterval] = useState<NodeJS.Timeout | null>(null);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      if (playbackInterval) {
        clearInterval(playbackInterval);
        setPlaybackInterval(null);
      }
      setIsPlaying(false);

      // Clear all highlights when stopping
      essayCharsRef.current.forEach((charElement) => {
        if (charElement) {
          charElement.classList.remove('bg-yellow-200', 'dark:bg-yellow-800');
        }
      });
    } else {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentCharacterIndex((prevIndex) => {
          // Find the start of the current word
          let wordStart = prevIndex;
          while (wordStart > 0 && essay[wordStart - 1] !== ' ' && essay[wordStart - 1] !== '\n') {
            wordStart--;
          }

          // Find the end of the current word
          let wordEnd = prevIndex;
          while (wordEnd < essay.length && essay[wordEnd] !== ' ' && essay[wordEnd] !== '\n') {
            wordEnd++;
          }
          wordEnd++; // Move to start of next word

          // Clear previous highlights
          essayCharsRef.current.forEach((charElement) => {
            if (charElement) {
              charElement.classList.remove('bg-yellow-200', 'dark:bg-yellow-800', 'border-b-4', 'border-sky-400', 'dark:border-white');
            }
          });

          // Highlight current word
          for (let i = wordStart; i < wordEnd - 1; i++) {
            const charElement = essayCharsRef.current[i];
            if (charElement) {
              charElement.classList.add('bg-yellow-200', 'dark:bg-yellow-800');
            }
          }

          // Scroll the next word into view
          const nextCharElement = essayCharsRef.current[wordEnd];
          (nextCharElement as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

          if (wordEnd >= essay.length) {
            clearInterval(interval);
            setIsPlaying(false);
            setPlaybackInterval(null);
            onSubmitExercise();
            return prevIndex;
          }

          return wordEnd;
        });
      }, 400);
      setPlaybackInterval(interval);
    }
  }, [isPlaying, playbackInterval, essay, essayCharsRef, setCurrentCharacterIndex, onSubmitExercise]);

  useEffect(() => {
    return () => {
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
    };
  }, [playbackInterval]);

  return {
    isPlaying,
    togglePlayback
  };
};

export default usePlayback;