import React, { useState, useEffect, MutableRefObject, useRef, useCallback } from 'react';
import { cn } from '../../../../../../shared/utils';

interface TextContentProps {
  activeIndex: number;
  setSectionsRef?: MutableRefObject<(HTMLElement | null)[]>;
}

const TextContent: React.FC<TextContentProps> = ({ activeIndex, setSectionsRef }) => {
  const [displayedChars0, setDisplayedChars0] = useState<boolean[]>([]);
  const [displayedChars1, setDisplayedChars1] = useState<boolean[]>([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(0);

  // Create refs for each section
  const section0Ref = useRef<HTMLElement>(null);
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);

  // Improved text content with cognitive science principles
  const textContent = {
    desktop: {
      text0:
        'When you write things down, you create stronger neural pathways in your brain. This activates multiple regions, including visual processing and fine motor skills. The physical act of writing engages your working memory and helps transfer information from short-term to long-term memory.',
      text1:
        'Typing allows you to process information quickly. While not as effective as handwriting for retention, typing helps you to keep your attention on the content.',
      text2:
        'Seeing and hearing information simultaneously activates multiple neural pathways, creating stronger memory traces. This dual-coding approach reduces cognitive load and enhances understanding by leveraging both your visual and auditory processing systems. When information enters through multiple senses, your brain forms more connections, making recall easier and learning more intuitive and natural.',
    },
    tablet: {
      text0:
        'Writing by hand creates stronger memory connections by engaging motor skills and visual processing simultaneously.',
      text1:
        'Typing processes information efficiently using different cognitive pathways. While less effective than handwriting for memory formation, typing helps you to keep your attention on the content.',
      text2:
        'Seeing and hearing information together activates multiple brain regions simultaneously. This reduces mental effort while strengthening memory formation. When your brain receives input through both visual and auditory channels, it builds stronger neural connections for easier recall later.',
    },
    mobile: {
      text0:
        'Writing activates motor skills and visual processing together. This creates stronger memory traces and improved learning compared to passive reading or typing.',
      text1:
        'Typing is fast and efficient. Great for capturing your attention on the content.',
      text2:
        'Using both eyes and ears to learn reduces mental effort while improving memory. Multiple sensory inputs create stronger neural connections for better recall.',
    },
  };

  // Function to determine screen size
  const getScreenSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 'desktop';
      if (window.innerWidth >= 768) return 'tablet';
      return 'mobile';
    }
    return 'desktop'; // Default fallback
  };

  const [screenSize, setScreenSize] = useState(getScreenSize());
  const fullText0 = textContent[screenSize as keyof typeof textContent].text0;
  const fullText1 = textContent[screenSize as keyof typeof textContent].text1;
  const fullText2 = textContent[screenSize as keyof typeof textContent].text2;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update the sectionsRef when refs are available
  const updateSectionsRef = useCallback(() => {
    if (setSectionsRef && section0Ref.current && section1Ref.current && section2Ref.current) {
      setSectionsRef.current = [section0Ref.current, section1Ref.current, section2Ref.current];
    }
  }, [setSectionsRef]);

  // Set up the refs after the component mounts
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSectionsRef();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [updateSectionsRef]);

  useEffect(() => {
    let currentIndex = -1;
    let typingSpeed = activeIndex === 1 ? 20 : 50;

    if (activeIndex === 0) {
      // Initialize array of false values for each character
      setDisplayedChars0(new Array(fullText0.length).fill(false));

      const typeText = () => {
        if (currentIndex < fullText0.length) {
          setDisplayedChars0((prev) => {
            const newChars = [...prev];
            newChars[currentIndex] = true;
            return newChars;
          });
          currentIndex++;
          setTimeout(typeText, typingSpeed);
        }
      };

      typeText();
    } else if (activeIndex === 1) {
      // Initialize array of false values for each character
      setDisplayedChars1(new Array(fullText1.length).fill(false));

      const typeText = () => {
        if (currentIndex < fullText1.length) {
          setDisplayedChars1((prev) => {
            const newChars = [...prev];
            newChars[currentIndex] = true;
            return newChars;
          });
          currentIndex++;
          setTimeout(typeText, typingSpeed);
        }
      };

      typeText();
    } else if (activeIndex === 2) {
      const words = fullText2.split(' ');
      let wordIndex = 0;
      const highlightInterval = setInterval(() => {
        if (wordIndex < words.length) {
          setHighlightedWordIndex(wordIndex);
          wordIndex++;
        } else {
          clearInterval(highlightInterval);
          setHighlightedWordIndex(0);
        }
      }, 300);

      return () => clearInterval(highlightInterval);
    }
  }, [activeIndex, fullText0, fullText1, fullText2]);

  const renderHighlightedText = (text: string, isParagraphTwo: boolean = false) => {
    if (!isParagraphTwo) return text;

    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className={cn(
          'transition-all duration-100',
          index === highlightedWordIndex ? 'bg-secondary-200 text-secondary-900' : 'text-gray-800'
        )}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className='relative w-full'>
      {/* First screen height section */}
      <section
        ref={section0Ref as React.RefObject<HTMLElement>}
        className='section-container h-[300px] md:h-[800px] lg:h-screen w-full flex items-center justify-center bg-white pr-4 md:pr-8 lg:pr-12'
        data-index='0'
      >
        <div className='max-w-6xl w-full relative'>
          <div className='absolute -top-20 md:-top-24 lg:-top-32 left-1/2 transform -translate-x-1/2'>
            <div className='group relative flex items-center gap-3 md:gap-4 lg:gap-6 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-red-100 transition-all duration-200 hover:border-primary-300'>
              <span className='text-2xl md:text-3xl lg:text-4xl'>✍️</span>
              <div className='flex flex-col'>
                <span className='font-satoshi font-bold text-lg md:text-xl lg:text-2xl text-danger'>&lt;write&gt;Handwriting&lt;/write&gt;</span>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'p-4 md:p-8 lg:p-10 rounded-xl md:rounded-2xl transition-all duration-200',
              activeIndex === 0
                ? 'bg-white shadow-lg border-3 border-primary-200'
                : 'bg-gray-50 border-2 border-gray-100'
            )}
          >
            <p className='text-lg md:text-xl lg:text-2xl font-manrope leading-relaxed text-danger min-h-[100px] md:min-h-[150px] lg:min-h-[200px]'>
              {activeIndex === 0
                ? fullText0.split('').map((char, index) => (
                    <span
                      key={index}
                      className={cn(
                        'transition-opacity duration-100',
                        displayedChars0[index] ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      {char}
                    </span>
                  ))
                : fullText0}
            </p>
          </div>
        </div>
      </section>

      {/* Second screen height section */}
      <section
        ref={section1Ref as React.RefObject<HTMLElement>}
        className='section-container h-[300px] md:h-[800px] lg:h-screen w-full flex items-center justify-center bg-white p-4 md:p-8 lg:p-12'
        data-index='1'
      >
        <div className='max-w-6xl w-full relative'>
          <div className='absolute -top-20 md:-top-24 lg:-top-32 left-1/2 transform -translate-x-1/2'>
            <div className='group relative flex items-center gap-3 md:gap-4 lg:gap-6 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-primary-100 transition-all duration-200 hover:border-primary-300'>
              <span className='text-2xl md:text-3xl lg:text-4xl'>⌨️</span>
              <div className='flex flex-col'>
                <span className='font-satoshi font-bold text-lg md:text-xl lg:text-2xl text-primary-600'>&lt;type&gt;Typing&lt;/type&gt;</span>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'p-4 md:p-8 lg:p-10 rounded-xl md:rounded-2xl transition-all duration-200',
              activeIndex === 1
                ? 'bg-white shadow-lg border-3 border-secondary-200'
                : 'bg-gray-50 border-2 border-gray-100'
            )}
          >
            <p className='text-lg md:text-xl lg:text-2xl font-manrope leading-relaxed text-primary-800 min-h-[100px] md:min-h-[150px] lg:min-h-[200px]'>
              {activeIndex === 1
                ? fullText1.split('').map((char, index) => (
                    <span
                      key={index}
                      className={cn(
                        'transition-opacity duration-100',
                        displayedChars1[index] ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      {char}
                    </span>
                  ))
                : fullText1}
            </p>
          </div>
        </div>
      </section>

      {/* Third screen height section */}
      <section
        ref={section2Ref as React.RefObject<HTMLElement>}
        className='section-container h-[300px] md:h-[800px] lg:h-screen w-full flex items-center justify-center bg-white p-4 md:p-8 lg:p-12'
        data-index='2'
      >
        <div className='max-w-6xl w-full relative'>
          <div className='absolute -top-20 md:-top-24 lg:-top-32 left-1/2 transform -translate-x-1/2'>
            <div className='group relative flex items-center gap-3 md:gap-4 lg:gap-6 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-secondary-100 transition-all duration-200 hover:border-primary-300'>
              <span className='text-2xl md:text-3xl lg:text-4xl'>🎧</span>
              <div className='flex flex-col'>
                <span className='font-satoshi font-bold text-lg md:text-xl lg:text-2xl text-secondary-600'>
                  See & Listen
                </span>
                <span className='text-sm md:text-base lg:text-lg font-manrope text-gray-600'>Intuitive</span>
              </div>
            </div>
          </div>
          <div
            className={cn(
              'p-4 md:p-8 lg:p-10 rounded-xl md:rounded-2xl transition-all duration-200',
              activeIndex === 2
                ? 'bg-white shadow-lg border-3 border-secondary-200'
                : 'bg-gray-50 border-2 border-gray-100'
            )}
          >
            <p className='text-lg md:text-xl lg:text-2xl font-manrope leading-relaxed min-h-[100px] md:min-h-[150px] lg:min-h-[200px]'>
              {renderHighlightedText(fullText2, true)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TextContent;
