import { Link } from 'react-router-dom';
import { useQuery, getAllCourses, updateCourse, deleteCourse, getExercisesWithNoTopic } from 'wasp/client/operations';
import { VscDiffRemoved } from 'react-icons/vsc';
import { useState, useEffect, useCallback, memo } from 'react';
import ExerciseForm from '../components/ExerciseForm';
import CourseForm from '../components/CourseForm';
import ExerciseCard from '../components/ExerciseCard';
import { Exercise } from '../../shared/types';
import UserTour from '../components/UserTour';
import FooterSection from '../components/LandingPage/FooterSection';
import { Dialog } from '@headlessui/react';
import { COURSE_IMAGES } from '../../shared/constants';
import { HiLockClosed, HiGlobeAlt } from 'react-icons/hi';
import { useAuth } from 'wasp/client/auth';

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
    <Dialog open={isOpen} onClose={onClose} className="relative z-modal">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-2xl bg-white p-8 shadow-xl">
          <Dialog.Title className="text-title-lg font-manrope text-primary-900 mb-6">
            Edit Course
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-montserrat text-primary-800 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-xl border border-primary-100 bg-white px-4 py-3 text-primary-900 focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat text-primary-800 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-xl border border-primary-100 bg-white px-4 py-3 text-primary-900 focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition duration-200"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat text-primary-800 mb-2">
                Background Style
              </label>
              <div className="grid grid-cols-5 gap-4">
                {COURSE_IMAGES.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-24 rounded-xl transition-all duration-200 ${image} ${
                      formData.image === image 
                        ? 'ring-2 ring-primary-500 ring-offset-2' 
                        : 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-2'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, image }))}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition duration-200 ${
                  formData.isPublic 
                    ? 'border-tertiary-200 bg-tertiary-50 text-tertiary-700' 
                    : 'border-primary-200 bg-primary-50 text-primary-700'
                }`}
              >
                {formData.isPublic ? (
                  <>
                    <HiGlobeAlt className="h-5 w-5" />
                    <span className="font-satoshi">Public</span>
                  </>
                ) : (
                  <>
                    <HiLockClosed className="h-5 w-5" />
                    <span className="font-satoshi">Private</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-satoshi text-primary-700 hover:bg-primary-50 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-satoshi text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors duration-200"
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
      <div className='group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden'>
        <Link to={'/course/' + course.id}>
          <div className={`relative h-52 w-full ${course.image} bg-cover bg-center`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </Link>
        <div className='p-6'>
          <h4 className='text-title-sm font-manrope text-primary-900'>
            <input
              type='text'
              className='w-full bg-transparent outline-none ring-0 border-none rounded-lg py-2 transition-all duration-200'
              value={course.name}
              onChange={(e) => onNameChange(course.id, e.target.value)}
              onBlur={(e) => onUpdate(course.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            />
          </h4>
          <div className='mt-6'>
            <div className='flex justify-between text-sm font-satoshi text-primary-600 mb-2'>
              <span>{course.completedExercises} / {course.totalExercises} exercises</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className='w-full bg-primary-100 rounded-full h-2'>
              <div 
                className='bg-primary-500 h-2 rounded-full transition-all duration-300'
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className='absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <button
            className='p-2 rounded-xl bg-white/90 text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200 backdrop-blur-sm'
            onClick={() => setIsEditModalOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            className='p-2 rounded-xl bg-white/90 text-danger hover:bg-danger/10 transition-colors duration-200 backdrop-blur-sm'
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
  const { data: exercises } = useQuery(getExercisesWithNoTopic);
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const { data: user } = useAuth();

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
      setLocalCourses(courses.courses.map(c => ({ 
        ...c, 
        description: c.description || '', 
        isPublic: false 
      })));
    }
  }, [courses]);

  return (
    <div className='min-h-screen bg-white'>
      {user && <UserTour userId={user.id} />}
      <div className='tour-step-1 mx-auto max-w-7xl px-8 pt-16 pb-24'>
        <div className='mx-auto max-w-4xl text-center mb-16'>
          <h2 className='text-title-xl font-manrope text-primary-900'>My Courses</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
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
      <div className='mx-auto max-w-7xl px-8 pb-24'>
        <div className='mx-auto max-w-4xl text-center mb-16'>
          <h2 className='text-title-xl font-manrope text-primary-900'>Unassigned Exercises</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8'>
          <ExerciseForm topicId={null} demo={false} />
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
