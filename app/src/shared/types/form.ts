export type SensoryMode = 'listen' | 'type' | 'write' | 'mermaid';

export interface ExerciseFormContentSettings {
  exercise_name: string;
  set_exercise_name: (value: string) => void;
  exercise_length: string;
  set_exercise_length: (value: string) => void;
  exercise_level: string;
  set_exercise_level: (value: string) => void;
  selected_topics: string[];
  set_selected_topics: (value: string[]) => void;
  topics: string[];
  set_topics: (value: string[]) => void;
}

export type ExerciseFormGenerationSettings = {
  scan_images: boolean;
  set_scan_images: (value: boolean) => void;
  selected_model: string;
  set_selected_model: (value: string) => void;
  include_mc_quiz: boolean;
  set_include_mc_quiz: (value: boolean) => void;
}; 