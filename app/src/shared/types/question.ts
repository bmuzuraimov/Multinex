export interface Option {
  text: string;
  is_correct: boolean;
}

export interface Question {
  text: string;
  options: Option[];
}

export interface QuestionsResponse {
  questions: Question[];
} 