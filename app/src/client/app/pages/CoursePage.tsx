import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  useQuery,
  getTopicsByCourse,
  getCourseById,
  createTopic,
  updateCourse,
  updateTopic,
  deleteTopic,
} from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { toast } from 'sonner';
import { cn } from '../../../shared/utils';
import DefaultLayout from '../layouts/DefaultLayout';

// Shadcn Components
import { Card, CardHeader } from '../../shadcn/components/ui/card';
import { Input } from '../../shadcn/components/ui/input';
import { Button } from '../../shadcn/components/ui/button';
import { ScrollArea } from '../../shadcn/components/ui/scroll-area';

// Icons
import { HiLockClosed, HiGlobeAlt } from 'react-icons/hi';
import { FiPlus } from 'react-icons/fi';

// Components
import UserTour from '../../components/UserTour';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseForm from '../../components/ExerciseForm';
import { RiDeleteBin4Line } from 'react-icons/ri';

const CoursePage = () => {
  const { id: course_id } = useParams<{ id: string }>();
  if (!course_id) return null;

  const { data: topics, refetch: refetch_topics } = useQuery(getTopicsByCourse, { course_id });
  const { data: course, refetch: refetch_course } = useQuery(getCourseById, { course_id });
  const [course_name, setCourseNameState] = useState('');
  const { data: user } = useAuth();

  useEffect(() => {
    if (course?.name) {
      setCourseNameState(course.name);
    }
  }, [course]);

  const handleUpdateCourse = useCallback(() => {
    if (course_id && course_name !== course?.name) {
      updateCourse({
        id: course_id,
        data: { name: course_name },
      });
      refetch_course();
      toast.success('Course name updated');
    }
  }, [course_id, course_name, course?.name]);

  const handlePublishCourse = useCallback(() => {
    if (course_id) {
      updateCourse({
        id: course_id,
        data: { is_public: !course?.is_public },
      });
      refetch_course();
      toast.success(course?.is_public ? 'Course set to private' : 'Course published');
    }
  }, [course_id, course?.is_public]);

  return (
    <div className='min-h-screen bg-primary-50/30'>
      <div className='mx-auto max-w-7xl px-6 py-12'>
        {/* Header Section */}
        <Card className='mb-8 border-none bg-white/50 backdrop-blur-sm'>
          <CardHeader className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Input
                type='text'
                value={course_name}
                onChange={(e) => setCourseNameState(e.target.value)}
                onBlur={handleUpdateCourse}
                className='text-2xl md:text-4xl font-manrope font-bold text-primary-900 border-none bg-transparent w-auto max-w-2xl'
                placeholder='Course Name'
              />
              <div className='flex gap-4'>
                <Button
                  variant='outline'
                  onClick={handlePublishCourse}
                  className={cn(
                    'gap-2 transition-all duration-300',
                    course?.is_public
                      ? 'text-tertiary-600 hover:text-tertiary-700'
                      : 'text-primary-600 hover:text-primary-700'
                  )}
                >
                  {course?.is_public ? (
                    <>
                      <HiGlobeAlt className='h-5 w-5' />
                      Public Course
                    </>
                  ) : (
                    <>
                      <HiLockClosed className='h-5 w-5' />
                      Private Course
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => createTopic({ name: 'New Section', course_id })}
                  className='tour-step-2 gap-2 bg-primary-500 hover:bg-primary-600 text-white'
                >
                  <FiPlus className='h-5 w-5' />
                  Add New Section
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Topics Section */}
        <ScrollArea className='h-full'>
          <div className='space-y-8'>{topics?.map((topic) => <TaskSection key={topic.id} topic={topic} />)}</div>
        </ScrollArea>
      </div>
      {user && <UserTour user_id={user.id} />}
    </div>
  );
};

const TaskSection: React.FC<{
  topic: {
    id: string;
    name: string;
    length: number;
    level: string;
    exercises: {
      id: string;
      status: string;
      name: string;
      level: string;
      lesson_text: string;
      truncated: boolean;
      word_count: number;
      completed: boolean;
      completed_at: Date | null;
    }[];
  };
}> = React.memo(({ topic }) => {
  const [topic_name, setTopicNameState] = useState(topic.name);
  const [topic_length, setTopicLengthState] = useState(topic.length);
  const [topic_level, setTopicLevelState] = useState(topic.level);
  const { data: user } = useAuth();

  const handleUpdateTopic = useCallback(() => {
    updateTopic({
      id: topic.id,
      data: {
        name: topic_name,
        length: topic_length,
        level: topic_level,
      },
    });
  }, [topic.id, topic_name, topic_length, topic_level]);

  const handleDeleteTopic = useCallback(() => {
    toast('Are you sure you want to delete this section?', {
      action: {
        label: 'Delete',
        onClick: () => {
          toast.promise(deleteTopic({ id: topic.id }), {
            loading: 'Deleting section...',
            success: 'Section deleted successfully',
            error: 'Failed to delete section',
          });
        },
      },
    });
  }, [topic.id]);

  useEffect(() => {
    setTopicNameState(topic.name);
    setTopicLengthState(topic.length);
    setTopicLevelState(topic.level);
  }, [topic]);

  return (
    <div className='tour-step-3 bg-white rounded-2xl shadow-lg hover:shadow-xl p-12 transition-all duration-300 border border-primary-100'>
      {user && <UserTour user_id={user.id} />}
      <div className='flex items-center mb-12 group relative'>
        <input
          type='text'
          value={topic_name}
          onChange={(e) => setTopicNameState(e.target.value)}
          onBlur={handleUpdateTopic}
          className='w-full text-title-lg font-manrope font-semibold bg-transparent border-0 border-b-2 border-primary-100 focus:border-primary-500 focus:ring-0 px-4 py-3 text-primary-900'
          placeholder='Section Name'
        />
        <button
          onClick={handleDeleteTopic}
          className='absolute right-4 p-3 text-primary-400 hover:text-danger transition-all duration-300 rounded-xl hover:bg-danger/5'
        >
          <RiDeleteBin4Line className='h-5 w-5' />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8'>
        <ExerciseForm topic_id={topic.id} demo={false} />
        {topic.exercises?.map((exercise, idx) => (
          <ExerciseCard key={exercise.id} index={idx} exercise={exercise as any} />
        ))}
      </div>
    </div>
  );
});

export default DefaultLayout(CoursePage);
