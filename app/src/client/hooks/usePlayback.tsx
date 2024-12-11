import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePlaybackProps {
  essay: string;
  essayCharsRef: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setCurrentCharacterIndex: (index: number | ((prevIndex: number) => number)) => void;
  onSubmitExercise: () => void;
  speed: number;
}

const usePlayback = ({ essay, essayCharsRef, setCurrentCharacterIndex, onSubmitExercise, speed }: UsePlaybackProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const stopPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setIsPlaying(false);

    // Clear all highlights when stopping
    essayCharsRef.current.forEach((charElement) => {
      if (charElement) {
        charElement.classList.remove('bg-yellow-200', 'dark:bg-yellow-800');
      }
    });

    // Add border bottom to next char when stopped
    setCurrentCharacterIndex((prevIndex) => {
      const nextCharElement = essayCharsRef.current[prevIndex];
      if (nextCharElement) {
        nextCharElement.classList.add('border-b-4', 'border-sky-400', 'dark:border-white');
      }
      return prevIndex;
    });
  }, [essayCharsRef, setCurrentCharacterIndex]);

  const startPlayback = useCallback(() => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
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
          stopPlayback();
          onSubmitExercise();
          return prevIndex;
        }

        return wordEnd;
      });
    }, speed);
  }, [essay, essayCharsRef, onSubmitExercise, setCurrentCharacterIndex, speed, stopPlayback]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }, [isPlaying, startPlayback, stopPlayback]);

  // Clean up interval on unmount or when speed changes
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [speed, isPlaying, startPlayback, stopPlayback]);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Command/Control + Space
      if ((e.metaKey || e.ctrlKey) && e.code === 'p') {
        e.preventDefault(); // Prevent default space behavior
        togglePlayback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayback]);

  return { isPlaying, togglePlayback };
};

export default usePlayback;