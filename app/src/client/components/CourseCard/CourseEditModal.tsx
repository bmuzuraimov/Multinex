import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { HiGlobeAlt, HiLockClosed } from 'react-icons/hi';
import { COURSE_IMAGES } from '../../../shared/constants';
import { cn } from '../../../shared/utils';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../shadcn/components/ui/dialog';
import { Button } from '../../shadcn/components/ui/button';
import { Input } from '../../shadcn/components/ui/input';
import { Textarea } from '../../shadcn/components/ui/textarea';
import { Label } from '../../shadcn/components/ui/label';
import { ScrollArea } from '../../shadcn/components/ui/scroll-area';
import { Card } from '../../shadcn/components/ui/card';
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCourse({
        id: course.id,
        data: form_data,
      });
      toast.success('Course updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update course');
    }
  }, [course.id, form_data, onClose]);

  return (
    <Dialog open={is_open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary-900 font-montserrat">
            Edit Course
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-montserrat text-primary-800">
                Course Name
              </Label>
              <Input
                id="name"
                value={form_data.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2"
                placeholder="Enter course name"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-montserrat text-primary-800">
                Description
              </Label>
              <Textarea
                id="description"
                value={form_data.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-2 min-h-[120px]"
                placeholder="Enter course description"
              />
            </div>

            <div>
              <Label className="text-sm font-montserrat text-primary-800 mb-2">
                Course Image
              </Label>
              <ScrollArea className="h-72 rounded-md border border-primary-100">
                <div className="grid grid-cols-3 gap-4 p-4">
                  {COURSE_IMAGES.map((image, index) => (
                    <Card
                    key={index}
                    className={cn(
                      'h-24 rounded-xl transition-all duration-200',
                      image,
                      form_data.image === image
                        ? 'ring-2 ring-primary-500 ring-offset-2'
                        : 'hover:ring-2 hover:ring-primary-300 hover:ring-offset-2'
                    )}
                    onClick={() => setFormData((prev) => ({ ...prev, image }))}
                  >
                    </Card>
                  ))}
                </div>
              </ScrollArea>
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
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-primary-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
