import { useAction, useQuery, duplicateCourse, getAllCourses } from 'wasp/client/operations';
import { useCallback, memo, useMemo, useState, useEffect } from 'react';
import { HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlinePlusCircle, HiOutlineSearch } from 'react-icons/hi';
import { useAuth } from 'wasp/client/auth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Import shadcn components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../../../shadcn/components/ui/card';
import { Button } from '../../../shadcn/components/ui/button';
import { ScrollArea } from '../../../shadcn/components/ui/scroll-area';
import { Skeleton } from '../../../shadcn/components/ui/skeleton';
import { Alert, AlertDescription } from '../../../shadcn/components/ui/alert';
import { Badge } from '../../../shadcn/components/ui/badge';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../../shadcn/components/ui/hover-card';
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
import DefaultLayout from '../../layouts/DefaultLayout';

interface Course {
  id: string;
  name: string;
  description: string;
  image?: string;
  user_id: string | null;
  is_public: boolean;
  exercises: any[];
  topics: any[];
  created_at: Date;
  user?: {
    id: string;
  };
}

const PublicCourseCard = memo(({ course, onEnroll }: { course: Course; onEnroll: (id: string) => void }) => {
  const { data: user } = useAuth();
  const isOwner = user?.id === course.user?.id;

  const handleEnroll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        toast.error('Please sign in to enroll in this course');
        return;
      }
      if (isOwner) {
        toast.error('This is your course - no need to enroll!');
        return;
      }
      onEnroll(course.id);
    },
    [course.id, isOwner, onEnroll, user]
  );

  const formattedDate = useMemo(() => {
    return new Date(course.created_at).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [course.created_at]);

  const topicsCount = course.topics?.length || 0;
  const exercisesCount = course.topics?.reduce((acc, topic) => acc + (topic.exercises?.length || 0), 0) || 0;

  return (
    <Card
      className={cn(
        'group transition-all duration-300 hover:shadow-lg',
        isOwner ? 'border-primary-500' : 'border-primary-100'
      )}
    >
      <CardHeader className='space-y-2'>
        <div className='flex justify-between items-start'>
          <Link to={`/course/${course.id}`} className='block no-underline text-inherit'>
            <CardTitle className='text-lg font-manrope text-primary-900'>{course.name}</CardTitle>
          </Link>
          {!isOwner && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleEnroll}
              className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2'
            >
              <HiOutlinePlusCircle className='w-4 h-4' />
              Enroll
            </Button>
          )}
        </div>
        <HoverCard>
          <HoverCardTrigger asChild>
            <CardDescription className='line-clamp-2 cursor-pointer'>{course.description}</CardDescription>
          </HoverCardTrigger>
          <HoverCardContent className='w-80'>
            <p className='text-sm text-muted-foreground'>{course.description}</p>
          </HoverCardContent>
        </HoverCard>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <HiOutlineBookOpen className='w-5 h-5 text-secondary-500' />
            <span className='font-satoshi text-sm'>{topicsCount} Topics</span>
          </div>
          <div className='flex items-center space-x-2'>
            <HiOutlineAcademicCap className='w-5 h-5 text-secondary-500' />
            <span className='font-satoshi text-sm'>{exercisesCount} Exercises</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-4 flex justify-between items-center'>
        <span className='text-xs font-satoshi text-muted-foreground'>{course.created_at.toLocaleDateString()}</span>
        <Badge variant={isOwner ? 'secondary' : 'default'}>{isOwner ? 'Your Course' : 'Free'}</Badge>
      </CardFooter>
    </Card>
  );
});

const LoadingState = memo(() => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8'>
    {[...Array(6)].map((_, i) => (
      <Card key={i} className='w-full'>
        <CardHeader>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-4 w-full mt-2' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-20 w-full' />
        </CardContent>
      </Card>
    ))}
  </div>
));

const EmptyState = memo(() => (
  <div className='flex flex-col items-center justify-center min-h-[60vh] space-y-4'>
    <HiOutlineBookOpen className='w-16 h-16 text-primary-300' />
    <CardTitle className='text-xl text-primary-900'>No public courses available yet</CardTitle>
    <CardDescription>Check back later for new content</CardDescription>
  </div>
));

const PublicCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 18;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery(getAllCourses, {
    where: {
      is_public: true,
      ...(debouncedSearchTerm
        ? {
            name: {
              contains: debouncedSearchTerm,
              mode: 'insensitive',
            },
          }
        : {}),
    },
    include: {
      user: true,
      topics: {
        include: {
          exercises: true,
        },
      },
    },
    orderBy: {
      created_at: 'asc',
    },
    take: coursesPerPage,
    skip: (currentPage - 1) * coursesPerPage,
  });

  // For pagination, we need to know the total number of courses
  const { data: countResponse, isLoading: isCountLoading } = useQuery(getAllCourses, {
    where: {
      is_public: true,
      ...(debouncedSearchTerm
        ? {
            name: {
              contains: debouncedSearchTerm,
              mode: 'insensitive',
            },
          }
        : {}),
    },
  });

  // Calculate total pages
  useEffect(() => {
    if (countResponse?.data) {
      setTotalPages(Math.ceil(countResponse.data.length / coursesPerPage));
      // Reset to page 1 if current page is beyond total pages
      if (currentPage > Math.ceil(countResponse.data.length / coursesPerPage)) {
        setCurrentPage(1);
      }
    }
  }, [countResponse?.data, currentPage, coursesPerPage]);

  const duplicateCourseAction = useAction(duplicateCourse);

  const handleEnroll = useCallback(
    async (id: string) => {
      toast('Do you want to enroll in this course?', {
        action: {
          label: 'Enroll',
          onClick: () => {
            toast.promise(duplicateCourseAction({ id }), {
              loading: 'Enrolling in course...',
              success: 'Successfully enrolled in course! You can now find it in your courses.',
              error: 'Failed to enroll in course. Please try again.',
            });
          },
        },
      });
    },
    [duplicateCourseAction]
  );

  // Handle search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Don't reset page here, we'll do it in the useEffect when debouncedSearchTerm changes
  }, []);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  if (isLoading || isCountLoading) return <LoadingState />;

  if (error) {
    return (
      <div className='p-8'>
        <Alert variant='destructive'>
          <AlertDescription>Error loading courses. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const courses = response?.data || [];
  const noCoursesFound = courses.length === 0;

  return (
    <ScrollArea className='h-full'>
      <div className='py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <div className='text-center space-y-4 mb-8'>
          <h2 className='text-3xl font-bold font-manrope tracking-tight text-primary-900'>Community Courses</h2>
        </div>

        {/* Search input */}
        <div className='mb-8 max-w-md mx-auto'>
          <div className='relative'>
            <HiOutlineSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
            <Input
              type='text'
              placeholder='Search courses by name...'
              value={searchTerm}
              onChange={handleSearchChange}
              className='pl-10'
            />
          </div>
        </div>

        {noCoursesFound ? (
          <EmptyState />
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8'>
              {courses.map((course: Course) => (
                <PublicCourseCard key={course.id} course={course} onEnroll={handleEnroll} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination className='mt-8'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevious}
                    className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show a reasonable number of page links
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={handleNext}
                    className={cn(currentPage === totalPages && 'pointer-events-none opacity-50')}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default DefaultLayout(PublicCourses);
