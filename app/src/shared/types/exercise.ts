export type Exercise = {
  id: string;
  status: string;
  name: string;
  level: string;
  truncated: boolean;
  lesson_text: string;
  word_count: number;
  completed: boolean;
  completed_at: Date | null;
}; 