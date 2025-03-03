import React, { useState, useEffect, memo } from 'react';
import { updateExercise } from 'wasp/client/operations';

interface ExerciseEditModalProps {
  id: string;
  name: string;
  lessonText: string;
  onClose: () => void;
}

// Memoized loading spinner component
const LoadingSpinner = memo(() => (
  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
));

// Memoized close button component
const CloseButton = memo(({ onClose }: { onClose: () => void }) => (
  <button
    onClick={onClose}
    className="text-tertiary-400 hover:text-tertiary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
  >
    <span className="sr-only">Close</span>
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
));

const ExerciseEditModal: React.FC<ExerciseEditModalProps> = memo(({ id, name, lessonText, onClose }) => {
  const [exerciseName, setExerciseName] = useState(name);
  const [exerciseText, setExerciseText] = useState(lessonText);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExerciseName(name);
    setExerciseText(lessonText);
  }, [name, lessonText]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await updateExercise({ id, updated_data: { name: exerciseName, lessonText: exerciseText } });
      setSuccess('Exercise updated successfully');
    } catch (err) {
      setError('Failed to update exercise');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = exerciseText.split(' ').length;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl transform transition-all duration-300 ease-in-out">
        <div className="absolute top-4 right-4">
          <CloseButton onClose={onClose} />
        </div>
        <div className="p-8">
          <h2 className="font-manrope text-title-lg font-semibold text-gray-900 mb-6">Edit Exercise</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block font-montserrat text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-satoshi text-base transition duration-200"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="lessonText" className="block font-montserrat text-sm font-medium text-gray-700">
                  Lesson Text
                </label>
                <span className="font-satoshi text-sm text-tertiary-400">
                  {wordCount} words
                </span>
              </div>
              <textarea
                id="lessonText"
                value={exerciseText}
                onChange={(e) => setExerciseText(e.target.value)}
                rows={4}
                className="block w-full h-96 rounded-lg border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-satoshi text-base transition duration-200"
              />
            </div>
            {error && (
              <div className="text-sm font-satoshi text-danger rounded-md bg-danger/10 p-3">{error}</div>
            )}
            {success && (
              <div className="text-sm font-satoshi text-success rounded-md bg-success/10 p-3">{success}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-satoshi font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading && <LoadingSpinner />}
                {loading ? 'Updating...' : 'Update Exercise'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default ExerciseEditModal;