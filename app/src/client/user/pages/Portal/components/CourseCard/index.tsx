import { useState, useCallback, memo } from 'react';
import { Link } from 'wasp/client/router';
import { useAction, updateCourse, deleteCourse } from 'wasp/client/operations';
import { toast } from 'sonner';
import { cn } from '../../../../../../shared/utils';
import { VscDiffRemoved } from 'react-icons/vsc';
import { HiPencil } from 'react-icons/hi';
import EditCourseModal from './CourseEditModal';
import { COURSE_IMAGES } from '../../../../../../shared/constants';

import { Card, CardContent } from '../../../../../shadcn/components/ui/card';
import { Input } from '../../../../../shadcn/components/ui/input';
import { Progress } from '../../../../../shadcn/components/ui/progress';
import { Button } from '../../../../../shadcn/components/ui/button';

const CourseCard = memo(({ course }: { course: any }) => {
  const [is_edit_modal_open, setIsEditModalOpen] = useState(false);
  const update_course = useAction(updateCourse);
  const delete_course = useAction(deleteCourse);

  // Calculate course stats once
  const total_exercises = course.topics?.reduce((acc: number, topic: any) => acc + topic.exercises.length, 0) || 0;
  const completed_exercises = course.topics?.reduce((acc: number, topic: any) => acc + topic.exercises.filter((ex: any) => ex.completed).length, 0) || 0;
  const completion_percentage = Math.round(((completed_exercises ?? 0) / (total_exercises ?? 1)) * 100) || 0;

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toast('Are you sure you want to delete this course?', {
      action: {
        label: 'Delete',
        onClick: () => {
          toast.promise(delete_course({ id: course.id }), {
            loading: 'Deleting course...',
            success: 'Course deleted successfully',
            error: 'Failed to delete course',
          });
        },
      },
    });
  }, [course.id, delete_course]);

  const handleNameChange = useCallback((id: string, value: string) => {
    update_course({ id, name: value });
  }, [update_course]);

  const handleModalClose = useCallback(() => setIsEditModalOpen(false), []);
  const handleModalOpen = useCallback(() => setIsEditModalOpen(true), []);

  return (
    <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
      <Link to={`/course/${course.id}` as any}>
        <div
          className='relative h-52 w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105'
          style={{ 
            backgroundImage: course.image ? 
              `url(${course.image})` : 
              `url(${COURSE_IMAGES[Math.floor(Math.random() * COURSE_IMAGES.length)]})` 
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-primary-950/60 to-transparent' />
        </div>
      </Link>

      <CardContent className='p-6'>
        <Input
          type='text'
          className='w-full border-none bg-transparent px-0 font-manrope text-title-sm font-semibold text-primary-900 focus-visible:ring-0'
          value={course.name}
          onBlur={(e) => handleNameChange(course.id, e.target.value)}
          onChange={(e) => handleNameChange(course.id, e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        />

        <div className='mt-6 space-y-3'>
          <div className='flex justify-between'>
            <span className='font-satoshi text-sm text-primary-600'>
              {completed_exercises} / {total_exercises} exercises
            </span>
            <span className='font-satoshi text-sm font-medium text-primary-700'>{completion_percentage}%</span>
          </div>
          <Progress value={completion_percentage} className='h-2 bg-primary-100' />
        </div>
      </CardContent>

      <div className='absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <Button
          size='icon'
          variant='secondary'
          className='h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-primary-50'
          onClick={handleModalOpen}
        >
          <HiPencil className='h-4 w-4 text-primary-600' />
        </Button>
        <Button
          size='icon'
          variant='secondary'
          className='h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-danger/10'
          onClick={handleDelete}
        >
          <VscDiffRemoved className='h-4 w-4 text-danger' />
        </Button>
      </div>
      <EditCourseModal course={course} is_open={is_edit_modal_open} onClose={handleModalClose} />
    </Card>
  );
});

export default CourseCard;
