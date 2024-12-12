import React, { useState, useEffect } from 'react';
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
import { ExerciseSectionProps } from '../../shared/types';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseForm from '../components/ExerciseForm';

export default function CoursePage() {
  const { id: courseId } = useParams<{ id: string }>();
  const { data: topics } = useQuery(getTopicsByCourse, { courseId });
  const { data: course } = useQuery(getCourseById, { courseId });
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (course?.name) {
      setCourseName(course.name);
    }
  }, [course]);

  const handleUpdateCourse = () => {
    if (courseId && courseName !== course?.name) {
      updateCourse({
        id: courseId,
        data: {
          name: courseName,
        },
      });
    }
  };

  const handlePublishCourse = () => {
    if (courseId) {
      updateCourse({
        id: courseId,
        data: {
          isPublic: !course?.isPublic,
        },
      });
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
        <div className='relative mb-16'>
          <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-200 dark:border-gray-700'></div>
          </div>
          <div className='relative flex justify-center'>
            <input
              type='text'
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              onBlur={handleUpdateCourse}
              className='px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white text-center border-0 focus:ring-0 focus:border-teal-500'
              placeholder='Course Name'
            />
          </div>
        </div>

        <div className='flex justify-end gap-4 mb-8'>
          <button
            onClick={handlePublishCourse}
            className='flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200'
          >
            {course?.isPublic ? (
              <HiGlobeAlt className='h-6 w-6 text-red-500 hover:text-red-600 transition-colors' />
            ) : (
              <HiLockClosed className='h-6 w-6 text-teal-500 hover:text-teal-600 transition-colors' />
            )}
            <span className='text-sm text-gray-600 dark:text-gray-300'>{course?.isPublic ? 'Public' : 'Private'}</span>
          </button>
          <button
            onClick={() => createTopic({ name: 'New Section', courseId })}
            className='group relative inline-flex items-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300'
          >
            <IoAddOutline className='mr-2 h-5 w-5 transition-all duration-300 group-hover:rotate-90' />
            <span className='relative'>
              <span className='relative z-10'>Add Section</span>
            </span>
          </button>
        </div>

        <div className='space-y-12'>{topics?.map((topic) => <TaskSection key={topic.id} topic={topic} />)}</div>
      </div>
    </div>
  );
}

const TaskSection: React.FC<ExerciseSectionProps> = ({ topic }) => {
  const [topicName, setTopicName] = useState(topic.name);
  const [topicLength, setTopicLength] = useState(topic.length);
  const [topicLevel, setTopicLevel] = useState(topic.level);

  const handleUpdateTopic = () => {
    updateTopic({
      id: topic.id,
      data: {
        name: topicName,
        length: topicLength,
        level: topicLevel,
      },
    });
  };

  useEffect(() => {
    setTopicName(topic.name);
    setTopicLength(topic.length);
    setTopicLevel(topic.level);
  }, [topic]);

  return (
    <div className='backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl p-10 transition-all duration-300 hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative'>
      <div className='flex items-center mb-10 group'>
        <input
          type='text'
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          onBlur={handleUpdateTopic}
          className='w-full text-3xl font-medium bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 px-4 py-2 transition-all duration-200 text-gray-800 dark:text-white tracking-wide'
          placeholder='Section Name'
        />
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this section?')) {
              deleteTopic({ id: topic.id });
            }
          }}
          className='absolute right-0 p-3 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all duration-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105'
        >
          <RiDeleteBin4Line className='h-6 w-6' />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 relative'>
        <ExerciseForm topicId={topic.id} />
        {topic.exercises?.map((exercise, idx) => <ExerciseCard key={exercise.id} index={idx} exercise={exercise} />)}
      </div>
    </div>
  );
};
