import { useState, useEffect, useRef, useCallback, memo } from 'react';
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
    title: 'Upload Your PDF',
    icon: '📘',
    videoSrc: StepOne,
    description: 'Simply upload your lecture note.',
    accentColor: 'from-teal-500 to-blue-500',
    shadowColor: 'shadow-teal-500/30',
    stats: ''
  },
  {
    title: 'Smart Customization',
    icon: '📝',
    videoSrc: StepTwo,
    description: 'Select the length and complexity—from "Explain like I\'m 5" to "Expert Level."',
    accentColor: 'from-blue-500 to-purple-500',
    shadowColor: 'shadow-blue-500/30',
    stats: ''
  },
  {
    title: 'Active Learning',
    icon: '🧠',
    videoSrc: StepThree,
    description: 'Type along with AI-filtered content to reinforce memory retention.',
    accentColor: 'from-purple-500 to-orange-500',
    shadowColor: 'shadow-purple-500/30',
    stats: '+30% knowledge retention'
  },
  {
    title: 'Knowledge Validation',
    icon: '🎯',
    videoSrc: StepFour,
    description: 'Reinforce learning with adaptive testing.',
    accentColor: 'from-orange-500 to-red-500',
    shadowColor: 'shadow-orange-500/30',
    stats: '50% less forgetting'
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
        
        <div className='flex items-center gap-3 mb-4'>
          <span className='text-2xl'>{step.icon}</span>
          <h3 className={`
            text-xl font-bold bg-gradient-to-r ${step.accentColor} 
            bg-clip-text text-transparent
          `}>
            {step.title}
          </h3>
        </div>

        <div className='relative rounded-xl overflow-hidden flex-grow'>
          <video
            ref={videoRef}
            onEnded={onVideoEnd}
            className={`
              w-full rounded-xl transition duration-300
              ${currentVideo === index ? step.shadowColor : ''}
              ${isHovered === index ? 'transform scale-105' : ''}
            `}
            muted
            playsInline
          >
            <source src={step.videoSrc} type='video/mp4' />
          </video>
          
          <div className={`
            absolute bottom-0 left-0 right-0 p-3
            bg-gradient-to-t from-black/50 to-transparent
            text-white text-sm font-medium
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
          `}>
            {step.stats}
          </div>
        </div>

        <p className='mt-4 text-gray-600 dark:text-gray-300 leading-relaxed'>
          {step.description}
        </p>
      </div>
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
        <div className='text-center mb-20'>
          <span className='px-4 py-1 text-sm font-medium text-teal-600 bg-teal-50 rounded-full'>
            Simple Yet Powerful
          </span>
          <h2 className='mt-6 text-5xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent'>
            How Typit Works
          </h2>
          <p className='mt-4 text-xl text-gray-600'>
            Four simple steps to transform your learning experience
          </p>
        </div>

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