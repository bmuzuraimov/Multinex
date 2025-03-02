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
  createdAt: Date;
  userAgent: string;
  browserLanguage: string | null;
  screenResolution: string | null;
  timezone: string | null;
  exerciseId: string;
  exercise: {
    id: string;
    name: string;
    paragraphSummary: string;
    level: string;
    truncated: boolean;
    no_words: number;
    completed: boolean;
    completedAt: Date | null;
    score: number;
    model: string;
    userEvaluation: number | null;
    userId: string | null;
    topicId: string | null;
    questions: Array<{
      id: string;
      text: string;
      exerciseId: string;
      createdAt: Date;
      options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
        questionId: string;
        createdAt: Date;
      }>;
    }>;
    audioTimestamps: AudioTimestamp[];
    lessonText: string;
    cursor: number;
    tokens: any; // Adding missing property
    status: ExerciseStatus;
    createdAt: Date;
  };
  essay: string;
  formattedEssay: Array<{ mode: "hear" | "type" | "write"; text: string[] }>;
  audioUrl: string;
};

export const getDemoExercise: GetDemoExercise<
  {
    userAgent: string;
    browserLanguage: string;
    screenResolution: string;
    timezone: string;
  },
  DemoExerciseResult | null
> = async (args, context) => {
  const result = await context.entities.DemoExercise.findFirst({
    where: {
      userAgent: args.userAgent,
      browserLanguage: args.browserLanguage,
      screenResolution: args.screenResolution,
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

  if (!result) return null;

  const audioTimestamps = result.exercise.audioTimestamps?.map((timestamp: string) => {
    if (typeof timestamp === 'string') {
      return JSON.parse(timestamp) as AudioTimestamp;
    }
    return timestamp as AudioTimestamp;
  }) || [];

  const { essay, formattedEssay } = preprocessEssay(result.exercise.lessonText);
  const audioUrl = await getS3DownloadUrl({ key: result.exercise.id + '.mp3' });
  
  return {
    ...result,
    essay,
    formattedEssay,
    audioUrl,
    exercise: {
      ...result.exercise,
      audioTimestamps
    }
  };
}
