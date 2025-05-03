import React, { useState, memo } from 'react';
import { useAction, deleteExercise, shareExercise } from 'wasp/client/operations';
import { toast } from 'sonner';
import ExerciseImg from '../../../static/exercise.png';
import ExerciseDoneImg from '../../../static/exercise_done.png';
import ExerciseEditModal from './ExerciseEditModal';

import { CardContent, CardHeader } from '../../../shadcn/components/ui/card';
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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../../../shadcn/components/ui/tooltip';
import { cn } from '../../../../shared/utils';

import { MoreVertical, Edit, Share, Trash2, Crop, CheckCircle, Tag } from 'lucide-react';

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

const ExerciseCard: React.FC<any> = memo(({ exercise, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [emailsInput, setEmailsInput] = useState('');
  const deleteExerciseAction = useAction(deleteExercise);
  const shareExerciseAction = useAction(shareExercise);

  // Check if the current user is the owner of the exercise
  const isOwner = user && exercise.user_id === user.id;

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

  // Get topic terms or an empty array if not available
  const topicTerms = exercise.modules?.topic_terms || [];

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

      <div className='relative bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 h-full'>
        {/* Status indicator */}
        {exercise.completed && (
          <div className='absolute top-0 right-0 w-0 h-0 border-t-[50px] border-t-primary-500 border-l-[50px] border-l-transparent z-10'></div>
        )}

        <CardHeader className='relative p-0'>
          {isOwner && (
            <div className='absolute top-3 right-3 z-20'>
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
          )}

          <a href={`/exercise/${exercise.id}`} className='block relative'>
            <div
              className={cn(
                'h-40 w-full bg-gradient-to-br flex items-center justify-center',
                exercise.completed ? 'from-primary-50 to-primary-100' : 'from-gray-50 to-gray-100'
              )}
            >
              <img
                src={exercise.completed ? ExerciseDoneImg : ExerciseImg}
                alt='Exercise'
                className='w-32 h-32 object-contain transition-transform duration-300 hover:scale-105'
              />
              {exercise.completed && (
                <div className='absolute bottom-4 right-4'>
                  <CheckCircle className='h-6 w-6 text-primary-500 fill-primary-50' />
                </div>
              )}
            </div>
          </a>
        </CardHeader>

        <CardContent className='p-4'>
          <a href={`/exercise/${exercise.id}`} className='block'>
            <h3 className='font-manrope text-title-xsm font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-2 min-h-[48px]'>
              {exercise.name}
            </h3>
          </a>

          {/* Level and topic terms section */}
          <div className='mt-3'>
            <div className='flex items-center mb-2 text-xs text-gray-600 font-satoshi'>
              <Tag className='h-3 w-3 mr-1' />
              <span>Topic Terms</span>
            </div>

            {topicTerms.length > 0 ? (
              <div className='flex flex-wrap gap-1.5'>
                {topicTerms.slice(0, 3).map((term: string, index: number) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='font-satoshi text-xs bg-gray-50 text-primary-700 border-primary-100 px-2 py-0.5 rounded-full'
                  >
                    {term}
                  </Badge>
                ))}
                {topicTerms.length > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant='outline'
                          className='font-satoshi text-xs bg-gray-50 text-primary-700 border-primary-100 px-2 py-0.5 rounded-full cursor-pointer'
                        >
                          +{topicTerms.length - 3}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className='max-w-[200px]'>
                          <p className='text-xs font-satoshi'>{topicTerms.slice(3).join(', ')}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ) : (
              <p className='text-xs text-gray-400 italic font-satoshi'>No topic terms available</p>
            )}
          </div>
        </CardContent>

        {exercise.truncated && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='absolute bottom-3 left-3'>
                  <Crop className='h-5 w-5 text-warning' />
                </div>
              </TooltipTrigger>
              <TooltipContent>The length of the uploaded file was too long and has been cropped.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </>
  );
});

export default ExerciseCard;
