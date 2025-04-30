import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { IoStopOutline } from 'react-icons/io5';
import { CiPlay1 } from 'react-icons/ci';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shadcn/components/ui/card';
import { Button } from '../../../../shadcn/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../shadcn/components/ui/tooltip';
import { cn } from '../../../../../shared/utils';

const ComparisonSection = () => {
  const animationRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<anime.AnimeInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsPlaying(true);
        } else {
          setIsInView(false);
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.2 // Trigger when 20% of the section is visible
      }
    );

    if (animationRef.current) {
      observer.observe(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        observer.unobserve(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!animationRef.current || !isInView) return;

    // Clear any existing animations
    if (timelineRef.current) {
      timelineRef.current.pause();
    }

    const container = animationRef.current;
    const traditional = container.querySelector('.traditional-timeline');
    const multinex = container.querySelector('.multinex-timeline');

    // Create timeline elements
    const createTimelineElements = () => {
      // Create week markers
      const weeks = 14;
      const weekWidth = 100 / weeks;

      for (let i = 1; i <= weeks; i++) {
        const weekMarker = document.createElement('div');
        weekMarker.className = 'week-marker';
        weekMarker.style.left = `${(i - 1) * weekWidth}%`;
        weekMarker.setAttribute('data-week', `${i}`);

        const traditionalMarker = weekMarker.cloneNode(true) as HTMLElement;
        const multinexMarker = weekMarker.cloneNode(true) as HTMLElement;

        traditional?.appendChild(traditionalMarker);
        multinex?.appendChild(multinexMarker);

        // Create activity indicators
        const traditionalActivity = document.createElement('div');
        traditionalActivity.className = `activity-indicator traditional-activity week-${i}`;
        traditionalActivity.style.left = `${(i - 1) * weekWidth + weekWidth / 2}%`;

        const multinexActivity = document.createElement('div');
        multinexActivity.className = `activity-indicator multinex-activity week-${i}`;
        multinexActivity.style.left = `${(i - 1) * weekWidth + weekWidth / 2}%`;

        traditional?.appendChild(traditionalActivity);
        multinex?.appendChild(multinexActivity);

        // Add particles only for key weeks (midterm and final)
        if (i === 6 || i === 14) {
          for (let j = 0; j < 5; j++) {
            // Traditional particles (shards)
            const traditionalParticle = document.createElement('div');
            traditionalParticle.className = `knowledge-particle traditional-particle week-${i}-particle-${j}`;
            traditionalParticle.style.left = `${(i - 1) * weekWidth + weekWidth / 2}%`;
            traditionalParticle.style.bottom = `${10 + Math.random() * 70}%`;
            traditional?.appendChild(traditionalParticle);

            // Multinex particles (nodes)
            const multinexParticle = document.createElement('div');
            multinexParticle.className = `knowledge-particle multinex-particle week-${i}-particle-${j}`;
            multinexParticle.style.left = `${(i - 1) * weekWidth + weekWidth / 2}%`;
            multinexParticle.style.bottom = `${10 + Math.random() * 70}%`;
            multinex?.appendChild(multinexParticle);
          }
        }
      }

      // Create stress indicator (traditional) and confidence indicator (multinex)
      const traditionalStress = document.createElement('div');
      traditionalStress.className = 'stress-indicator traditional-stress';
      traditional?.appendChild(traditionalStress);

      const multinexConfidence = document.createElement('div');
      multinexConfidence.className = 'confidence-indicator multinex-confidence';
      multinex?.appendChild(multinexConfidence);

      // Create simplified connection network for Multinex
      const connectionNetwork = document.createElement('div');
      connectionNetwork.className = 'connection-network';
      multinex?.appendChild(connectionNetwork);
    };

    createTimelineElements();

    // Animation timeline
    const timeline = anime.timeline({
      easing: 'easeOutQuad',
      loop: true,
      autoplay: isPlaying,
      duration: 10000,
    });

    // Traditional approach animations (simplified)
    timeline
      // Initial state - low activity
      .add({
        targets: '.traditional-activity',
        opacity: [0, 0.2],
        height: 3,
        backgroundColor: '#e4e7eb',
        delay: anime.stagger(50),
        duration: 500,
      })
      // Midterm week explosion
      .add(
        {
          targets: '.traditional-activity.week-6',
          height: [3, 80],
          opacity: [0.2, 1],
          backgroundColor: '#D34053',
          easing: 'easeInOutExpo',
          duration: 600,
          scale: [1, 1.2],
        },
        '+=1000'
      )
      // Stress and particles for midterm
      .add(
        {
          targets: '.traditional-stress',
          opacity: [0, 0.7],
          scale: [0.5, 1.5],
          backgroundColor: 'rgba(211, 64, 83, 0.3)',
          duration: 600,
          translateY: [-10, 0],
          translateX: function () {
            return anime.random(-5, 5);
          },
        },
        '-=600'
      )
      .add(
        {
          targets:
            '.traditional-particle.week-6-particle-0, .traditional-particle.week-6-particle-1, .traditional-particle.week-6-particle-2',
          opacity: [0, 1],
          scale: [0, 1.5],
          translateX: function () {
            return anime.random(-30, 30);
          },
          translateY: function () {
            return anime.random(-30, 30);
          },
          rotate: function () {
            return anime.random(-45, 45);
          },
          duration: 600,
        },
        '-=600'
      )
      // Midterm activity fades
      .add(
        {
          targets:
            '.traditional-activity.week-6, .traditional-stress, .traditional-particle.week-6-particle-0, .traditional-particle.week-6-particle-1, .traditional-particle.week-6-particle-2',
          height: function (el: Element) {
            return el.classList.contains('traditional-activity') ? 3 : (el as HTMLElement).style.height;
          },
          opacity: [1, 0.1],
          scale: 1,
          backgroundColor: function (el: Element) {
            return el.classList.contains('traditional-activity') ? '#e4e7eb' : 'transparent';
          },
          duration: 800,
        },
        '+=800'
      )
      // Final exam massive cramming
      .add(
        {
          targets: '.traditional-activity.week-14',
          height: [3, 100],
          opacity: [0.2, 1],
          backgroundColor: '#FFA70B',
          easing: 'easeInOutExpo',
          duration: 800,
          scale: [1, 1.3],
        },
        '+=1000'
      )
      // Stress and particles for final
      .add(
        {
          targets: '.traditional-stress',
          opacity: [0, 0.9],
          scale: [0.5, 2],
          backgroundColor: 'rgba(255, 167, 11, 0.4)',
          duration: 800,
          translateY: [-10, 0],
          translateX: function () {
            return anime.random(-8, 8);
          },
        },
        '-=800'
      )
      .add(
        {
          targets:
            '.traditional-particle.week-14-particle-0, .traditional-particle.week-14-particle-1, .traditional-particle.week-14-particle-2',
          opacity: [0, 1],
          scale: [0, 2],
          translateX: function () {
            return anime.random(-40, 40);
          },
          translateY: function () {
            return anime.random(-40, 40);
          },
          rotate: function () {
            return anime.random(-60, 60);
          },
          duration: 800,
        },
        '-=800'
      )
      // Knowledge retention spike then rapid decay
      .add(
        {
          targets: '.traditional-retention',
          width: ['0%', '80%'],
          opacity: [0, 0.8],
          backgroundColor: '#D34053',
          easing: 'easeInOutExpo',
          duration: 800,
        },
        '-=400'
      )
      .add({
        targets: '.traditional-retention',
        width: ['80%', '10%'],
        opacity: [0.8, 0.2],
        backgroundColor: '#9ca3af',
        easing: 'easeOutQuad',
        duration: 1500,
      });

    // Multinex approach animations (simplified)
    timeline
      // Consistent activity growth
      .add(
        {
          targets: '.multinex-activity',
          opacity: [0, 0.4],
          height: function (el: Element, i: number) {
            return 5 + i * 5; // Progressive growth from start
          },
          backgroundColor: function (el: Element, i: number) {
            const baseColor = i < 7 ? '#74b4ff' : '#05c49b';
            return baseColor;
          },
          delay: anime.stagger(100),
          duration: 2000,
        },
        0
      )
      // Midterm week - prepared confidence
      .add(
        {
          targets: '.multinex-activity.week-6',
          scale: [1, 1.2],
          boxShadow: ['0 0 0 rgba(62, 129, 255, 0)', '0 0 15px rgba(62, 129, 255, 0.7)'],
          duration: 800,
        },
        '+=1500'
      )
      // Confidence indicator and particles for midterm
      .add(
        {
          targets: '.multinex-confidence',
          opacity: [0, 0.6],
          scale: [0.8, 1.2],
          backgroundColor: 'rgba(62, 129, 255, 0.2)',
          duration: 800,
        },
        '-=800'
      )
      .add(
        {
          targets:
            '.multinex-particle.week-6-particle-0, .multinex-particle.week-6-particle-1, .multinex-particle.week-6-particle-2',
          opacity: [0, 0.8],
          scale: [0, 1],
          duration: 800,
        },
        '-=800'
      )
      // Final exam week - maximum confidence
      .add(
        {
          targets: '.multinex-activity.week-14',
          scale: [1, 1.3],
          height: [60, 80],
          boxShadow: ['0 0 0 rgba(5, 196, 155, 0)', '0 0 20px rgba(5, 196, 155, 0.8)'],
          backgroundColor: '#219653',
          duration: 1000,
        },
        '+=1500'
      )
      // Knowledge particles and confidence for final
      .add(
        {
          targets: '.multinex-confidence',
          opacity: [0, 0.8],
          scale: [0.8, 1.5],
          backgroundColor: 'rgba(33, 150, 83, 0.2)',
          borderRadius: '50%',
          duration: 1000,
        },
        '-=1000'
      )
      .add(
        {
          targets:
            '.multinex-particle.week-14-particle-0, .multinex-particle.week-14-particle-1, .multinex-particle.week-14-particle-2',
          opacity: [0, 0.9],
          scale: [0, 1.2],
          backgroundColor: '#219653',
          boxShadow: ['0 0 0 rgba(33, 150, 83, 0)', '0 0 8px rgba(33, 150, 83, 0.6)'],
          duration: 1000,
        },
        '-=1000'
      )
      // Knowledge retention steady and high
      .add(
        {
          targets: '.multinex-retention',
          width: ['0%', '90%'],
          opacity: [0, 0.9],
          backgroundColor: '#219653',
          easing: 'easeOutQuad',
          duration: 2000,
        },
        '-=1500'
      );

    timelineRef.current = timeline;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };
  }, [isPlaying, isInView]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (timelineRef.current) {
      if (isPlaying) {
        timelineRef.current.pause();
      } else {
        timelineRef.current.play();
      }
    }
  };

  return (
    <section className='relative px-6 py-24 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Semester Timeline Visualization */}
        <div ref={animationRef} className='mb-20'>
          <div className='flex flex-col gap-8'>
            {/* Traditional Learning Timeline */}
            <Card className='overflow-hidden border-none'>
              <CardHeader>
                <CardTitle className='text-center font-manrope text-title-xl font-bold text-danger'>
                  Traditional Learning
                </CardTitle>
                <CardDescription className='text-center font-satoshi text-lg text-gray-600'>
                  Cramming before exams leads to stress and poor retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='traditional-timeline relative h-48 w-full bg-gray-100/50 dark:bg-gray-700 rounded-lg overflow-hidden'>
                  <TooltipProvider>
                    {/* Midterm Milestone */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='milestone midterm absolute top-0 h-full' style={{ left: '40%' }}>
                          <div className='milestone-label text-sm text-gray-500'>Midterm</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className='bg-white/90 backdrop-blur-sm border border-danger/20'>
                        <p>High stress, low comprehension</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Final Milestone */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='milestone final absolute top-0 h-full' style={{ left: '95%' }}>
                          <div className='milestone-label text-sm text-gray-500'>Final</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className='bg-white/90 backdrop-blur-sm border border-danger/20'>
                        <p>Extreme cramming, minimal retention</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className='flex justify-between mt-3 text-sm text-gray-500 font-satoshi'>
                  <span>Week 1</span>
                  <span>Week 14</span>
                </div>
              </CardContent>
            </Card>

            {/* Multinex Timeline */}
            <Card className='overflow-hidden border-none'>
              <CardHeader>
                <CardTitle className='text-center font-manrope text-title-xl font-bold text-primary-900'>
                  Multinex Approach
                </CardTitle>
                <CardDescription className='text-center font-satoshi text-lg text-gray-600'>
                  Consistent engagement builds lasting knowledge networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='multinex-timeline relative h-48 w-full bg-gray-100/50 dark:bg-gray-700 rounded-lg overflow-hidden'>
                  <TooltipProvider>
                    {/* Midterm Milestone */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='milestone midterm absolute top-0 h-full' style={{ left: '40%' }}>
                          <div className='milestone-label text-sm text-gray-500'>Midterm</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className='bg-white/90 backdrop-blur-sm border border-primary-200'>
                        <p>Steady preparation, low stress</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Final Milestone */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='milestone final absolute top-0 h-full' style={{ left: '95%' }}>
                          <div className='milestone-label text-sm text-gray-500'>Final</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className='bg-white/90 backdrop-blur-sm border border-primary-200'>
                        <p>Strong knowledge foundation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className='flex justify-between mt-3 text-sm text-gray-500 font-satoshi'>
                  <span>Week 1</span>
                  <span>Week 14</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='mt-10 text-center'>
            <Button
              onClick={togglePlayPause}
              variant='default'
              size='lg'
              className={cn(
                'px-6 py-3 text-lg rounded-full transition-all duration-200',
                isPlaying 
                  ? 'bg-danger hover:bg-danger/90' 
                  : 'bg-primary-500 hover:bg-primary-600'
              )}
            >
              {isPlaying ? <IoStopOutline className='mr-2' /> : <CiPlay1 className='mr-2' />}
              {isPlaying ? 'Stop' : 'Play'} Animation
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .activity-indicator {
          position: absolute;
          bottom: 0;
          width: 15px;
          height: 8px;
          border-radius: 6px;
          transform: translateX(-50%);
          transition: all 0.3s ease;
        }
        
        .milestone {
          width: 3px;
          background-color: rgba(107, 114, 128, 0.3);
          z-index: 1;
        }
        
        .milestone-label {
          position: absolute;
          top: 8px;
          left: 8px;
          white-space: nowrap;
        }
        
        .week-marker {
          position: absolute;
          bottom: 0;
          width: 2px;
          height: 8px;
          background-color: rgba(107, 114, 128, 0.3);
        }
        
        .knowledge-particle {
          position: absolute;
          width: 12px;
          height: 12px;
          opacity: 0;
          z-index: 2;
        }
        
        .traditional-particle {
          background-color: #D34053;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          transform-origin: center;
        }
        
        .multinex-particle {
          background-color: #3e81ff;
          border-radius: 50%;
          transform-origin: center;
        }
        
        .stress-indicator, .confidence-indicator {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          pointer-events: none;
        }
        
        .connection-network {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        
        .traditional-timeline:hover .tooltip,
        .multinex-timeline:hover .tooltip {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .traditional-retention-indicator,
        .multinex-retention-indicator {
          transform-origin: left;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
};

export default ComparisonSection;
