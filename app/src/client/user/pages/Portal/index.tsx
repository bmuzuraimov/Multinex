import { useQuery, getAllCourses, getAllExercises } from 'wasp/client/operations';
import { useState, useEffect, useCallback } from 'react';
import ExerciseForm from '../../components/ExerciseForm';
import CourseForm from './components/CourseForm';
import ExerciseCard from '../../components/ExerciseCard';
import DefaultLayout from '../../layouts/DefaultLayout';
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

// Constants
const ITEMS_PER_PAGE = 12;

const Portal = () => {
  const { data: user } = useAuth();
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [debouncedCourseSearch, setDebouncedCourseSearch] = useState('');
  const [debouncedExerciseSearch, setDebouncedExerciseSearch] = useState('');
  const [activeTab, setActiveTab] = useState('courses');
  const [exercisesCurrentPage, setExercisesCurrentPage] = useState(1);
  const [coursesCurrentPage, setCoursesCurrentPage] = useState(1);
  const [exercisesTotalPages, setExercisesTotalPages] = useState(1);
  const [coursesTotalPages, setCoursesTotalPages] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Debounce search terms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCourseSearch(courseSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [courseSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedExerciseSearch(exerciseSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [exerciseSearchTerm]);

  // Get total count of courses
  const {
    data: coursesCountResponse,
    isLoading: coursesCountLoading,
    error: coursesCountError,
  } = useQuery(getAllCourses, {
    where: debouncedCourseSearch ? {
      name: {
        contains: debouncedCourseSearch,
        mode: 'insensitive'
      }
    } : {},
  });

  // Get courses for the current page
  const {
    data: coursesResponse,
    isLoading: courses_loading,
    error: courses_error,
  } = useQuery(getAllCourses, {
    where: debouncedCourseSearch ? {
      name: {
        contains: debouncedCourseSearch,
        mode: 'insensitive'
      }
    } : {},
    take: ITEMS_PER_PAGE,
    skip: (coursesCurrentPage - 1) * ITEMS_PER_PAGE,
    orderBy: {
      created_at: 'desc',
    },
  });

  // Get total count of exercises
  const {
    data: exercisesCountResponse,
    isLoading: exercisesCountLoading,
    error: exercisesCountError,
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

  // Get exercises for the current page
  const {
    data: exercisesResponse,
    isLoading: exercises_loading,
    error: exercises_error,
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
    take: ITEMS_PER_PAGE,
    skip: (exercisesCurrentPage - 1) * ITEMS_PER_PAGE,
    orderBy: {
      created_at: 'desc',
    },
  });

  // Extract data
  const courses = coursesResponse?.data || [];
  const exercises = exercisesResponse?.data || [];

  // Calculate total pages
  useEffect(() => {
    if (coursesCountResponse?.data) {
      setCoursesTotalPages(Math.max(1, Math.ceil(coursesCountResponse.data.length / ITEMS_PER_PAGE)));
    }
  }, [coursesCountResponse]);

  useEffect(() => {
    if (exercisesCountResponse?.data) {
      setExercisesTotalPages(Math.max(1, Math.ceil(exercisesCountResponse.data.length / ITEMS_PER_PAGE)));
    }
  }, [exercisesCountResponse]);

  // Add effect to set dataLoaded after data is fetched
  useEffect(() => {
    if (!exercises_loading && !exercisesCountLoading && exercises.length > 0) {
      // Set a short timeout to ensure DOM elements are fully rendered
      const timer = setTimeout(() => {
        setDataLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [exercises_loading, exercisesCountLoading, exercises]);

  // Handle pagination
  const handleCoursesPageChange = useCallback((page: number) => {
    setCoursesCurrentPage(page);
  }, []);

  const handleCoursesPrevious = useCallback(() => {
    setCoursesCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleCoursesNext = useCallback(() => {
    setCoursesCurrentPage((prev) => Math.min(coursesTotalPages, prev + 1));
  }, [coursesTotalPages]);

  const handleExercisesPageChange = useCallback((page: number) => {
    setExercisesCurrentPage(page);
  }, []);

  const handleExercisesPrevious = useCallback(() => {
    setExercisesCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleExercisesNext = useCallback(() => {
    setExercisesCurrentPage((prev) => Math.min(exercisesTotalPages, prev + 1));
  }, [exercisesTotalPages]);

  // Handle errors if needed
  if (courses_error) {
    toast.error(`Error loading courses: ${courses_error.message}`);
  }

  if (exercises_error) {
    toast.error(`Error loading exercises: ${exercises_error.message}`);
  }

  const handleCourseSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseSearchTerm(e.target.value);
  }, []);

  const handleExerciseSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExerciseSearchTerm(e.target.value);
  }, []);

  return (
    <div className='min-h-screen bg-background'>
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
                            <ExerciseCard exercise={exercise} key={exercise.id} user={user} isFirst={index === 0} />
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
