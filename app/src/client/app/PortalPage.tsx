import { useQuery, getAllCourses, getExercisesWithNoTopic } from 'wasp/client/operations';
import { useState, useEffect, useCallback } from 'react';
import ExerciseForm from '../components/ExerciseForm';
import CourseForm from '../components/CourseForm';
import ExerciseCard from '../components/ExerciseCard';
import UserTour from '../components/UserTour';
import FooterSection from '../components/LandingPage/FooterSection';
import { useAuth } from 'wasp/client/auth';
import CourseCard from '../components/CourseCard';
import CardSkeleton from '../components/CardSkeleton';
import { toast } from 'sonner';

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
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8'>
          {exercises_loading ? (
            <div className='col-span-full flex justify-center items-center min-h-[200px]'>
              <CardSkeleton />
            </div>
          ) : (
            <>
              <ExerciseForm topic_id={null} demo={false} />
              {exercises?.map((exercise: any, index: number) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
              ))}
            </>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
