import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { TextList } from '../utils/TextList';
interface ExerciseContextType {
  // Core essay content and metadata
  essay: string;
  essayWordCount: number;
  essayCharCount: number;
  essayList: TextList;
  formattedEssay: { mode: 'listen' | 'type' | 'write'; text: string[] }[];
  summary: string[];
  hasQuiz: boolean;

  // Exercise state and mode
  mode: 'typing' | 'submitted' | 'test';
  highlightedNodes: number[];
  setMode: React.Dispatch<React.SetStateAction<'typing' | 'submitted' | 'test'>>;
  setHighlightedNodes: React.Dispatch<React.SetStateAction<number[]>>;

  // Audio playback controls
  audioTimestamps: Array<{word: string, start: number, end: number}> | string[];

  // UI references and settings
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