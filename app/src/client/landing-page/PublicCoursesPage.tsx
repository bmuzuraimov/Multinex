import { getPublicCourses, duplicateCourse, useQuery } from 'wasp/client/operations';
import { useCallback, memo, useState } from 'react';
import { VscCopy } from 'react-icons/vsc';
import { HiOutlineBookOpen, HiOutlineAcademicCap } from 'react-icons/hi';
import { FaRegStar } from 'react-icons/fa';
import { useAuth } from 'wasp/client/auth';

interface Course {
    id: string;
    name: string;
    description: string;
    image?: string;
    userId: string;
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
    setIsDescriptionExpanded(prev => !prev);
  }, []);

  const isOwner = user?.id === course.userId;

  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-102 overflow-hidden ${
        isOwner 
          ? 'border-2 border-teal-500 dark:border-teal-400' 
          : 'border border-gray-100 dark:border-gray-700'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-48 w-full ${course.image} bg-cover bg-center`}>
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
      </div>
      <div className='p-6 relative'>
        <div className='flex justify-between items-start mb-3'>
          <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{course.name}</h4>
          {!isOwner && (
            <button
              className={`p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 backdrop-blur-sm ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              onClick={handleEnroll}
              title={user ? 'Enroll in this course' : 'Sign in to enroll'}
            >
              <VscCopy className='w-5 h-5' />
            </button>
          )}
        </div>
        <div className='relative'>
          <p className={`text-sm text-gray-600 dark:text-gray-400 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
            {course.description}
          </p>
          {course.description.length > 150 && (
            <button
              onClick={toggleDescription}
              className='mt-1 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors'
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        <div className='mt-4 flex flex-col space-y-3'>
          <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
            <div className='flex items-center space-x-2'>
              <HiOutlineBookOpen className='w-5 h-5' />
              <span>{course.totalTopics} Topics</span>
            </div>
            <div className='flex items-center space-x-2'>
              <HiOutlineAcademicCap className='w-5 h-5' />
              <span>{course.totalExercises} Exercises</span>
            </div>
          </div>
          
          <div className='pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              Added {new Date(course.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className='text-xs font-medium text-teal-600 dark:text-teal-400'>
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
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white'></div>
      </div>
    );
  }

  if (errorPublicCourses) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-red-500'>Error loading courses. Please try again later.</div>
      </div>
    );
  }

  if (!publicCourses?.courses?.length) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen space-y-4'>
        <HiOutlineBookOpen className='w-16 h-16 text-gray-400' />
        <div className='text-gray-500 text-lg'>No public courses available yet</div>
        <p className='text-gray-400 text-sm'>Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='lg:mt-10 pb-10'>
        <div className='mx-auto max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl'>
              Community Courses
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>
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
    </div>
  );
};

export default PublicCoursesPage;
