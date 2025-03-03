import React, { useState, memo } from 'react';
import { deleteExercise, shareExercise } from 'wasp/client/operations';
import { Exercise } from '../../shared/types';
import { RiDeleteBin4Line } from 'react-icons/ri';
import ExerciseImg from '../static/exercise.png';
import ExerciseDoneImg from '../static/exercise_done.png';
import { PiCropThin } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import { Tooltip } from 'react-tooltip';
import ExerciseEditModal from './ExerciseEditModal';
import { LuShare } from "react-icons/lu";

// Memoized ShareMenu component
const ShareMenu = memo(({ isOpen, onClose, emailsInput, setEmailsInput, onShare }: {
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
  exercise: Exercise;
}> = memo(({ index, exercise }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [emailsInput, setEmailsInput] = useState('');

  const handleShare = async () => {
    const emails = emailsInput.split(',').map(email => email.trim()).filter(email => email !== '');
    if (emails.length > 0) {
      await shareExercise({ exerciseId: exercise.id, emails });
      setIsShareMenuOpen(false);
      setEmailsInput('');
    } else {
      alert('Please enter at least one email.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      deleteExercise({ id: exercise.id });
    }
  };

  return (
    <>
      {isModalOpen && (
        <ExerciseEditModal
          id={exercise.id}
          name={exercise.name}
          lessonText={exercise.lessonText}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      <ShareMenu 
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        emailsInput={emailsInput}
        setEmailsInput={setEmailsInput}
        onShare={handleShare}
      />

      <div className='relative flex flex-col items-center p-5 bg-white border border-primary-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer font-montserrat'>
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
        <div className='absolute top-3 right-3 flex gap-2 z-above'>
          <button
            className='text-lg text-secondary-400 hover:text-secondary-500 transition-colors duration-200'
            onClick={() => setIsShareMenuOpen(true)}
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
        <a href={`/exercise/${exercise.id}`} className='w-full group'>
          <div className='overflow-hidden rounded-md mb-4'>
            <img
              src={exercise.completed ? ExerciseDoneImg : ExerciseImg}
              className='w-full transition-transform duration-300 group-hover:scale-105'
              alt='Exercise'
            />
          </div>
          <h3 className='text-title-xsm font-manrope font-medium text-center text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2'>
            {exercise.name}
          </h3>
        </a>
        <div className='mt-2 text-sm font-satoshi font-medium text-primary-500'>{exercise.level}</div>
        <div className='mt-1 text-xs font-satoshi text-gray-500'>{exercise.no_words} words</div>
      </div>
    </>
  );
});

export default ExerciseCard;
