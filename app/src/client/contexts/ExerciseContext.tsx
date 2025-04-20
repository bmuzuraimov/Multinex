import React, { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { SensoryMode } from '../../shared/types';
import { TextList } from '../user/pages/Exercise/components/ExerciseInterface/TextList';
import { toast } from 'sonner';

interface ExerciseContextType {
  // Core essay content and metadata
  essay: string;
  essay_word_count: number;
  essay_char_count: number;
  essay_list: TextList;
  formatted_essay: { mode: SensoryMode; text: string[] }[];
  has_quiz: boolean;

  // Exercise state and mode
  mode: 'typing' | 'submitted' | 'test';
  highlighted_nodes: number[];
  set_mode: React.Dispatch<React.SetStateAction<'typing' | 'submitted' | 'test'>>;
  set_highlighted_nodes: React.Dispatch<React.SetStateAction<number[]>>;

  // Audio playback controls
  audio_timestamps: Array<{word: string, start: number, end: number}> | string[];

  // UI references and settings
  text_size: string;
  set_text_size: Dispatch<SetStateAction<string>>;

  // Exercise completion
  submit_exercise: () => Promise<void>;
}

const EXERCISE_CONTEXT = createContext<ExerciseContextType | undefined>(undefined);

export const useExerciseContext = () => {
  const context = useContext(EXERCISE_CONTEXT);
  if (!context) {
    toast.error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
};

export const ExerciseProvider: React.FC<{
  children: React.ReactNode;
  value: ExerciseContextType;
}> = ({ children, value }) => {
  return (
    <EXERCISE_CONTEXT.Provider value={value}>
      {children}
    </EXERCISE_CONTEXT.Provider>
  );
};