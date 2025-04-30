import { useQuery, getAllCourses, getAllExercises } from 'wasp/client/operations';
import { useState, useEffect, useCallback } from 'react';
import ExerciseForm from '../../components/ExerciseForm';
import CourseForm from './components/CourseForm';
import ExerciseCard from '../../components/ExerciseCard';
import DefaultLayout from '../../layouts/DefaultLayout';
import UserTour from '../../../components/UserTour';
import { useAuth } from 'wasp/client/auth';
import CourseCard from './components/CourseCard';
import { toast } from 'sonner';

// Import shadcn components
import { Card, CardContent, CardHeader, CardTitle } from '../../../shadcn/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shadcn/components/ui/tabs';
import { Separator } from '../../../shadcn/components/ui/separator';
import { Skeleton } from '../../../shadcn/components/ui/skeleton';
import { ScrollArea } from '../../../shadcn/components/ui/scroll-area';
import { Badge } from '../../../shadcn/components/ui/badge';
import { Input } from '../../../shadcn/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../shadcn/components/ui/pagination';
import { cn } from '../../../../shared/utils';

// Import icons
import { FiBook, FiFileText, FiSearch } from 'react-icons/fi';


const Portal = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [debouncedCourseSearch, setDebouncedCourseSearch] = useState('');
  const [debouncedExerciseSearch, setDebouncedExerciseSearch] = useState('');
  const [coursesCurrentPage, setCoursesCurrentPage] = useState(1);
  const [exercisesCurrentPage, setExercisesCurrentPage] = useState(1);
  const [coursesTotalPages, setCoursesTotalPages] = useState(1);
  const [exercisesTotalPages, setExercisesTotalPages] = useState(1);
  const itemsPerPage = 8;
  const { data: user } = useAuth();
  
  // Debounce course search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCourseSearch(courseSearchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [courseSearchTerm]);

  // Debounce exercise search term  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedExerciseSearch(exerciseSearchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [exerciseSearchTerm]);

  // Reset to page 1 when search terms change
  useEffect(() => {
    setCoursesCurrentPage(1);
  }, [debouncedCourseSearch]);

  useEffect(() => {
    setExercisesCurrentPage(1);
  }, [debouncedExerciseSearch]);

  // Query for paginated and filtered courses
  const {
    data: coursesResponse,
    error: courses_error,
    isLoading: courses_loading,
    refetch: refetchCourses,
  } = useQuery(getAllCourses, {
    where: debouncedCourseSearch ? {
      name: {
        contains: debouncedCourseSearch,
        mode: 'insensitive'
      }
    } : {},
    include: {
      topics: {
        include: {
          exercises: true,
        },
      },
    },
    take: itemsPerPage,
    skip: (coursesCurrentPage - 1) * itemsPerPage,
    orderBy: {
      created_at: 'asc',
    },
  });

  // Query for courses count (for pagination)
  const {
    data: coursesCountResponse,
    isLoading: coursesCountLoading,
  } = useQuery(getAllCourses, {
    where: debouncedCourseSearch ? {
      name: {
        contains: debouncedCourseSearch,
        mode: 'insensitive'
      }
    } : {},
  });

  // Query for paginated and filtered exercises
  const {
    data: exercisesResponse,
    error: exercises_error,
    isLoading: exercises_loading,
    refetch: refetchExercises,
  } = useQuery(getAllExercises, {
    where: {
      topic_id: null,
      ...(debouncedExerciseSearch ? {
        name: {
          contains: debouncedExerciseSearch,
          mode: 'insensitive'
        }
      } : {})
    },
    orderBy: {
      created_at: 'desc',
    },
    take: itemsPerPage,
    skip: (exercisesCurrentPage - 1) * itemsPerPage,
  });

  // Query for exercises count (for pagination)
  const {
    data: exercisesCountResponse,
    isLoading: exercisesCountLoading,
  } = useQuery(getAllExercises, {
    where: {
      topic_id: null,
      ...(debouncedExerciseSearch ? {
        name: {
          contains: debouncedExerciseSearch,
          mode: 'insensitive'
        }
      } : {})
    },
  });
  
  // Calculate total pages for courses pagination
  useEffect(() => {
    if (coursesCountResponse?.success && coursesCountResponse.data) {
      setCoursesTotalPages(Math.ceil(coursesCountResponse.data.length / itemsPerPage));
      if (coursesCurrentPage > Math.ceil(coursesCountResponse.data.length / itemsPerPage)) {
        setCoursesCurrentPage(1);
      }
    }
  }, [coursesCountResponse?.data, coursesCurrentPage]);

  // Calculate total pages for exercises pagination
  useEffect(() => {
    if (exercisesCountResponse?.success && exercisesCountResponse.data) {
      setExercisesTotalPages(Math.ceil(exercisesCountResponse.data.length / itemsPerPage));
      if (exercisesCurrentPage > Math.ceil(exercisesCountResponse.data.length / itemsPerPage)) {
        setExercisesCurrentPage(1);
      }
    }
  }, [exercisesCountResponse?.data, exercisesCurrentPage]);

  const courses = coursesResponse?.success ? (coursesResponse.data as any[]) : [];
  const exercises = exercisesResponse?.success ? (exercisesResponse.data as any[]) : [];

  if (courses_error) {
    toast.error('Error loading courses');
  }

  if (exercises_error) {
    toast.error('Error loading exercises');
  }

  // Pagination handlers for courses
  const handleCoursesPageChange = useCallback((page: number) => {
    setCoursesCurrentPage(page);
  }, []);

  const handleCoursesPrevious = useCallback(() => {
    if (coursesCurrentPage > 1) {
      setCoursesCurrentPage(prev => prev - 1);
    }
  }, [coursesCurrentPage]);

  const handleCoursesNext = useCallback(() => {
    if (coursesCurrentPage < coursesTotalPages) {
      setCoursesCurrentPage(prev => prev + 1);
    }
  }, [coursesCurrentPage, coursesTotalPages]);

  // Pagination handlers for exercises
  const handleExercisesPageChange = useCallback((page: number) => {
    setExercisesCurrentPage(page);
  }, []);

  const handleExercisesPrevious = useCallback(() => {
    if (exercisesCurrentPage > 1) {
      setExercisesCurrentPage(prev => prev - 1);
    }
  }, [exercisesCurrentPage]);

  const handleExercisesNext = useCallback(() => {
    if (exercisesCurrentPage < exercisesTotalPages) {
      setExercisesCurrentPage(prev => prev + 1);
    }
  }, [exercisesCurrentPage, exercisesTotalPages]);

  // Search handlers
  const handleCourseSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseSearchTerm(e.target.value);
  }, []);

  const handleExerciseSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExerciseSearchTerm(e.target.value);
  }, []);

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
                {coursesCountResponse?.data?.length || 0} Courses
              </Badge>
            ) : (
              <Badge variant='outline' className='bg-primary-50 text-primary-700 hover:bg-primary-100'>
                {exercisesCountResponse?.data?.length || 0} Exercises
              </Badge>
            )}
          </div>

          <Separator className='mb-8' />

          <TabsContent value='courses' className='mt-0'>
            <Card className='border-none shadow-none bg-transparent'>
              <CardHeader className='px-0 pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                <CardTitle className='text-title-md font-manrope text-primary-800'>My Courses</CardTitle>
                <div className='w-full sm:w-64 mt-2 sm:mt-0 relative'>
                  <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    type='text'
                    placeholder='Search courses...'
                    value={courseSearchTerm}
                    onChange={handleCourseSearchChange}
                    className='pl-10 w-full'
                  />
                </div>
              </CardHeader>
              <CardContent className='px-0 pt-4'>
                <ScrollArea className='h-full'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {courses_loading || coursesCountLoading ? (
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
                        {courses?.map((course: any) => <CourseCard course={course} key={course.id} />)}
                        {courses.length === 0 && debouncedCourseSearch && (
                          <div className='col-span-full text-center py-10'>
                            <p className='text-muted-foreground'>No courses found matching "{debouncedCourseSearch}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {!courses_loading && coursesTotalPages > 1 && (
                    <Pagination className='mt-8'>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={handleCoursesPrevious} 
                            className={cn(coursesCurrentPage === 1 && 'pointer-events-none opacity-50')}
                          />
                        </PaginationItem>
                        
                        {[...Array(coursesTotalPages)].map((_, i) => {
                          const page = i + 1;
                          // Show a reasonable number of page links
                          if (
                            page === 1 || 
                            page === coursesTotalPages || 
                            (page >= coursesCurrentPage - 1 && page <= coursesCurrentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink 
                                  onClick={() => handleCoursesPageChange(page)}
                                  isActive={page === coursesCurrentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={handleCoursesNext} 
                            className={cn(coursesCurrentPage === coursesTotalPages && 'pointer-events-none opacity-50')}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='exercises' className='mt-0'>
            <Card className='border-none shadow-none bg-transparent'>
              <CardHeader className='px-0 pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                <CardTitle className='text-title-md font-manrope text-primary-800'>Unassigned Exercises</CardTitle>
                <div className='w-full sm:w-64 mt-2 sm:mt-0 relative'>
                  <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    type='text'
                    placeholder='Search exercises...'
                    value={exerciseSearchTerm}
                    onChange={handleExerciseSearchChange}
                    className='pl-10 w-full'
                  />
                </div>
              </CardHeader>
              <CardContent className='px-0 pt-4'>
                <ScrollArea className='h-full'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6'>
                    {exercises_loading || exercisesCountLoading ? (
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
                            <ExerciseCard exercise={exercise} key={exercise.id} user={user} />
                          </Card>
                        ))}
                        {exercises.length === 0 && debouncedExerciseSearch && (
                          <div className='col-span-full text-center py-10'>
                            <p className='text-muted-foreground'>No exercises found matching "{debouncedExerciseSearch}"</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {!exercises_loading && exercisesTotalPages > 1 && (
                    <Pagination className='mt-8'>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={handleExercisesPrevious} 
                            className={cn(exercisesCurrentPage === 1 && 'pointer-events-none opacity-50')}
                          />
                        </PaginationItem>
                        
                        {[...Array(exercisesTotalPages)].map((_, i) => {
                          const page = i + 1;
                          // Show a reasonable number of page links
                          if (
                            page === 1 || 
                            page === exercisesTotalPages || 
                            (page >= exercisesCurrentPage - 1 && page <= exercisesCurrentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink 
                                  onClick={() => handleExercisesPageChange(page)}
                                  isActive={page === exercisesCurrentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={handleExercisesNext} 
                            className={cn(exercisesCurrentPage === exercisesTotalPages && 'pointer-events-none opacity-50')}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DefaultLayout(Portal);
