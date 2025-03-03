const GuidePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 font-manrope bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 mb-6 tracking-tight">
          Coming Soon
        </h1>

        <p className="text-xl text-primary-900 leading-relaxed mb-12">
          We're working hard to bring you a comprehensive guide to make the most of Typit.app. Stay tuned!
        </p>

        <div className="mt-16 space-y-4">
          <p className="text-lg text-primary-800 font-medium">
            What to expect:
          </p>
          <ul className="space-y-3 text-primary-700">
            <li className="flex items-center justify-center space-x-2">
              <span className="text-secondary-600">📚 Detailed best practices</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="text-secondary-600">🎯 Step-by-step tutorials</span>
            </li>
            <li className="flex items-center justify-center space-x-2">
              <span className="text-secondary-600">💡 Pro tips and tricks</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-sm text-tertiary-500">
        <p>Have questions? Contact us at bmuzuraimov@gmail.com</p>
      </div>
    </div>
  );
};

export default GuidePage;