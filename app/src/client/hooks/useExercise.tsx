import { useState, useEffect, useRef } from 'react';

interface Exercise {
  id: string;
  lessonText: string;
}

const useExercise = (raw_essay: string, defaultMode: string) => {
  const essay = raw_essay.replace(/\\n/g, '\n').replace('<br/>', '\n');
  const [progress, setProgress] = useState(0.0);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const [keyboardState, setKeyboardState] = useState(
    essay[0] === essay[0].toUpperCase() || !isNaN(Number(essay[0])) ? 'shift' : 'default'
  );
  const [mode, setMode] = useState(defaultMode);
  const essayCharsRef = useRef<HTMLSpanElement[]>([]);
  useEffect(() => {
    setProgress((currentCharacterIndex * 100) / essay.length);
  }, [currentCharacterIndex]);

  return {
    essay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    keyboardState,
    setKeyboardState,
    mode,
    setMode,
    essayCharsRef,
  };
};

export default useExercise;
