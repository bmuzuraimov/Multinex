import { type CreateDemoExercise, type UpdateDemoExercise, type DeleteDemoExercise } from 'wasp/server/operations';
import { DemoExercise } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Create a new demo exercise
 */
export const createDemoExercise: CreateDemoExercise<Partial<DemoExercise>, Response> = async (
  demoExerciseData: Partial<DemoExercise>,
  context: { entities: { DemoExercise: any } }
) => {
  try {
    const demoExercise = await context.entities.DemoExercise.create({
      data: demoExerciseData,
    });
    return {
      success: true,
      message: 'Demo exercise created successfully',
      data: demoExercise,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error creating demo exercise');
  }
};

/**
 * Update an existing demo exercise
 */
export const updateDemoExercise: UpdateDemoExercise<Partial<DemoExercise>, Response> = async (
  demoExerciseData: Partial<DemoExercise>,
  context: { entities: { DemoExercise: any } }
) => {
  try {
    const demoExercise = await context.entities.DemoExercise.update({
      where: { id: demoExerciseData.id },
      data: demoExerciseData,
    });
    return {
      success: true,
      message: 'Demo exercise updated successfully',
      data: demoExercise,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error updating demo exercise');
  }
};

/**
 * Delete a demo exercise
 */
export const deleteDemoExercise: DeleteDemoExercise<{ id: string }, Response> = async (
  { id }: { id: string },
  context: { entities: { DemoExercise: any } }
) => {
  try {
    const demoExercise = await context.entities.DemoExercise.delete({
      where: { id },
    });
    return {
      success: true,
      message: 'Demo exercise deleted successfully',
      data: demoExercise,
    };
  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error deleting demo exercise');
  }
};
