import { type GetCourse, type GetAllCourses } from 'wasp/server/operations';
import { getS3DownloadUrl } from '../utils/s3Utils';
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

      // Process image URLs for each course
      const processedCourses = await Promise.all(
        courses.map(async (course: any) => {
          if (course.image) {
            try {
              const imageUrl = await getS3DownloadUrl({ key: `course_images/${course.id}.png` });
              return { ...course, image: imageUrl };
            } catch (error) {
              console.error(`Failed to get image URL for course ${course.id}:`, error);
              return course;
            }
          }
          return course;
        })
      );

      return {
        success: true,
        message: 'Public courses retrieved successfully',
        data: processedCourses,
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

    // Process image URLs for each course
    const processedCourses = await Promise.all(
      courses.map(async (course: any) => {
        if (course.image) {
          try {
            const imageUrl = await getS3DownloadUrl({ key: `course_images/${course.id}.png` });
            return { ...course, image: imageUrl };
          } catch (error) {
            console.error(`Failed to get image URL for course ${course.id}:`, error);
            return course;
          }
        }
        return course;
      })
    );

    return {
      success: true,
      message: 'User courses retrieved successfully', 
      data: processedCourses,
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

    // First try to find the course without restrictions
    let course = await context.entities.Course.findUnique({
      where: { id },
      select,
      include,
    });

    if (!course) {
      throw new HttpError(404, 'Course not found');
    }

    // Check access permissions
    if (!course.is_public && (!context.user || course.user_id !== context.user.id)) {
      throw new HttpError(403, 'You do not have permission to access this course');
    }

    // Process image URL if it exists
    if (course.image) {
      try {
        course.image = await getS3DownloadUrl({ key: `course-${id}/${course.image}` });
      } catch (error) {
        console.error(`Failed to get image URL for course ${id}:`, error);
      }
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
