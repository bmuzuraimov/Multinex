import { useState, useEffect, useRef, useMemo } from 'react';

interface Exercise {
  id: string;
  lessonText: string;
}

const useExercise = (raw_essay: string, defaultMode: 'typing' | 'submitted' | 'test') => {
  // Memoize essay cleanup to avoid re-processing on every render
  const essay = useMemo(() => 
    raw_essay.replace(/\\n/g, '\n').replace(/<br\/>/g, '\n'),
    [raw_essay]
  );

  // Optimized parseEssay with single regex execution and array mapping
  const parseEssay = useMemo(() => (text: string) => {
    const matches = Array.from(text.matchAll(/<(hear|write|type)>([\s\S]*?)<\/\1>/g));
    return matches.map(match => {
      const [fullMatch, mode, content] = match;
      const endChar = text.charAt(match.index! + fullMatch.length);
      const chars = content.split('');
      
      if (endChar === '\n') chars.push('\n');
      else if (endChar === ' ') chars.push(' ');
      
      return {
        mode: mode as 'hear' | 'type' | 'write',
        text: chars
      };
    });
  }, []);

  const [progress, setProgress] = useState(0.0);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [errorIndices, setErrorIndices] = useState<number[]>([]);
  const [mode, setMode] = useState<'typing' | 'submitted' | 'test'>(defaultMode);
  const essayCharsRef = useRef<HTMLSpanElement[]>([]);

  // Memoize formatted essay to prevent recalculation
  const formattedEssay = useMemo(() => 
    parseEssay(essay),
    [essay, parseEssay]
  );

  // Memoize clean essay
  const cleanEssay = useMemo(() => 
    formattedEssay.map(section => section.text.join('')).join(''),
    [formattedEssay]
  );

  // Update progress efficiently using useEffect
  useEffect(() => {
    setProgress((currentCharacterIndex * 100) / essay.length);
  }, [currentCharacterIndex, essay.length]);

  return {
    essay: cleanEssay,
    formattedEssay,
    progress,
    currentCharacterIndex,
    setCurrentCharacterIndex,
    errorIndices,
    setErrorIndices,
    mode,
    setMode,
    essayCharsRef,
  };
};

export default useExercise;
