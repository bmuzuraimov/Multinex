import React from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import ComparisonSection from './components/ComparisonSection';

const SolutionsTeachers = () => {
  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-indigo-700 mb-4'>Multinex for Educators</h1>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Transform how your students learn with bite-sized, interactive exercises that combat the modern attention
          crisis.
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-12 mb-16'>
        <div className='bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>The Traditional Approach</h2>
          <div className='space-y-4'>
            <div className='flex items-start'>
              <div className='bg-red-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <p className='text-gray-600'>Large assignments completed right before deadlines</p>
            </div>
            <div className='flex items-start'>
              <div className='bg-red-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <p className='text-gray-600'>Students increasingly using AI to complete work without learning</p>
            </div>
            <div className='flex items-start'>
              <div className='bg-red-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <p className='text-gray-600'>Passive reading of PDF lecture notes with minimal retention</p>
            </div>
            <div className='flex items-start'>
              <div className='bg-red-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
              <p className='text-gray-600'>Information overload leading to shallow understanding</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-500'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>The Multinex Approach</h2>
          <div className='space-y-4'>
            <div className='flex items-start'>
              <div className='bg-green-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <p className='text-gray-600'>Bite-sized exercises after each class for immediate reinforcement</p>
            </div>
            <div className='flex items-start'>
              <div className='bg-green-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <p className='text-gray-600'>Interactive learning that maintains student engagement</p>
            </div>
            <div className='flex items-start'>
              <div className='bg-green-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <p className='text-gray-600'>Frequent small assessments that build lasting knowledge</p>
            </div>
            <div className='flex items-start'>
              <div className='bg-green-100 p-2 rounded-full mr-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-green-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <p className='text-gray-600'>Designed for modern attention spans and learning preferences</p>
            </div>
          </div>
        </div>
      </div>
      <ComparisonSection />

      <div className='bg-indigo-50 rounded-xl p-8 mb-16'>
        <h2 className='text-2xl font-bold text-indigo-700 mb-6 text-center'>How Multinex Works</h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-white rounded-lg p-6 shadow-md'>
            <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
              <span className='text-xl font-bold text-indigo-700'>1</span>
            </div>
            <h3 className='text-xl font-semibold text-center mb-2'>Create</h3>
            <p className='text-gray-600 text-center'>
              Quickly develop focused exercises that reinforce concepts from your latest class session
            </p>
          </div>

          <div className='bg-white rounded-lg p-6 shadow-md'>
            <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
              <span className='text-xl font-bold text-indigo-700'>2</span>
            </div>
            <h3 className='text-xl font-semibold text-center mb-2'>Assign</h3>
            <p className='text-gray-600 text-center'>
              Distribute exercises to your students for immediate practice while concepts are fresh
            </p>
          </div>

          <div className='bg-white rounded-lg p-6 shadow-md'>
            <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
              <span className='text-xl font-bold text-indigo-700'>3</span>
            </div>
            <h3 className='text-xl font-semibold text-center mb-2'>Analyze</h3>
            <p className='text-gray-600 text-center'>
              Track student progress and identify knowledge gaps to inform your teaching
            </p>
          </div>
        </div>
      </div>

      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-center text-indigo-700 mb-8'>Benefits for Educators and Students</h2>
        <div className='grid md:grid-cols-2 gap-12'>
          <div>
            <h3 className='text-xl font-semibold border-b border-indigo-200 pb-2 mb-4'>For Teachers</h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Easy-to-create exercises that take minutes, not hours to prepare</span>
              </li>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Real-time insights into student comprehension and progress</span>
              </li>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Reduced grading burden with automated assessment tools</span>
              </li>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>More effective teaching through continuous feedback loops</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-semibold border-b border-indigo-200 pb-2 mb-4'>For Students</h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Learn through active engagement rather than passive reading</span>
              </li>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Build knowledge incrementally without feeling overwhelmed</span>
              </li>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Receive immediate feedback on understanding key concepts</span>
              </li>
              <li className='flex items-start'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Develop better study habits with small, consistent practice</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white text-center'>
        <h2 className='text-2xl font-bold mb-4'>Ready to transform your teaching?</h2>
        <p className='text-lg mb-6 max-w-2xl mx-auto'>
          Join educators who are adapting to modern learning styles and seeing improved student outcomes with Multinex.
        </p>
        <button
          onClick={() => {
            window.location.href = '/signup';
          }}
          className='bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-50 transition duration-300'
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default DefaultLayout(SolutionsTeachers);
