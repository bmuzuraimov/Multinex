import { HttpError } from 'wasp/server';
import { type GetPrompt, type GetAllPrompts } from 'wasp/server/operations';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get prompt for current user with selection and include options
 */
export const getPrompt: GetPrompt<
  {
    select?: any;
    include?: any;
  },
  Response
> = async (
  { select, include }: { select?: any; include?: any },
  context: { entities: { ExerciseGeneratePrompt: any }; user?: any }
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  try {
    const userId = context.user.id;

    const prompt = await context.entities.ExerciseGeneratePrompt.findFirst({
      where: { user_id: userId },
      select,
      include,
    });

    if (!prompt) {
      return {
        success: true,
        message: 'No prompt found, returning default',
        data: {
          id: 0,
          user_id: userId,
          pre_prompt: '',
          post_prompt: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
      };
    }

    return {
      success: true,
      message: 'Prompt retrieved successfully',
      data: prompt,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving prompt', { error });
  }
};

/**
 * Get all prompts with filtering, selection and include options
 */
export const getAllPrompts: GetAllPrompts<
  {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
  Response
> = async (
  args: {
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
  context: { entities: { ExerciseGeneratePrompt: any }; user?: any }
) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  try {
    const prompts = await context.entities.ExerciseGeneratePrompt.findMany({
      where: { user_id: context.user.id, ...args?.where },
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'Prompts retrieved successfully',
      data: prompts,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving prompts', { error });
  }
};
