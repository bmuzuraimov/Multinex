import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { updateExercise } from 'wasp/client/operations';
import { Tooltip } from 'react-tooltip';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { useExerciseContext } from '../contexts/ExerciseContext';

interface ExerciseResultProps {
  exerciseId: string;
}

const ExerciseResult: React.FC<ExerciseResultProps> = ({
  exerciseId,
}) => {
  const { essay, errorIndices, setMode } = useExerciseContext();
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0); // To store the selected rating
  const [hoverRating, setHoverRating] = useState(0); // To store the hover state for rating stars
  const actualScore = 100 - Math.round((errorIndices.length / essay.split('').length) * 100);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setDisplayScore((prevScore) => {
        if (prevScore < actualScore) {
          return prevScore + 1;
        }
        clearInterval(scoreInterval);
        return prevScore;
      });
    }, 20);

    return () => {
      clearInterval(scoreInterval);
    };
  }, [actualScore]);

  const handleRating = async (rating: number) => {
    setSelectedRating(rating); // Set the selected rating
    await updateExercise({ id: exerciseId, updated_data: { userEvaluation: rating } });
  };

  return (
    <div className='relative flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
      <Confetti className='fixed inset-0' numberOfPieces={200} />
      <div className='relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center'>
      <HiOutlineInformationCircle
        className='absolute bottom-2 right-2 w-6 h-6'
        data-multiline
        data-tooltip-id='my-tooltip-1'
      />
      <Tooltip
        id={`my-tooltip-1`}
        place='left'
        className='z-99'
        content='By rating the exercise, you help us improve the quality of our prompts'
      />
        <h1 className='text-4xl text-gray-800 dark:text-gray-100 mb-4'>Congratulations!</h1>
        <p className='text-3xl text-gray-600 dark:text-gray-300 mb-6'>Thank you for submitting your exercise.</p>
        <p className='text-2xl text-gray-600 dark:text-gray-300 mb-6'>Total score: {displayScore} / 100</p>
        <div className='space-x-4'>
          <button
            onClick={() => setMode('test')}
            className='px-6 py-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform active:scale-95'
          >
            Test Your Knowledge
          </button>
          <a href='/portal'>
            <button className='px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform active:scale-95'>
              Portal
            </button>
          </a>
        </div>
        <div className='mt-6'></div>
        <p className='text-lg text-gray-600 dark:text-gray-300 mb-2'>Rate the exercise:</p>
        <div className='flex justify-center'>
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoverRating(star)} // Set hover rating
              onMouseLeave={() => setHoverRating(0)} // Reset hover rating on leave
              className={`w-8 h-8 cursor-pointer transition ${
                (hoverRating || selectedRating) >= star ? 'text-yellow-500' : 'text-gray-400'
              } hover:text-yellow-500`}
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z' />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseResult;
