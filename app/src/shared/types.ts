export type StripePaymentResult = {
  sessionUrl: string | null;
  sessionId: string;
};

export type Exercise = {
  id: string;
  status: string;
  name: string;
  level: string;
  truncated: boolean;
  lessonText: string;
  no_words: number;
  completed: boolean;
  completedAt: Date | null;
  score: number;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  options: Option[];
}

export interface QuestionsResponse {
  questions: Question[];
}

export type SensoryMode = 'listen' | 'type' | 'write';

export interface ExerciseFormContentSettings {
  sensoryModes: SensoryMode[];
  setSensoryMods: (value: SensoryMode[]) => void;
  exerciseName: string;
  setExerciseName: (value: string) => void;
  exerciseLength: string;
  setExerciseLength: (value: string) => void;
  exerciseLevel: string;
  setExerciseLevel: (value: string) => void;
  priorKnowledge: string[];
  setPriorKnowledge: (value: string[]) => void;
  topics: string[];
  setTopics: (value: string[]) => void;
}

export type ExerciseFormGenerationSettings = {
  scanImages: boolean; // Whether to extract text from images
  setScanImages: (value: boolean) => void;
  selectedModel: string; // AI model used for generation
  setSelectedModel: (value: string) => void;
  includeSummary: boolean; // Include content summary in output
  setIncludeSummary: (value: boolean) => void;
  includeMCQuiz: boolean; // Include multiple choice questions
  setIncludeMCQuiz: (value: boolean) => void;
  sensoryModes: string[]; // Add sensoryModes as an array of strings
  setSensoryMods: (value: string[]) => void
};