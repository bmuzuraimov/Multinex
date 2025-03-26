import { useQuery, getAllCourses, getExercisesWithNoTopic } from 'wasp/client/operations';
import { useState, useEffect, useCallback } from 'react';
import CourseForm from '../components/CourseForm';
import ExerciseCard from '../components/ExerciseCard';
import UserTour from '../components/UserTour';
import FooterSection from '../components/LandingPage/FooterSection';
import { useAuth } from 'wasp/client/auth';
import CourseCard from '../components/CourseCard';
import CardSkeleton from '../components/CardSkeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { IoAddOutline } from 'react-icons/io5';
import Loading from '../components/Loading';

interface Course {
  id: string;
  name: string;
  description: string;
  image?: string;
  is_public: boolean;
  total_exercises?: number;
  completed_exercises?: number;
  created_at: Date;
}

export default function PortalPage() {
  const { data: courses, error: courses_error, isLoading: courses_loading } = useQuery(getAllCourses);

  const { data: exercises, error: exercises_error, isLoading: exercises_loading } = useQuery(getExercisesWithNoTopic);
  const [local_courses, setLocalCourses] = useState<Course[]>([]);
  const { data: user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate()

  const handleNameChange = useCallback((id: string, value: string) => {
    setLocalCourses((prev_courses) => prev_courses.map((c) => (c.id === id ? { ...c, name: value } : c)));
  }, []);

  useEffect(() => {
    if (courses) {
      setLocalCourses(
        courses.courses.map((c: any) => ({
          ...c, 
          description: c.description || '',
          is_public: false,
        }))
      );
    }
  }, [courses]);

  if (courses_error) {
    toast.error('Error loading courses');
  }

  if (exercises_error) {
    toast.error('Error loading exercises');
  }

  return (
    <div className='min-h-screen bg-white'>
      {user && <UserTour user_id={user.id} />}
      <div className='tour-step-1 mx-auto max-w-7xl px-8 pt-16 pb-24'>
        <div className='mx-auto max-w-4xl text-center mb-16'>
          <h2 className='text-title-xl font-manrope text-primary-900'>My Courses</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {courses_loading ? (
            <div className='col-span-full flex justify-center items-center min-h-[200px]'>
              <CardSkeleton />
            </div>
          ) : (
            <>
              <CourseForm />
              {local_courses?.map((course) => (
                <CourseCard key={course.id} course={course}/>
              ))}
            </>
          )}
        </div>
      </div>
      <div className='mx-auto max-w-7xl px-8 pb-24'>
        <div className='mx-auto max-w-4xl text-center mb-16'>
          <h2 className='text-title-xl font-manrope text-primary-900'>Unassigned Exercises</h2>
          
          {/* Create Exercise Button */}
          <div className="mt-6 mb-8">
            {isCreating ? (
              <div className="relative flex items-center justify-center p-8">
                <div className="text-primary-600">
                  <Loading />
                </div>
              </div>
            ) : (
              <div 
                onClick={() => navigate('/create-exercise')}
                className="relative flex flex-col items-center justify-center p-5 cursor-pointer space-y-3 mx-auto max-w-sm border border-primary-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all duration-300 group shadow-sm"
              >
                <div className="p-3 rounded-full bg-primary-50 group-hover:bg-primary-100 transition-colors duration-300">
                  <IoAddOutline className="w-7 h-7 text-primary-600 group-hover:text-primary-700 transition-all duration-300 transform group-hover:rotate-90" />
                </div>
                
                <div className="text-center">
                  <h3 className="font-satoshi font-medium text-title-sm text-gray-800 mb-1">
                    Create New Exercise
                  </h3>
                  <p className="font-montserrat text-sm text-gray-500">
                    Click to add a new exercise
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Beautiful Divider */}
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent w-full max-w-md"></div>
            <div className="mx-20">
              <div className="w-3 h-3 rounded-full bg-primary-500"></div>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent w-full max-w-md"></div>
          </div>
        </div>

        {/* Exercises Grid - Changed to Horizontal Scroller */}
        <div className='overflow-x-auto pb-4 hide-scrollbar'>
          <div className='flex space-x-6 min-w-max px-2'>
            {exercises_loading ? (
              <div className='flex justify-center items-center min-h-[200px] w-full'>
                <CardSkeleton />
              </div>
            ) : exercises && exercises.length > 0 ? (
              exercises.map((exercise: any, index: number) => (
                <div key={exercise.id} className='w-48 flex-shrink-0'>
                  <ExerciseCard exercise={exercise} index={index} />
                </div>
              ))
            ) : (
              <div className='flex justify-center items-center min-h-[200px] w-full text-gray-500'>
                No unassigned exercises found
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
