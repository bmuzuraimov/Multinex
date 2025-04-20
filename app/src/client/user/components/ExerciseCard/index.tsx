import React, { useState, memo } from 'react';
import { useAction, deleteExercise, shareExercise } from 'wasp/client/operations';
import { toast } from 'sonner';
import ExerciseImg from '../../../static/exercise.png';
import ExerciseDoneImg from '../../../static/exercise_done.png';
import ExerciseEditModal from './ExerciseEditModal';

import { CardContent, CardHeader, CardFooter } from '../../../shadcn/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shadcn/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../shadcn/components/ui/dialog';
import { Button } from '../../../shadcn/components/ui/button';
import { Input } from '../../../shadcn/components/ui/input';
import { Badge } from '../../../shadcn/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../shadcn/components/ui/tooltip';

import { MoreVertical, Edit, Share, Trash2, Crop } from 'lucide-react';

const ShareDialog = memo(
  ({
    isOpen,
    onClose,
    emailsInput,
    setEmailsInput,
    onShare,
  }: {
    isOpen: boolean;
    onClose: () => void;
    emailsInput: string;
    setEmailsInput: (value: string) => void;
    onShare: () => void;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='font-manrope text-title-sm font-semibold text-gray-900'>Share Exercise</DialogTitle>
        </DialogHeader>
        <Input
          placeholder='Enter emails separated by commas'
          value={emailsInput}
          onChange={(e) => setEmailsInput(e.target.value)}
          className='font-satoshi'
        />
        <DialogFooter>
          <Button variant='outline' onClick={onClose} className='font-satoshi'>
            Cancel
          </Button>
          <Button onClick={onShare} className='bg-primary-500 hover:bg-primary-600 font-satoshi'>
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
);

const ExerciseCard: React.FC<any> = memo(({ exercise }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [emailsInput, setEmailsInput] = useState('');
  const deleteExerciseAction = useAction(deleteExercise);
  const shareExerciseAction = useAction(shareExercise);

  const handleShare = async () => {
    const emails = emailsInput
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '');
    if (emails.length > 0) {
      await shareExerciseAction({ exercise_id: exercise.id, emails });
      setIsShareMenuOpen(false);
      setEmailsInput('');
      toast.success('Exercise shared successfully');
    } else {
      toast.error('Please enter at least one email');
    }
  };

  const handleDelete = () => {
    toast('Are you sure you want to delete this exercise?', {
      action: {
        label: 'Delete',
        onClick: () => {
          toast.promise(deleteExerciseAction({ id: exercise.id }), {
            loading: 'Deleting exercise...',
            success: 'Exercise deleted successfully',
            error: 'Failed to delete exercise',
          });
        },
      },
    });
  };

  return (
    <>
      {isModalOpen && (
        <ExerciseEditModal
          id={exercise.id}
          name={exercise.name}
          lesson_text={exercise.lesson_text}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ShareDialog
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        emailsInput={emailsInput}
        setEmailsInput={setEmailsInput}
        onShare={handleShare}
      />

      <div className='group relative hover:shadow-lg transition-all duration-300'>
        <CardHeader className='relative p-0'>
          <div className='absolute top-3 right-3 z-10'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='hover:bg-white/10'>
                  <MoreVertical className='h-5 w-5 text-gray-600' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setIsShareMenuOpen(true)}>
                  <Share className='mr-2 h-4 w-4' />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className='text-danger'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <a href={`/exercise/${exercise.id}`} className='block'>
            <img
              src={exercise.completed ? ExerciseDoneImg : ExerciseImg}
              alt='Exercise'
              className='w-full p-4 transition-transform duration-300 group-hover:scale-105'
            />
          </a>
        </CardHeader>

        <CardContent className='p-4'>
          <a href={`/exercise/${exercise.id}`} className='block'>
            <h3 className='font-manrope text-title-xsm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2 min-h-[48px]'>
              {exercise.name}
            </h3>
          </a>
        </CardContent>

        <CardFooter className='p-4 pt-0 flex items-center justify-between'>
          <Badge variant='secondary' className='font-satoshi bg-primary-50 text-primary-700'>
            {exercise.level}
          </Badge>
          <span className='text-xs font-satoshi text-gray-500'>{exercise.word_count} words</span>
        </CardFooter>

        {exercise.truncated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='absolute bottom-3 left-3'>
                <Crop className='h-5 w-5 text-primary-900' />
              </div>
            </TooltipTrigger>
            <TooltipContent>The length of the uploaded file was too long and has been cropped.</TooltipContent>
          </Tooltip>
        )}
      </div>
    </>
  );
});

export default ExerciseCard;
