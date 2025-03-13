import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { COURSE_IMAGES } from '../../../shared/constants';
import { cn } from '../../../shared/utils';
import { HiGlobeAlt, HiLockClosed } from 'react-icons/hi';
import { toast } from 'sonner';
import { updateCourse } from 'wasp/client/operations';

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

interface CourseEditModalProps {
  course: Course;
  is_open: boolean;
  onClose: () => void;
}

export default function CourseEditModal({ course, is_open, onClose }: CourseEditModalProps) {
  const [form_data, setFormData] = useState({
    name: course.name,
    description: course.description,
    image: course.image || '',
    is_public: course.is_public,
  });

  const handleEditSave = useCallback(async (id: string, data: Partial<Course>) => {
    const result = await updateCourse({ id, data });
    if (result.success) {
      toast.success('Course updated successfully');
    } else {
      toast.error('Failed to update course');
    }
  }, []);

  useEffect(() => {
    setFormData({
      name: course.name,
      description: course.description,
      image: course.image || '',
      is_public: course.is_public,
    });
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEditSave(course.id, form_data);
    onClose();
  };

  return (
    <Dialog open={is_open} onClose={onClose} className='relative z-modal'>
      <div className='fixed inset-0 bg-black/20 backdrop-blur-sm' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-4xl w-full rounded-2xl bg-white p-8 shadow-xl'>
          <Dialog.Title className='text-title-lg font-manrope text-primary-900 mb-6'>Edit Course</Dialog.Title>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-montserrat text-primary-800 mb-2'>Name</label>
              <input
                type='text'
                value={form_data.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className='w-full rounded-xl border border-primary-100 bg-white px-4 py-3 text-primary-900 focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition duration-200'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-montserrat text-primary-800 mb-2'>Description</label>
              <textarea
                value={form_data.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className='w-full rounded-xl border border-primary-100 bg-white px-4 py-3 text-primary-900 focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition duration-200'
                rows={3}
                required
              />
            </div>
            <div>
              <label className='block text-sm font-montserrat text-primary-800 mb-2'>Background Style</label>
              <div className='grid grid-cols-5 gap-4'>
                {COURSE_IMAGES.map((image, index) => (
                  <button
                    key={index}
                    type='button'
                    className={cn(
                      'h-24 rounded-xl transition-all duration-200',
                      image,
                      form_data.image === image
                        ? 'ring-2 ring-primary-500 ring-offset-2'
                        : 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-2'
                    )}
                    onClick={() => setFormData((prev) => ({ ...prev, image }))}
                  />
                ))}
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => setFormData((prev) => ({ ...prev, is_public: !prev.is_public }))}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl border transition duration-200',
                  form_data.is_public
                    ? 'border-tertiary-200 bg-tertiary-50 text-tertiary-700'
                    : 'border-primary-200 bg-primary-50 text-primary-700'
                )}
              >
                {form_data.is_public ? (
                  <>
                    <HiGlobeAlt className='h-5 w-5' />
                    <span className='font-satoshi'>Public</span>
                  </>
                ) : (
                  <>
                    <HiLockClosed className='h-5 w-5' />
                    <span className='font-satoshi'>Private</span>
                  </>
                )}
              </button>
            </div>
            <div className='flex justify-end gap-4 mt-8'>
              <button
                type='button'
                onClick={onClose}
                className='px-6 py-3 text-sm font-satoshi text-primary-700 hover:bg-primary-50 rounded-xl transition-colors duration-200'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-6 py-3 text-sm font-satoshi text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors duration-200'
              >
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
