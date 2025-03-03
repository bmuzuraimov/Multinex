import { getPublicCourses, duplicateCourse, useQuery } from 'wasp/client/operations';
import { useCallback, memo, useState } from 'react';
import { VscCopy } from 'react-icons/vsc';
import { HiOutlineBookOpen, HiOutlineAcademicCap } from 'react-icons/hi';
import { useAuth } from 'wasp/client/auth';

interface Course {
  id: string;
  name: string;
  description: string;
  image?: string;
  userId: string | null;
  isPublic: boolean;
  totalExercises: number;
  totalTopics: number;
  createdAt: Date;
}

const PublicCourseCard = memo(({ course, onEnroll }: { course: Course; onEnroll: (id: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { data: user } = useAuth();

  const handleEnroll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        alert('Please sign in to enroll in this course');
        return;
      }
      if (user.id === course.userId) {
        alert('This is your course - no need to enroll!');
        return;
      }
      onEnroll(course.id);
    },
    [course.id, course.userId, onEnroll, user]
  );

  const toggleDescription = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionExpanded((prev) => !prev);
  }, []);

  const isOwner = user?.id === course.userId;

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-102 overflow-hidden ${
        isOwner ? 'border border-primary-500' : 'border border-primary-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-48 w-full ${course.image} bg-cover bg-center`}>
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
      </div>
      <div className='p-6 relative'>
        <div className='flex justify-between items-start mb-3'>
          <h4 className='text-lg font-manrope font-semibold text-gray-900'>{course.name}</h4>
          {!isOwner && (
            <button
              className={`p-2 rounded-full bg-white/90 text-secondary-500 hover:text-secondary-600 transition-colors duration-200 backdrop-blur-sm ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={handleEnroll}
              title={user ? 'Enroll in this course' : 'Sign in to enroll'}
            >
              <VscCopy className='w-5 h-5' />
            </button>
          )}
        </div>
        <div className='relative'>
          <p className={`text-sm font-montserrat text-gray-600 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
            {course.description}
          </p>
          {course.description.length > 150 && (
            <button
              onClick={toggleDescription}
              className='mt-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors'
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        <div className='mt-4 flex flex-col space-y-3'>
          <div className='flex items-center justify-between text-sm text-gray-600'>
            <div className='flex items-center space-x-2'>
              <HiOutlineBookOpen className='w-5 h-5 text-secondary-400' />
              <span className='font-satoshi'>{course.totalTopics} Topics</span>
            </div>
            <div className='flex items-center space-x-2'>
              <HiOutlineAcademicCap className='w-5 h-5 text-secondary-400' />
              <span className='font-satoshi'>{course.totalExercises} Exercises</span>
            </div>
          </div>

          <div className='pt-3 border-t border-primary-100 flex justify-between items-center'>
            <span className='text-xs font-satoshi text-gray-500'>
              Added{' '}
              {new Date(course.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className='text-xs font-medium text-primary-600'>
              {isOwner ? 'Your Course' : 'Free'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

PublicCourseCard.displayName = 'PublicCourseCard';

const PublicCoursesPage = () => {
  const {
    data: publicCourses,
    isLoading: isLoadingPublicCourses,
    error: errorPublicCourses,
  } = useQuery(getPublicCourses);

  const handleEnroll = useCallback(async (id: string) => {
    try {
      if (window.confirm('Do you want to enroll in this course?')) {
        await duplicateCourse({ id });
        alert('Successfully enrolled in course! You can now find it in your courses.');
      }
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  }, []);

  if (isLoadingPublicCourses) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
      </div>
    );
  }

  if (errorPublicCourses) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-danger'>Error loading courses. Please try again later.</div>
      </div>
    );
  }

  if (!publicCourses?.courses?.length) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen space-y-4'>
        <HiOutlineBookOpen className='w-16 h-16 text-primary-300' />
        <div className='text-gray-500 text-lg font-manrope'>No public courses available yet</div>
        <p className='text-gray-400 text-sm font-montserrat'>Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className='lg:mt-10 pb-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-title-xl font-bold font-manrope tracking-tight text-gray-900'>
            Community Courses
          </h2>
          <p className='mt-4 text-lg font-montserrat text-gray-600'>
            Explore and enroll in high-quality courses shared by the community. All courses are free to use.
          </p>
        </div>

        <div className='mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {publicCourses.courses.map((course) => (
            <PublicCourseCard key={course.id} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicCoursesPage;
