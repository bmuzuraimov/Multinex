export type StripePaymentResult = {
  sessionUrl: string | null;
  sessionId: string;
};

export type Exercise = {
  id: string;
  name: string;
  prompt: string;
  level: string;
  truncated: boolean;
  lessonText: string;
  no_words: number;
  completed: boolean;
  completedAt: Date | null;
  score: number;
}

export type ExerciseItemProps = {
  index: number;
  exercise: Exercise;
}

export type ExerciseSectionProps = {
  topic: {
    id: string;
    name: string;
    length: number;
    level: string;
    exercises: Exercise[];
  };
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
  showAdvanced: boolean; // Toggle advanced settings visibility
  setShowAdvanced: (value: boolean) => void;
  selectedModel: string; // AI model used for generation
  setSelectedModel: (value: string) => void;
  includeSummary: boolean; // Include content summary in output
  setIncludeSummary: (value: boolean) => void;
  includeMCQuiz: boolean; // Include multiple choice questions
  setIncludeMCQuiz: (value: boolean) => void;
};