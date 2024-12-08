import React, { useState } from 'react';
import { deleteExercise, shareExercise } from 'wasp/client/operations';
import { ExerciseItemProps } from '../../shared/types';
import { RiDeleteBin4Line } from 'react-icons/ri';
import ExerciseImg from '../static/exercise.png';
import ExerciseDoneImg from '../static/exercise_done.png';
import { PiCropThin } from 'react-icons/pi';
import { CiEdit } from 'react-icons/ci';
import { Tooltip } from 'react-tooltip';
import ExerciseEditModal from './ExerciseEditModal';
import { LuShare } from "react-icons/lu";

const ExerciseCard: React.FC<ExerciseItemProps> = ({ index, exercise }) => {
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
      {isShareMenuOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white w-full max-w-xl dark:bg-gray-800 p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Share Exercise</h2>
            <input
              type="text"
              placeholder="Enter emails separated by commas"
              value={emailsInput}
              onChange={(e) => setEmailsInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsShareMenuOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="bg-teal-500 text-white px-4 py-2 rounded"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='relative flex flex-col items-center p-3 bg-white dark:bg-gray-700 border dark:border-gray-700 rounded shadow-md cursor-pointer'>
        {exercise.truncated && (
          <>
            <PiCropThin
              className='absolute bottom-2 left-2 z-10 text-xl text-black dark:text-white font-bold'
              data-multiline
              data-tooltip-id={`cropped-tooltip-${index || 'all'}`}
            />
            <Tooltip
              id={`cropped-tooltip-${index || 'all'}`}
              place='bottom'
              className='z-99'
              content='The length of the uploaded file was too long and has been cropped.'
            />
          </>
        )}
        <button
          className='absolute top-1 right-1 z-10 text-lg text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-200'
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this exercise?')) {
              deleteExercise({ id: exercise.id });
            }
          }}
        >
          <RiDeleteBin4Line />
        </button>
        <button
          className='absolute top-1 right-8 z-10 text-lg text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200'
          onClick={() => setIsModalOpen(true)}
        >
          <CiEdit />
        </button>
        <button
          className='absolute top-1 right-16 z-10 text-lg text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200'
          onClick={() => setIsShareMenuOpen(true)}
        >
          <LuShare />
        </button>
        <div className='absolute top-2 left-2 z-10 text-2xl font-semibold text-gray-700 dark:text-gray-200'>{index + 1}</div>
        <a href={`/exercise-${exercise.id}`} className='w-full group'>
          <img
            src={exercise.completed ? ExerciseDoneImg : ExerciseImg}
            className='border-b border-grey-200 dark:border-gray-600 transition-transform duration-200 group-hover:scale-105'
            alt='Exercise'
          />
          <div className='mt-3 text-lg font-medium text-center text-gray-800 dark:text-gray-100 break-words hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2'>
            {exercise.name}
          </div>
        </a>
        <div className='mt-1 text-md font-medium text-center text-blue-500 dark:text-blue-400'>{exercise.level}</div>
        <div className='mt-1 text-sm font-light text-gray-500 dark:text-gray-400'>{exercise.no_words} words</div>
      </div>
      </>
  );
};

export default ExerciseCard;
