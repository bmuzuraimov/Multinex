import { Link } from 'react-router-dom';
import { useQuery, getAllCourses, updateCourse, deleteCourse, getExercisesWithNoTopic } from 'wasp/client/operations';
import { VscDiffRemoved } from 'react-icons/vsc';
import { useState, useEffect, useCallback, memo } from 'react';
import ExerciseForm from '../components/ExerciseForm';
import CourseForm from '../components/CourseForm';
import ExerciseCard from '../components/ExerciseCard';
import { Exercise } from '../../shared/types';
import FooterSection from '../components/LandingPage/FooterSection';
import { Dialog } from '@headlessui/react';
import { COURSE_IMAGES } from '../../shared/constants';
import { HiLockClosed, HiGlobeAlt } from 'react-icons/hi';

interface Course {
  id: string;
  name: string;
  description: string;
  image?: string;
  isPublic: boolean;
  totalExercises?: number;
  completedExercises?: number;
  createdAt: Date;
}

interface EditCourseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Course>) => void;
}

const EditCourseModal = ({ course, isOpen, onClose, onSave }: EditCourseModalProps) => {
  const [formData, setFormData] = useState({
    name: course.name,
    description: course.description,
    image: course.image || '',
    isPublic: course.isPublic
  });

  useEffect(() => {
    setFormData({
      name: course.name,
      description: course.description,
      image: course.image || '',
      isPublic: course.isPublic
    });
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(course.id, formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Edit Course
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Background Style
              </label>
              <div className="grid grid-cols-5 gap-3">
                {COURSE_IMAGES.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-20 rounded-lg transition-all ${image} ${formData.image === image ? 'ring-2 ring-teal-500 ring-offset-2' : 'hover:ring-2 hover:ring-teal-500/50 hover:ring-offset-2'}`}
                    onClick={() => setFormData(prev => ({ ...prev, image }))}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  formData.isPublic 
                    ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20' 
                    : 'border-teal-200 bg-teal-50 dark:border-teal-900 dark:bg-teal-900/20'
                }`}
              >
                {formData.isPublic ? (
                  <>
                    <HiGlobeAlt className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-400">Public</span>
                  </>
                ) : (
                  <>
                    <HiLockClosed className="h-5 w-5 text-teal-500" />
                    <span className="text-sm font-medium text-teal-700 dark:text-teal-400">Private</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const CourseCard = memo(({ course, onDelete, onUpdate, onNameChange }: {
  course: Course;
  onDelete: (id: string) => void;
  onUpdate: (id: string, value: string) => void;
  onNameChange: (id: string, value: string) => void;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(course.id);
  }, [course.id, onDelete]);

  const handleEditSave = useCallback((id: string, data: Partial<Course>) => {
    updateCourse({ id, data });
  }, []);

  const completionPercentage = Math.round(((course.completedExercises ?? 0) / (course.totalExercises ?? 1)) * 100) || 0;

  return (
    <>
      <div className='relative bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-102 border border-gray-100 dark:border-gray-700 overflow-hidden'>
        <Link to={'course-' + course.id}>
          <div className={`relative h-48 w-full ${course.image} bg-cover bg-center`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </Link>
        <div className='p-6 relative'>
          <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            <input
              type='text'
              className='w-full bg-transparent text-lg font-semibold text-gray-900 dark:text-gray-100 outline-none border-none hover:ring-2 hover:ring-blue-500/20 rounded-md px-2 py-1 transition-all duration-200'
              value={course.name}
              onChange={(e) => onNameChange(course.id, e.target.value)}
              onBlur={(e) => onUpdate(course.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            />
          </h4>
          <div className='mt-4'>
            <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1'>
              <span>{course.completedExercises} / {course.totalExercises} exercises</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
              <div 
                className='bg-blue-600 h-2.5 rounded-full transition-all duration-300'
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className='absolute top-3 right-3 flex gap-2'>
          <button
            className='p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors duration-200 backdrop-blur-sm'
            onClick={() => setIsEditModalOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className='p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 backdrop-blur-sm'
            onClick={handleDelete}
          >
            <VscDiffRemoved className="w-5 h-5" />
          </button>
        </div>
      </div>
      <EditCourseModal
        course={course}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </>
  );
});

CourseCard.displayName = 'CourseCard';

export default function PortalPage() {
  const { data: courses, error: coursesError, isLoading: coursesLoading, refetch: refetchCourses } = useQuery(getAllCourses);
  const { data: exercises, error: exercisesError, isLoading: exercisesLoading, refetch: refetchExercises } = useQuery(getExercisesWithNoTopic);
  const [localCourses, setLocalCourses] = useState<Course[]>([]);

  const handleDeleteCourse = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse({ id });
    }
  }, []);

  const handleUpdateCourse = useCallback((id: string, value: string) => {
    updateCourse({ id, data: { name: value } });
  }, []);

  const handleNameChange = useCallback((id: string, value: string) => {
    setLocalCourses(prevCourses => 
      prevCourses.map(c => c.id === id ? { ...c, name: value } : c)
    );
  }, []);

  useEffect(() => {
    if (courses) {
      setLocalCourses(courses.courses.map(c => ({ ...c, isPublic: false })));
    }
  }, [courses]);

  return (
    <div className='lg:mt-10 pb-10'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-title-xxl font-manrope tracking-tight text-black dark:text-white'>My Courses</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 shadow-card rounded-lg p-8 bg-white dark:bg-gray-800 dark:shadow-none dark:bg-gray-700'>
          <CourseForm />
          {localCourses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDeleteCourse}
              onUpdate={handleUpdateCourse}
              onNameChange={handleNameChange}
            />
          ))}
        </div>
      </div>
      <div className='mx-auto max-w-7xl px-6 lg:px-8 mt-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-title-xxl font-manrope tracking-tight text-black dark:text-white'>Unassigned Exercises</h2>
        </div>
        <div className='grid grid-cols-1 mb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 shadow-card rounded-lg p-8 bg-white dark:bg-gray-800 dark:shadow-none dark:bg-gray-700'>
          <ExerciseForm topicId={null}/>
          {exercises?.map((exercise: Exercise, index: number) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              index={index}
            />
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
