import { useAction, useQuery, duplicateCourse, getAllCourses } from 'wasp/client/operations';
import { useCallback, memo, useMemo } from 'react';
import { HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlinePlusCircle } from 'react-icons/hi';
import { useAuth } from 'wasp/client/auth';
import { toast } from 'sonner';

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
          <CardTitle className='text-lg font-manrope text-primary-900'>{course.name}</CardTitle>
          {!isOwner && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleEnroll}
              className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2'
            >
              <HiOutlinePlusCircle className="w-4 h-4" />
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
        <span className='text-xs font-satoshi text-muted-foreground'>{formattedDate}</span>
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
  const {
    data: response,
    isLoading,
    error,
  } = useQuery(getAllCourses, {
    where: {
      is_public: true,
    },
    include: {
      user: true,
      topics: {
        include: {
          exercises: true,
        },
      },
    },
  });

  const duplicateCourseAction = useAction(duplicateCourse);

  const handleEnroll = useCallback(async (id: string) => {
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
  }, [duplicateCourseAction]);

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <div className='p-8'>
        <Alert variant='destructive'>
          <AlertDescription>Error loading courses. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!response?.data) return <EmptyState />;

  return (
    <ScrollArea className='h-full'>
      <div className='py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        <div className='text-center space-y-4 mb-16'>
          <h2 className='text-3xl font-bold font-manrope tracking-tight text-primary-900'>Community Courses</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {response.data.map((course: Course) => (
            <PublicCourseCard key={course.id} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default DefaultLayout(PublicCourses);
