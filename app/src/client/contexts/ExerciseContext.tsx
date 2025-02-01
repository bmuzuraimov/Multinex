import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';

interface ExerciseContextType {
  // Core essay content and metadata
  essay: string;
  essay_length: number;
  formattedEssay: { mode: 'hear' | 'type' | 'write'; text: string[] }[];
  summary: string[];
  hasQuiz: boolean;

  // Exercise state and mode
  mode: 'typing' | 'submitted' | 'test';
  setMode: React.Dispatch<React.SetStateAction<'typing' | 'submitted' | 'test'>>;
  progress: number;

  // Character tracking and errors
  currentCharacterIndex: number;
  setCurrentCharacterIndex: Dispatch<SetStateAction<number>>;
  errorIndices: number[];
  setErrorIndices: Dispatch<SetStateAction<number[]>>;

  // Audio playback controls
  isPlaying: boolean;
  togglePlayback: () => void;
  speed: number;
  setSpeed: Dispatch<SetStateAction<number>>;
  audioTimestamps: string[];
  setAudioTime: (time: number) => void;

  // UI references and settings
  essayCharsRef: React.RefObject<(HTMLSpanElement | null)[]> & { current: (HTMLSpanElement | null)[] };
  textSize: string;
  setTextSize: Dispatch<SetStateAction<string>>;

  // Exercise completion
  onSubmitExercise: () => Promise<void>;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
};

export const ExerciseProvider: React.FC<{
  children: React.ReactNode;
  value: ExerciseContextType;
}> = ({ children, value }) => {
  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}; 