import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Transition } from '@headlessui/react';
import StepOne from '../../static/step-1.mp4';
import StepTwo from '../../static/step-2.mp4';
import StepThree from '../../static/step-3.mp4';
import StepFour from '../../static/step-4.mp4';

interface VideoRefs {
  [key: number]: React.RefObject<HTMLVideoElement>;
}

interface Step {
  title: string;
  icon: string;
  videoSrc: string;
  description: string;
  accentColor: string;
  shadowColor: string;
  stats: string;
}

const steps: Step[] = [
  {
    title: 'Upload Your Files',
    icon: '📄',
    videoSrc: StepOne,
    description: 'Upload your PDF, DOCX, or XLSX files to get started.',
    accentColor: 'from-teal-500 to-blue-500',
    shadowColor: 'shadow-teal-500/30',
    stats: ''
  },
  {
    title: 'Smart Knowledge Mapping',
    icon: '🎯',
    videoSrc: StepTwo,
    description: 'Select topics you already know and set your preferred difficulty level to focus on knowledge gaps.',
    accentColor: 'from-blue-500 to-purple-500',
    shadowColor: 'shadow-blue-500/30',
    stats: ''
  },
  {
    title: 'Multi-Modal Learning',
    icon: '🎧',
    videoSrc: StepThree,
    description: 'Experience prioritized learning through listening, typing, and note-taking exercises.',
    accentColor: 'from-purple-500 to-orange-500',
    shadowColor: 'shadow-purple-500/30',
    stats: '+40% comprehension rate'
  },
  {
    title: 'Knowledge Assessment',
    icon: '✅',
    videoSrc: StepFour,
    description: 'Validate your understanding through multiple-choice quizzes and assessments.',
    accentColor: 'from-orange-500 to-red-500',
    shadowColor: 'shadow-orange-500/30',
    stats: '90% learning effectiveness'
  },
];

const StepCard = memo(({ 
  step, 
  index, 
  isHovered,
  currentVideo,
  videoRef,
  onMouseEnter,
  onMouseLeave,
  onVideoEnd
}: {
  step: Step;
  index: number;
  isHovered: number | null;
  currentVideo: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onVideoEnd: () => void;
}) => {
  return (
    <div
      className='group relative h-full'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Transition
        show={true}
        enter="transition-all duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className={`
          relative p-6 rounded-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 
          border border-gray-200 dark:border-gray-700
          transform transition-all duration-300 h-full flex flex-col
          ${isHovered === index ? 'scale-105 shadow-xl' : 'shadow-md'}
        `}>
          <div className={`
            absolute inset-0 bg-gradient-to-br ${step.accentColor} opacity-0 
            group-hover:opacity-5 rounded-2xl transition-opacity duration-300
          `}></div>
          
          <div className='flex items-center gap-3 mb-4 flex-none'>
            <span className='text-2xl'>{step.icon}</span>
            <h3 className={`
              text-xl font-bold bg-gradient-to-r ${step.accentColor} 
              bg-clip-text text-transparent
            `}>
              {step.title}
            </h3>
          </div>

          <div className='relative rounded-xl overflow-hidden flex-1 min-h-[200px]'>
            <video
              ref={videoRef}
              onEnded={onVideoEnd}
              className={`
                w-full h-full object-cover rounded-xl transition duration-300
                ${currentVideo === index ? step.shadowColor : ''}
                ${isHovered === index ? 'transform scale-105' : ''}
              `}
              muted
              playsInline
            >
              <source src={step.videoSrc} type='video/mp4' />
            </video>
            
            <Transition
              show={isHovered === index}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent text-white text-sm font-medium'>
                {step.stats}
              </div>
            </Transition>
          </div>

          <p className='mt-4 text-gray-600 dark:text-gray-300 leading-relaxed flex-none'>
            {step.description}
          </p>
        </div>
      </Transition>
    </div>
  );
});

StepCard.displayName = 'StepCard';

const HowItWorks: React.FC = () => {
  const videoRefs: VideoRefs = {
    0: useRef<HTMLVideoElement>(null),
    1: useRef<HTMLVideoElement>(null),
    2: useRef<HTMLVideoElement>(null),
    3: useRef<HTMLVideoElement>(null),
  };

  const [currentVideo, setCurrentVideo] = useState(0);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  useEffect(() => {
    if (currentVideo < Object.keys(videoRefs).length) {
      const video = videoRefs[currentVideo].current;
      video?.play();
    }
  }, [currentVideo]);

  const handleVideoEnd = useCallback((index: number) => {
    if (index < Object.keys(videoRefs).length - 1) {
      setCurrentVideo(prev => prev + 1);
    } else {
      setCurrentVideo(0);
    }
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    setIsHovered(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(null);
  }, []);

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/3 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
        <Transition
          appear={true}
          show={true}
          enter="transition-all duration-700"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          className='text-center mb-20'
        >
          <span className='px-4 py-1 text-sm font-medium text-teal-600 bg-teal-50 rounded-full'>
            Simple Yet Powerful
          </span>
          <h2 className='mt-6 text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent'>
            How Typit Works
          </h2>
          <p className='mt-4 text-xl text-gray-600'>
            Four simple steps to transform your learning experience
          </p>
        </Transition>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {steps.map((step, index) => (
            <StepCard
              key={index}
              step={step}
              index={index}
              isHovered={isHovered}
              currentVideo={currentVideo}
              videoRef={videoRefs[index]}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onVideoEnd={() => handleVideoEnd(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HowItWorks);