const ExperienceSection = () => {
  const challenges = [
    {
      icon: '🤖',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      title: 'ChatGPT Dependency',
      description: 'Relying on AI summaries alone leads to surface-level understanding that fades quickly after exams.',
    },
    {
      icon: '🧠',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      title: 'Short-term Memory Trap',
      description: 'Quick AI summaries might help you pass, but the knowledge rarely sticks beyond test day.',
    },
    {
      icon: '📱',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: 'Passive Learning',
      description: 'Simply reading AI-generated content keeps your brain in consumption mode, not learning mode.',
    },
  ];

  const solutions = [
    {
      icon: '👀',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      title: 'See & Listen Mode',
      description: 'Start with multi-sensory learning - watch and listen to key concepts explained clearly.',
    },
    {
      icon: '⌨️',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'Active Typing Practice',
      description:
        'Cement your understanding by typing through concepts - proven to boost retention by engaging muscle memory.',
    },
    {
      icon: '✍️',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      title: 'Smart Note-Taking',
      description:
        'Create your own summaries through guided exercises, transforming passive knowledge into active mastery.',
    },
  ];

  const renderListItem = (item: (typeof challenges)[0] | (typeof solutions)[0]) => (
    <li key={item.title} className='group flex gap-6 items-start p-4 rounded-xl hover:bg-primary-50 transition-all duration-300'>
      <span className={`flex-shrink-0 p-4 ${item.bgColor} rounded-xl shadow-sm group-hover:scale-105 transition-transform`}>
        {item.icon}
      </span>
      <div>
        <h4 className='font-manrope text-title-sm font-semibold text-gray-900 mb-2'>{item.title}</h4>
        <p className='font-satoshi text-gray-600 leading-relaxed'>{item.description}</p>
      </div>
    </li>
  );

  return (
    <section className='relative bg-white px-6 py-24 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='font-manrope text-title-xl font-bold text-primary-900 mb-4'>
            Let Knowledge Last 5x Longer
          </h2>
          <p className='font-satoshi text-title-sm text-gray-600 max-w-2xl mx-auto'>
            Turn passive peeking into active grasping with multi-sensory approach
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Challenges Section */}
          <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'>
            <div className='inline-block mb-8'>
              <h3 className='font-manrope text-title-md font-bold text-primary-600'>
                The AI Summary Trap
              </h3>
            </div>
            <ul className='space-y-6'>{challenges.map(renderListItem)}</ul>
          </div>

          {/* Solutions Section */}
          <div className='bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300'>
            <div className='inline-block mb-8'>
              <h3 className='font-manrope text-title-md font-bold text-primary-600'>
                The Typit Learning System
              </h3>
            </div>
            <ul className='space-y-6'>{solutions.map(renderListItem)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
