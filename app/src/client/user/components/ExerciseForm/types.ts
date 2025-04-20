import { ExerciseStatus } from '@prisma/client';
import { AudioTimestamp } from '../../pages/Exercise/components/ExerciseInterface/AudioController';
import { SensoryMode } from '../../../../shared/types';
import { AVAILABLE_MODELS } from '../../../../shared/constants';

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

export interface ExerciseFormGenerationSettings {
  scan_images: boolean;
  set_scan_images: (value: boolean) => void;
  selected_model: string;
  set_selected_model: (value: string) => void;
  include_mc_quiz: boolean;
  set_include_mc_quiz: (value: boolean) => void;
}

export interface DemoExerciseResult {
  id: string;
  created_at: Date;
  user_agent: string;
  browser_language: string | null;
  screen_resolution: string | null;
  timezone: string | null;
  exercise_id: string;
  exercise: {
    id: string;
    name: string;
    level: string;
    truncated: boolean;
    word_count: number;
    completed: boolean;
    completed_at: Date | null;
    model: string;
    user_evaluation: number | null;
    user_id: string;
    topic_id: string | null;
    questions: Array<{
      id: string;
      text: string;
      exercise_id: string;
      created_at: Date;
      options: Array<{
        id: string;
        text: string;
        is_correct: boolean;
        question_id: string;
        created_at: Date;
      }>;
    }>;
    audio_timestamps: AudioTimestamp[];
    lesson_text: string;
    cursor: number;
    tokens: any;
    status: ExerciseStatus;
    created_at: Date;
  };
  essay: string;
  formatted_essay: Array<{ mode: SensoryMode; text: string[] }>;
  audio_url: string;
}

export const INITIAL_EXERCISE_SETTINGS: ExerciseFormContentSettings = {
  exercise_name: '',
  set_exercise_name: () => {},
  exercise_length: 'Auto',
  set_exercise_length: () => {},
  exercise_level: 'Auto',
  set_exercise_level: () => {},
  selected_topics: [],
  set_selected_topics: () => {},
  topics: [],
  set_topics: () => {},
};

export const INITIAL_ADVANCED_SETTINGS: ExerciseFormGenerationSettings = {
  scan_images: false,
  set_scan_images: () => {},
  selected_model: AVAILABLE_MODELS[0],
  set_selected_model: () => {},
  include_mc_quiz: false,
  set_include_mc_quiz: () => {},
}; 