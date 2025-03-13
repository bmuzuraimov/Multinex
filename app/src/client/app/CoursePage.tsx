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
import { IoAddOutline } from 'react-icons/io5';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { HiLockClosed, HiGlobeAlt } from 'react-icons/hi';
import UserTour from '../components/UserTour';
import { useAuth } from 'wasp/client/auth';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseForm from '../components/ExerciseForm';
import { toast } from 'sonner';

export default function CoursePage() {
  const { id: course_id } = useParams<{ id: string }>();
  if (!course_id) return null;

  const { data: topics, refetch: refetch_topics } = useQuery(getTopicsByCourse, { course_id });
  const { data: course, refetch: refetch_course } = useQuery(getCourseById, { course_id });
  const [course_name, setCourseNameState] = useState('');

  useEffect(() => {
    if (course?.name) {
      setCourseNameState(course.name);
    }
  }, [course]);

  const handleUpdateCourse = useCallback(() => {
    if (course_id && course_name !== course?.name) {
      updateCourse({
        id: course_id,
        data: {
          name: course_name,
        },
      });
      refetch_course();
    }
  }, [course_id, course_name, course?.name]);

  const handlePublishCourse = useCallback(() => {
    if (course_id) {
      updateCourse({
        id: course_id,
        data: {
          is_public: !course?.is_public,
        },
      });
      refetch_course();
    }
  }, [course_id, course?.is_public]);

  return (
    <div className='min-h-screen bg-white font-montserrat'>
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='relative mb-8'>
          <div className='relative flex justify-center'>
            <input
              type='text'
              value={course_name}
              onChange={(e) => setCourseNameState(e.target.value)}
              onBlur={handleUpdateCourse}
              className='px-8 bg-white text-title-xl font-manrope font-bold text-primary-900 text-center border-0 focus:ring-2 focus:ring-primary-200 rounded-xl transition-all duration-300'
              placeholder='Course Name'
            />
          </div>
        </div>

        <div className='flex justify-end gap-6 mb-12'>
          <button
            onClick={handlePublishCourse}
            className='flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 hover:shadow-md'
          >
            {course?.is_public ? (
              <>
                <HiGlobeAlt className='h-5 w-5 text-tertiary-500 transition-transform duration-300' />
                <span className='text-sm font-medium text-tertiary-600'>Public Course</span>
              </>
            ) : (
              <>
                <HiLockClosed className='h-5 w-5 text-primary-500 transition-transform duration-300' />
                <span className='text-sm font-medium text-primary-600'>Private Course</span>
              </>
            )}
          </button>
          <button
            onClick={() => createTopic({ name: 'New Section', course_id })}
            className='tour-step-2 group inline-flex items-center px-8 py-3 text-sm font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-300'
          >
            <IoAddOutline className='mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90' />
            Add New Section
          </button>
        </div>

        <div className='space-y-16'>{topics?.map((topic) => <TaskSection key={topic.id} topic={topic} />)}</div>
      </div>
    </div>
  );
}

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
      score: number;
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
            error: 'Failed to delete section'
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
