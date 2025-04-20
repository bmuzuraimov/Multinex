import React, { useState, useEffect, memo } from 'react';
import { useAction, updateExercise } from 'wasp/client/operations';
import { cn } from '../../../../shared/utils';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shadcn/components/ui/dialog';
import { Button } from '../../../shadcn/components/ui/button';
import { Input } from '../../../shadcn/components/ui/input';
import { Textarea } from '../../../shadcn/components/ui/textarea';
import { Label } from '../../../shadcn/components/ui/label';
import { Card, CardContent } from '../../../shadcn/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ExerciseEditModalProps {
  id: string;
  name: string;
  lesson_text: string;
  onClose: () => void;
}

const ExerciseEditModal: React.FC<ExerciseEditModalProps> = memo(({ id, name, lesson_text, onClose }) => {
  const [exerciseName, setExerciseName] = useState(name);
  const [exerciseText, setExerciseText] = useState(lesson_text);
  const [loading, setLoading] = useState(false);
  const updateExerciseAction = useAction(updateExercise);

  useEffect(() => {
    setExerciseName(name);
    setExerciseText(lesson_text);
  }, [name, lesson_text]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast.promise(updateExerciseAction({ id, updated_data: { name: exerciseName, lesson_text: exerciseText } }), {
        loading: 'Updating exercise...',
        success: (res) => (res.success ? 'Exercise updated successfully' : res.message),
        error: 'Failed to update exercise',
      });
    } catch (err) {
      toast.error('Failed to update exercise');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = exerciseText.split(' ').length;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='font-manrope text-title-lg font-semibold text-gray-900'>Edit Exercise</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Card className='border-primary-100'>
            <CardContent className='pt-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='font-montserrat text-sm text-gray-700'>
                    Name
                  </Label>
                  <Input
                    id='name'
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className='font-satoshi border-gray-200 focus:border-primary-500 focus:ring-primary-500'
                  />
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <Label htmlFor='lessonText' className='font-montserrat text-sm text-gray-700'>
                      Lesson Text
                    </Label>
                    <span className='font-satoshi text-sm text-tertiary-400'>{wordCount} words</span>
                  </div>
                  <Textarea
                    id='lessonText'
                    value={exerciseText}
                    onChange={(e) => setExerciseText(e.target.value)}
                    className='min-h-[300px] font-satoshi border-gray-200 focus:border-primary-500 focus:ring-primary-500'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end'>
            <Button type='button' variant='outline' onClick={onClose} className='mr-2 font-satoshi'>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={loading}
              className={cn(
                'bg-primary-500 hover:bg-primary-600 text-white font-satoshi',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Updating...' : 'Update Exercise'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default ExerciseEditModal;
