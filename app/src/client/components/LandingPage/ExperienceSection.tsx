const ExperienceSection = () => {
  const challenges = [
    {
      icon: '📚',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      title: 'Information Overload',
      description: 'Struggling with dense, overwhelming lecture notes that seem impossible to digest.'
    },
    {
      icon: '⏳',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20', 
      title: 'Inefficient Methods',
      description: 'Traditional passive reading leads to poor retention and wasted study time.'
    },
    {
      icon: '⌚',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: 'Time Pressure',
      description: 'Hours spent manually condensing and reviewing study materials.'
    }
  ];

  const solutions = [
    {
      icon: '🎯',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      title: 'AI-Powered Summaries',
      description: 'Get instant, personalized summaries that capture key concepts at your level.'
    },
    {
      icon: '🖥️',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'Interactive Learning',
      description: 'Engage with content through our innovative typing interface for 2x better retention.'
    },
    {
      icon: '⏱️',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      title: 'Time Optimization',
      description: 'Cut study prep time by 70% while maximizing knowledge absorption.'
    }
  ];

  const renderListItem = (item: typeof challenges[0] | typeof solutions[0]) => (
    <li key={item.title} className='group flex gap-4 items-start'>
      <span className={`flex-shrink-0 p-3 ${item.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
        {item.icon}
      </span>
      <div>
        <h4 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
          {item.title}
        </h4>
        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
          {item.description}
        </p>
      </div>
    </li>
  );

  return (
    <section className='relative overflow-hidden px-6 py-32 min-h-screen dark:from-gray-800 dark:to-gray-900'>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/3 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className='relative max-w-7xl mx-auto'>
        <div className='text-center mb-20'>
          <span className='px-4 py-1 text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-full'>
            Transform Your Learning
          </span>
          <h2 className='mt-6 text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 dark:from-white dark:via-teal-200 dark:to-white bg-clip-text text-transparent'>
            Experience the Difference
          </h2>
          <p className='mt-4 text-xl text-gray-600 dark:text-gray-300'>
            Discover how Typit revolutionizes your study experience
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-12 items-stretch'>
          {/* Challenges Section */}
          <div className='backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300'>
            <div className='inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent'>
                Common Study Challenges
              </h3>
            </div>
            <ul className='space-y-8'>
              {challenges.map(renderListItem)}
            </ul>
          </div>

          {/* Solutions Section */}
          <div className='backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300'>
            <div className='inline-block p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-6'>
              <h3 className='text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent'>
                Typit's Smart Solutions
              </h3>
            </div>
            <ul className='space-y-8'>
              {solutions.map(renderListItem)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;