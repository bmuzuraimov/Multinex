import { type GetCourse, type GetAllCourses } from 'wasp/server/operations';
import { HttpError } from 'wasp/server';

type Response = {
  success: boolean;
  message: string;
  data: any;
};

/**
 * Get all courses with filtering, selection and include options
 */
export const getAllCourses: GetAllCourses<
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
  context: any
) => {
  try {
    // If is_public is explicitly set in args.where, we're fetching public courses
    if (args?.where?.is_public === true) {
      // Public course page - only return public courses
      const courses = await context.entities.Course.findMany({
        where: { ...args.where, is_public: true }, // Ensure is_public is true
        select: args?.select,
        include: args?.include,
        orderBy: args?.orderBy,
        skip: args?.skip,
        take: args?.take,
      });

      return {
        success: true,
        message: 'Public courses retrieved successfully',
        data: courses,
      };
    }

    // Otherwise, we're fetching user's own courses - require authentication
    if (!context.user?.id) {
      throw new HttpError(401, 'Authentication required to access courses');
    }

    const courses = await context.entities.Course.findMany({
      where: { ...args?.where, user_id: context.user.id }, // Only return user's courses
      select: args?.select,
      include: args?.include,
      orderBy: args?.orderBy,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      success: true,
      message: 'User courses retrieved successfully', 
      data: courses,
    };

  } catch (error) {
    console.error(error);
    throw new HttpError(500, 'Error retrieving courses', { error });
  }
};

/**
 * Get course by ID with selection and include options
 */
export const getCourse: GetCourse<
  {
    id: string;
    select?: any;
    include?: any;
  },
  Response
> = async ({ id, select, include }: { id: string; select?: any; include?: any }, context: any) => {
  try {
    if (!id) {
      throw new HttpError(400, 'Course ID is required');
    }

    const course = await context.entities.Course.findUnique({
      where: context.user?.id ? { id, user_id: context.user.id } : { id, is_public: true },
      select,
      include,
    });

    if (!course) {
      throw new HttpError(404, 'Course not found');
    }

    return {
      success: true,
      message: 'Course retrieved successfully',
      data: course,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Error retrieving course', { error });
  }
};
