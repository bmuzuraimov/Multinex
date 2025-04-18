import {
  type GetDemoExercise,
} from 'wasp/server/operations';
import { ExerciseStatus } from '@prisma/client';
import { preprocessEssay } from '../utils/exerciseUtils';
import { getS3DownloadUrl } from '../utils/s3Utils';

type AudioTimestamp = {
  word: string;
  start: number;
  end: number;
};

type DemoExerciseResult = {
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
    user_id: string | null;
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
  formatted_essay: Array<{ mode: "listen" | "type" | "write" | "mermaid"; text: string[] }>;
  audio_url: string;
};

export const getDemoExercise: GetDemoExercise<
  {
    user_agent: string;
    browser_language: string;
    screen_resolution: string;
    timezone: string;
  },
  DemoExerciseResult | null
> = async (args, context) => {
  const demo_exercise = await context.entities.DemoExercise.findFirst({
    where: {
      user_agent: args.user_agent,
      browser_language: args.browser_language,
      screen_resolution: args.screen_resolution,
      timezone: args.timezone
    },
    include: {
      exercise: {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      }
    }
  });

  if (!demo_exercise) return null;

  const audio_timestamps = demo_exercise.exercise.audio_timestamps?.map((timestamp: string) => {
    if (typeof timestamp === 'string') {
      return JSON.parse(timestamp) as AudioTimestamp;
    }
    return timestamp as AudioTimestamp;
  }) || [];

  const { essay, formattedEssay } = preprocessEssay(demo_exercise.exercise.lesson_text);
  const audio_url = await getS3DownloadUrl({ key: demo_exercise.exercise.id + '.mp3' });
  
  return {
    ...demo_exercise,
    essay,
    formatted_essay: formattedEssay,
    audio_url: audio_url,
    exercise: {
      ...demo_exercise.exercise,
      audio_timestamps: audio_timestamps
    }
  };
}
