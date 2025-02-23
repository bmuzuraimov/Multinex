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

// Define types for grouped props
export type ExerciseFormContentSettings = {
  exerciseName: string;
  setExerciseName: (value: string) => void;
  exerciseLength: string; // Target length of generated exercise content
  setExerciseLength: (value: string) => void;
  exerciseLevel: string; // Difficulty level of exercise (e.g. Beginner, Advanced)
  setExerciseLevel: (value: string) => void;
  priorKnowledge: string[]; // Required background knowledge for exercise
  setPriorKnowledge: (value: string[]) => void;
  topics: string[]; // Main topics covered in exercise
  setTopics: (value: string[]) => void;
};

export type ExerciseFormGenerationSettings = {
  scanImages: boolean; // Whether to extract text from images
  setScanImages: (value: boolean) => void;
  selectedModel: string; // AI model used for generation
  setSelectedModel: (value: string) => void;
  includeSummary: boolean; // Include content summary in output
  setIncludeSummary: (value: boolean) => void;
  includeMCQuiz: boolean; // Include multiple choice questions
  setIncludeMCQuiz: (value: boolean) => void;
};

export type LandingPageTryResult = {
  id: string;
  createdAt: Date;
  userAgent: string;
  browserLanguage: string | null;
  screenResolution: string | null;
  timezone: string | null;
  name: string;
  prompt: string;
  promptImg: string;
  audioTimestamps: Array<{word: string, start: number, end: number}> | string[];
  paragraphSummary: string;
  level: string;
  no_words: number;
  truncated: boolean;
  completedAt: Date | null;
  score: number;
  tokensUsed: number;
  successful: boolean;
  model: string;
  userEvaluation: number | null;
  convertedUserId: string | null;
  [key: string]: any;
};