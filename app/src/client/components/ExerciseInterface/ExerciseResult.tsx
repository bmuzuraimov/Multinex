import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { updateExercise } from 'wasp/client/operations';
import { Tooltip } from 'react-tooltip';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { useExerciseContext } from '../../contexts/ExerciseContext';
import { cn } from '../../../shared/utils';
interface ExerciseResultProps {
  exerciseId: string;
}

const ExerciseResult: React.FC<ExerciseResultProps> = ({ exerciseId }) => {
  const { set_mode, has_quiz } = useExerciseContext() || {};
  const [selected_rating, setSelected_rating] = useState(0);
  const [hover_rating, setHover_rating] = useState(0);

  const handleRating = async (rating: number) => {
    setSelected_rating(rating);
    await updateExercise({ id: exerciseId, updated_data: { user_evaluation: rating } });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <Confetti className='fixed inset-0' numberOfPieces={200} />
      <div className='relative max-w-2xl w-full mx-auto bg-white p-12 rounded-2xl shadow-lg border border-primary-100'>
        <HiOutlineInformationCircle
          className='absolute top-6 right-6 w-6 h-6 text-tertiary-400 hover:text-tertiary-500 transition-colors duration-200'
          data-multiline
          data-tooltip-id='rating-tooltip'
        />
        <Tooltip
          id='rating-tooltip'
          place='left'
          className='z-tooltip font-satoshi'
          content='By rating the exercise, you help us improve the quality of our prompts'
        />

        <div className='space-y-8 text-center'>
          <div className='space-y-2'>
            <h1 className='font-manrope text-title-lg font-semibold text-primary-900'>Congratulations!</h1>
            <p className='font-montserrat text-title-sm text-primary-600'>Thank you for submitting your exercise</p>
          </div>

          <div className='space-y-6'>
            <div className='flex justify-center gap-4'>
              {has_quiz && (
                <button
                  onClick={() => set_mode?.('test')}
                  className='px-8 py-3 bg-primary-500 text-white rounded-xl font-satoshi font-medium shadow-md hover:bg-primary-600 active:bg-primary-700 transform active:scale-[0.98] transition-all duration-200'
                >
                  Test Your Knowledge
                </button>
              )}
              <a href='/portal'>
                <button className='px-8 py-3 bg-white text-primary-500 border-2 border-primary-500 rounded-xl font-satoshi font-medium hover:bg-primary-50 active:bg-primary-100 transform active:scale-[0.98] transition-all duration-200'>
                  Portal
                </button>
              </a>
            </div>

            <div className='space-y-3'>
              <p className='font-montserrat text-sm text-primary-600'>Rate the exercise:</p>
              <div className='flex justify-center gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover_rating(star)}
                    onMouseLeave={() => setHover_rating(0)}
                    className={cn(
                      'w-8 h-8 cursor-pointer transition-colors duration-200',
                      (hover_rating || selected_rating) >= star ? 'text-tertiary-400' : 'text-primary-100',
                      'hover:text-tertiary-500'
                    )}
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
        </div>
      </div>
    </div>
  );
};

export default ExerciseResult;
