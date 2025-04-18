import { useQuery, getAllCourses, getExercisesWithNoTopic } from 'wasp/client/operations';
import { useState, useEffect, useCallback } from 'react';
import ExerciseForm from '../../components/ExerciseForm';
import CourseForm from '../../components/CourseForm';
import ExerciseCard from '../../components/ExerciseCard';
import DefaultLayout from '../layouts/DefaultLayout';
import UserTour from '../../components/UserTour';
import { useAuth } from 'wasp/client/auth';
import CourseCard from '../../components/CourseCard';
import { toast } from 'sonner';

// Import shadcn components
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shadcn/components/ui/tabs';
import { Separator } from '../../shadcn/components/ui/separator';
import { Skeleton } from '../../shadcn/components/ui/skeleton';
import { ScrollArea } from '../../shadcn/components/ui/scroll-area';
import { Badge } from '../../shadcn/components/ui/badge';

// Import icons
import { FiBook, FiFileText } from 'react-icons/fi';

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

const PortalPage = () => {
  const {
    data: courses,
    error: courses_error,
    isLoading: courses_loading,
    refetch: refetchCourses,
  } = useQuery(getAllCourses);
  const {
    data: exercises,
    error: exercises_error,
    isLoading: exercises_loading,
    refetch: refetchExercises,
  } = useQuery(getExercisesWithNoTopic);
  const [local_courses, setLocalCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState('courses');
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
    <div className='min-h-screen bg-background'>
      {user && <UserTour user_id={user.id} />}

      <div className='mx-auto max-w-7xl px-6 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-title-xl font-manrope font-bold text-primary-900'>Learning Portal</h1>
          </div>
        </div>

        <Tabs defaultValue='courses' className='tour-step-1' onValueChange={setActiveTab}>
          <div className='flex items-center justify-between mb-6'>
            <TabsList className='bg-primary-50'>
              <TabsTrigger
                value='courses'
                className='data-[state=active]:bg-primary-500 data-[state=active]:text-white'
              >
                <FiBook className='mr-2 h-4 w-4' />
                Courses
              </TabsTrigger>
              <TabsTrigger
                value='exercises'
                className='data-[state=active]:bg-primary-500 data-[state=active]:text-white'
              >
                <FiFileText className='mr-2 h-4 w-4' />
                Unassigned Exercises
              </TabsTrigger>
            </TabsList>

            {activeTab === 'courses' ? (
              <Badge variant='outline' className='bg-primary-50 text-primary-700 hover:bg-primary-100'>
                {local_courses?.length || 0} Courses
              </Badge>
            ) : (
              <Badge variant='outline' className='bg-primary-50 text-primary-700 hover:bg-primary-100'>
                {exercises?.length || 0} Exercises
              </Badge>
            )}
          </div>

          <Separator className='mb-8' />

          <TabsContent value='courses' className='mt-0'>
            <Card className='border-none shadow-none bg-transparent'>
              <CardHeader className='px-0 pt-0'>
                <CardTitle className='text-title-md font-manrope text-primary-800'>My Courses</CardTitle>
              </CardHeader>
              <CardContent className='px-0 pt-4'>
                <ScrollArea className='h-full'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {courses_loading ? (
                      Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <Card key={i} className='overflow-hidden border border-primary-100'>
                            <div className='p-6 space-y-4'>
                              <Skeleton className='h-6 w-3/4' />
                              <Skeleton className='h-4 w-full' />
                              <Skeleton className='h-4 w-2/3' />
                              <div className='pt-4'>
                                <Skeleton className='h-10 w-full rounded-lg' />
                              </div>
                            </div>
                          </Card>
                        ))
                    ) : (
                      <>
                        <CourseForm />

                        {local_courses?.map((course) => <CourseCard course={course} key={course.id} />)}
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='exercises' className='mt-0'>
            <Card className='border-none shadow-none bg-transparent'>
              <CardHeader className='px-0 pt-0'>
                <CardTitle className='text-title-md font-manrope text-primary-800'>Unassigned Exercises</CardTitle>
              </CardHeader>
              <CardContent className='px-0 pt-4'>
                <ScrollArea className='h-full'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
                    {exercises_loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Card key={i} className='overflow-hidden border border-primary-100'>
                            <div className='p-6 space-y-4'>
                              <Skeleton className='h-6 w-3/4' />
                              <Skeleton className='h-4 w-full' />
                              <Skeleton className='h-4 w-2/3' />
                              <div className='pt-4'>
                                <Skeleton className='h-10 w-full rounded-lg' />
                              </div>
                            </div>
                          </Card>
                        ))
                    ) : (
                      <>
                        <Card className='overflow-hidden border-primary-200 bg-primary-50/50 hover:bg-primary-50 transition-colors'>
                          <ExerciseForm topic_id={null} demo={false} />
                        </Card>

                        {exercises?.map((exercise: any, index: number) => (
                          <Card key={exercise.id} className='overflow-hidden hover:shadow-md transition-all'>
                            <ExerciseCard exercise={exercise} index={index} />
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DefaultLayout(PortalPage);
