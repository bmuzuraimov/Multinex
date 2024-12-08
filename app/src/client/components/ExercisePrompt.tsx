const ExercisePrompt: React.FC<{ name: string; prompt: string; setMode: (mode: string) => void }> = ({
  name,
  prompt,
  setMode,
}) => {
  return (
    <div className='relative flex flex-col h-[calc(100vh-64px)] justify-center items-center mx-auto p-8 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50'>
      <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6'>{name}</h1>
      <div
        className='w-full max-w-3xl p-8 my-6 bg-white/80 dark:bg-gray-800/80 text-xl leading-relaxed text-gray-700 dark:text-gray-200 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl'
        dangerouslySetInnerHTML={{ __html: prompt }}
      />
      <div className='w-full max-w-md flex flex-col items-end space-y-2 mt-4'>
        <p className='text-sm text-gray-600 dark:text-gray-400 italic'>
          Tip: Press Tab to skip a word with autocomplete.
        </p>
        <div className='flex justify-end space-x-4'>
          <button
            type="button"
            onClick={() => setMode('test')}
            className='px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50'
          >
            Take Test
          </button>
          <button
            type="button"
            onClick={() => setMode('typing')}
            className='px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
            aria-label='Proceed to typing mode'
          >
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePrompt;
