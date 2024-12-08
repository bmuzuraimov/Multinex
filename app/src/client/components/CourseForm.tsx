import React, { useCallback, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { COURSE_IMAGES } from '../../shared/constants';
import Loading from './Loading';
import { createCourse } from 'wasp/client/operations';

interface CourseFormProps {}

const CourseForm: React.FC<CourseFormProps> = () => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCourse = useCallback(async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      await createCourse({
        name: 'Click to Edit Course Name',
        description: 'New Course Description',
        image: COURSE_IMAGES[Math.floor(Math.random() * COURSE_IMAGES.length)],
      });
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    } finally {
      setIsCreating(false);
    }
  }, [isCreating]);

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden backdrop-blur-sm h-full`}
    >
      {isCreating ? (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl text-black dark:text-white'>
          <Loading />
        </div>
      ) : (
        <div className='flex flex-col h-full'>
          <div
            className='flex justify-center items-center h-full bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:bg-opacity-90'
            onClick={handleCreateCourse}
          >
            <IoAddOutline className='text-4xl text-gray-600 dark:text-gray-300 mr-2 transition-transform duration-200 group-hover:rotate-90' />
            <span className='text-gray-600 dark:text-gray-300 font-medium hover:text-gray-800 dark:hover:text-white transition-colors duration-200'>Create New Course</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseForm;
