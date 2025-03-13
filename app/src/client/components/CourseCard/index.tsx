import { useState, useCallback } from 'react';
import { Link } from 'wasp/client/router';
import { updateCourse, deleteCourse } from 'wasp/client/operations';
import { toast } from 'sonner';
import { cn } from '../../../shared/utils';
import { VscDiffRemoved } from 'react-icons/vsc';
import EditCourseModal from './CourseEditModal';
import { COURSE_IMAGES } from '../../../shared/constants';

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

export default function CourseCard({
  course,
}: {
  course: Course;
}) {
  const [is_edit_modal_open, setIsEditModalOpen] = useState(false);
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toast('Are you sure you want to delete this course?', {
        action: {
          label: 'Delete',
          onClick: () => {
            toast.promise(deleteCourse({ id: course.id }), {
              loading: 'Deleting course...',
              success: 'Course deleted successfully',
              error: 'Failed to delete course'
            });
          },
        },
      });
    },
    [course.id]
  );

  const handleNameChange = useCallback((id: string, value: string) => {
    toast.promise(updateCourse({ id, data: { name: value } }), {
      loading: 'Updating course...',
      success: 'Course updated successfully',
      error: 'Failed to update course'
    });
  }, []);

  const completion_percentage =
    Math.round(((course.completed_exercises ?? 0) / (course.total_exercises ?? 1)) * 100) || 0;

  return (
    <>
      <div className='group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden'>
        <Link to={`/course/${course.id}` as any}>
          <div
            className={cn('relative h-52 w-full bg-cover bg-center', course.image || COURSE_IMAGES[0])}
          >
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
          </div>
        </Link>
        <div className='p-6'>
          <h4 className='text-title-sm font-manrope text-primary-900'>
            <input
              type='text'
              className='w-full bg-transparent outline-none ring-0 border-none rounded-lg py-2 transition-all duration-200'
              value={course.name}
              onChange={(e) => handleNameChange(course.id, e.target.value)}
              onBlur={(e) => handleNameChange(course.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            />
          </h4>
          <div className='mt-6'>
            <div className='flex justify-between text-sm font-satoshi text-primary-600 mb-2'>
              <span>
                {course.completed_exercises} / {course.total_exercises} exercises
              </span>
              <span>{completion_percentage}%</span>
            </div>
            <div className='w-full bg-primary-100 rounded-full h-2'>
              <div
                className='bg-primary-500 h-2 rounded-full transition-all duration-300'
                style={{ width: `${completion_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className='absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <button
            className='p-2 rounded-xl bg-white/90 text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200 backdrop-blur-sm'
            onClick={() => setIsEditModalOpen(true)}
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
          </button>
          <button
            className='p-2 rounded-xl bg-white/90 text-danger hover:bg-danger/10 transition-colors duration-200 backdrop-blur-sm'
            onClick={handleDelete}
          >
            <VscDiffRemoved className='w-5 h-5' />
          </button>
        </div>
      </div>
      <EditCourseModal
        course={course}
        is_open={is_edit_modal_open}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
