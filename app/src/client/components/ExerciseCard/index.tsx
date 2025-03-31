import React, { useState, memo } from 'react';
import { deleteExercise, shareExercise } from 'wasp/client/operations';
import { RiDeleteBin4Line } from 'react-icons/ri';
import ExerciseImg from '../../static/exercise.png';
import ExerciseDoneImg from '../../static/exercise_done.png';
import { PiCropThin } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import { Tooltip } from 'react-tooltip';
import ExerciseEditModal from './ExerciseEditModal';
import { LuShare } from "react-icons/lu";
import { toast } from 'sonner';
import { getAllUsers } from 'wasp/client/operations'; // Import the getAllUsers operation
import { BiLock, BiWorld, BiBarChart } from 'react-icons/bi';
import ExerciseAnalyticsModal from './ExerciseAnalyticsModal';

// ShareMenu with suggestions, access, and role dropdowns
const ShareMenu = memo(({
  isOpen,
  onClose,
  emailsInput,
  setEmailsInput,
  onShare,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  emailsInput: string;
  setEmailsInput: (value: string) => void;
  onShare: () => void;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-modal">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg font-montserrat">
        <h2 className="text-title-sm font-manrope font-semibold mb-4 text-gray-900">Share Exercise</h2>
        <input
          type="text"
          placeholder="Enter emails separated by commas"
          value={emailsInput}
          onChange={(e) => setEmailsInput(e.target.value)}
          className="w-full p-3 border border-primary-200 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-all duration-200 font-satoshi"
        />
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 font-satoshi"
          >
            Cancel
          </button>
          <button
            onClick={onShare}
            className="px-4 py-2 rounded-md text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-200 font-satoshi"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
});

// Memoized ExerciseCard component
const ExerciseCard: React.FC<{
  index: number;
  exercise: {
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
    duplicate_id: string | null;
  };
}> = memo(({ index, exercise }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [emailsInput, setEmailsInput] = useState('');

  const handleShare = async () => {
    if (exercise.duplicate_id) {
      toast.error('Shared exercises cannot be reshared.');
      return;
    }
    
    const emails = emailsInput.split(',').map(email => email.trim()).filter(email => email !== '');
    if (emails.length > 0) {
      await shareExercise({ exercise_id: exercise.id, emails });
      setIsShareMenuOpen(false);
      setEmailsInput('');
    } else {
      toast.error('Please enter at least one email.');
    }
  };

  const handleDelete = async () => {
    toast('Are you sure you want to delete this exercise?', {
      action: {
        label: 'Delete',
        onClick: () => {
          toast.promise(deleteExercise({ id: exercise.id }), {
            loading: 'Deleting exercise...',
            success: 'Exercise deleted successfully',
            error: 'Failed to delete exercise'
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
      
      <ShareMenu 
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        emailsInput={emailsInput}
        setEmailsInput={setEmailsInput}
        onShare={handleShare}
        users={users}
      />

      {isAnalyticsModalOpen && (
        <ExerciseAnalyticsModal
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          onClose={() => setIsAnalyticsModalOpen(false)}
        />
      )}

      <div className="relative flex flex-col items-center p-5 bg-white border border-primary-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer font-montserrat">
        {exercise.truncated && (
          <>
            <PiCropThin
              className='absolute bottom-3 left-3 z-above text-xl text-primary-900'
              data-multiline
              data-tooltip-id={`cropped-tooltip-${index || 'all'}`}
            />
            <Tooltip
              id={`cropped-tooltip-${index || 'all'}`}
              place='bottom'
              className='z-tooltip font-satoshi'
              content='The length of the uploaded file was too long and has been cropped.'
            />
          </>
        )}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {!exercise.duplicate_id && (
            <button 
              onClick={() => setIsAnalyticsModalOpen(true)} 
              className="text-lg text-primary-400 hover:text-primary-500"
              data-tooltip-id={`analytics-tooltip-${index}`}
            >
              <BiBarChart />
            </button>
          )}
          <button 
            onClick={() => setIsShareMenuOpen(true)} 
            className={`text-lg ${exercise.duplicate_id ? 'text-gray-400 cursor-not-allowed' : 'text-secondary-400 hover:text-secondary-500'}`}
            disabled={!!exercise.duplicate_id}
            data-tooltip-id={`share-tooltip-${index}`}
          >
            <LuShare />
          </button>
          <button
            className='text-lg text-primary-400 hover:text-primary-500 transition-colors duration-200'
            onClick={() => setIsModalOpen(true)}
          >
            <CiEdit />
          </button>
          <button
            className='text-lg text-danger hover:text-red-600 transition-colors duration-200'
            onClick={handleDelete}
          >
            <RiDeleteBin4Line />
          </button>
        </div>
        
        <Tooltip id={`analytics-tooltip-${index}`} place="top" content="View exercise analytics" />
        <Tooltip 
          id={`share-tooltip-${index}`} 
          place="top" 
          content={exercise.duplicate_id ? "Shared exercises cannot be reshared" : "Share exercise"} 
        />
        
        <a href={`/exercise/${exercise.id}`} className="w-full group">
          <div className="overflow-hidden rounded-md mb-4">
            <img
              src={exercise.completed ? ExerciseDoneImg : ExerciseImg}
              className='w-full p-4 transition-transform duration-300 group-hover:scale-105'
              alt='Exercise'
            />
          </div>
          <h3 className='text-title-xsm font-manrope font-medium text-center text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2'>
            {exercise.name}
          </h3>
        </a>
        <div className='mt-2 text-sm font-satoshi font-medium text-primary-500'>{exercise.level}</div>
        <div className='mt-1 text-xs font-satoshi text-gray-500'>{exercise.word_count} words</div>
      </div>
    </>
  );
});

export default ExerciseCard;
