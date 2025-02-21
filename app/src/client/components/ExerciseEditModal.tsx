import React, { useState, useEffect } from 'react';
import { updateExercise } from 'wasp/client/operations';

interface ExerciseEditModalProps {
  id: string;
  name: string;
  lessonText: string;
  onClose: () => void;
}

const ExerciseEditModal: React.FC<ExerciseEditModalProps> = ({ id, name, lessonText, onClose }) => {
  const [exerciseName, setExerciseName] = useState(name);
  const [exerciseText, setExerciseText] = useState(lessonText);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState('');

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

  const handleGenerateAudio = async () => {
    setAudioLoading(true);
    setAudioError('');
    try {
      const formData = new FormData();
      formData.append('exerciseId', id);
      formData.append('generate_text', exerciseText);
      
      const documentParserUrl = import.meta.env.REACT_APP_DOCUMENT_PARSER_URL + '/generate-audio';
      const response = await fetch(documentParserUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate audio');
      }

      const data = await response.json();
      setSuccess('Audio generated successfully');
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : 'Failed to generate audio');
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* <RiAiGenerate className="absolute bottom-2 right-2" /> */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Edit Exercise</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="lessonText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lesson Text
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {exerciseText.split(' ').length} words
                </span>
              </div>
              <textarea
                id="lessonText"
                value={exerciseText}
                onChange={(e) => setExerciseText(e.target.value)}
                rows={4}
                className="mt-1 block w-full h-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            )}
            {success && (
              <div className="text-sm text-green-600 dark:text-green-400">{success}</div>
            )}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Updating...' : 'Update Exercise'}
              </button>
              <button
                type="button"
                onClick={() => handleGenerateAudio()}
                disabled={audioLoading}
                className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                  audioLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {audioLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {audioLoading ? 'Generating Audio...' : 'Generate Audio'}
              </button>
              {audioError && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">{audioError}</div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExerciseEditModal;