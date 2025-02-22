const GuidePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 font-manrope bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700 mb-6 tracking-tight">
          Coming Soon
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
          We're working hard to bring you a comprehensive guide to make the most of Typit.app. Stay tuned!
        </p>

        <div className="mt-16 space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">
            What to expect:
          </p>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-center justify-center space-x-2">
              <span>📚 Detailed best practices</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span>🎯 Step-by-step tutorials</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span>💡 Pro tips and tricks</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Have questions? Contact us at bmuzuraimov@gmail.com</p>
      </div>
    </div>
  );
};

export default GuidePage;