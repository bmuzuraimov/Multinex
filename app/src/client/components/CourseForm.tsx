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
    <div className="relative bg-white rounded-2xl transition-all duration-300 group overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute inset-0 border-2 border-dashed border-gray-200 group-hover:border-primary-300 rounded-2xl transition-colors duration-300"></div>

      {isCreating ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
          <div className="text-primary-600">
            <Loading />
          </div>
        </div>
      ) : (
        <div 
          onClick={handleCreateCourse}
          className="relative flex flex-col items-center justify-center h-full p-8 cursor-pointer space-y-4"
        >
          <div className="p-4 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-300">
            <IoAddOutline className="w-8 h-8 text-primary-600 group-hover:text-primary-700 transition-all duration-300 transform group-hover:rotate-90" />
          </div>
          
          <div className="text-center">
            <h3 className="font-satoshi font-medium text-title-sm text-gray-800 mb-2">
              Create New Course
            </h3>
            <p className="font-montserrat text-sm text-gray-500">
              Click to add a new learning journey
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseForm;
