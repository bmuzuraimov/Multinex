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