import React, { useState, useEffect } from 'react';

const TextContent: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedText0, setDisplayedText0] = useState('');
  const [displayedText1, setDisplayedText1] = useState('');
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(0);

  const fullText0 = "The formula for the area of a circle, A=πr², is fundamental in geometry. Here, r represents the radius of the circle, and π (approximately 3.14159) is a constant that relates the circle's circumference to its diameter.";
  const fullText1 = "This formula works because it integrates the radius into the calculation to define the space enclosed within a circle. For example, a circle with a radius of 3 cm would have an area of about 28.27 square centimeters. Understanding this allows for practical applications, like calculating the surface area of circular objects or spaces.";
  const fullText2 = "Interestingly, the concept of π has fascinated mathematicians for centuries, as it is an irrational number that continues infinitely without repeating patterns. Ancient civilizations, like the Egyptians and Babylonians, approximated π long before modern calculations refined its value.";

  useEffect(() => {
    let currentIndex = 0;
    let typingSpeed = activeIndex === 1 ? 20 : 50; // Faster for typing, slower for handwriting

    const typeText = () => {
      if (activeIndex === 0 && currentIndex < fullText0.length) {
        setDisplayedText0(fullText0.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else if (activeIndex === 0 && currentIndex === fullText0.length) {
        setActiveIndex(1);
      } else if (activeIndex === 1 && currentIndex < fullText1.length) {
        setDisplayedText1(fullText1.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else if (activeIndex === 1 && currentIndex === fullText1.length) {
        setActiveIndex(2);
      }
    };

    currentIndex = 0;
    if (activeIndex === 0) setDisplayedText0('');
    if (activeIndex === 1) setDisplayedText1('');
    if (activeIndex === 2) {
      // Start word highlighting for listening mode
      const words = fullText2.split(' ');
      let wordIndex = 0;
      const highlightInterval = setInterval(() => {
        if (wordIndex < words.length) {
          setHighlightedWordIndex(wordIndex);
          wordIndex++;
        } else {
          clearInterval(highlightInterval);
          setActiveIndex(0);
        }
      }, 300); // Adjust timing as needed
    }
    typeText();
  }, [activeIndex]);

  const renderHighlightedText = (text: string, isParagraphTwo: boolean = false) => {
    if (!isParagraphTwo) return text;
    
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className={`transition-all duration-300 ${
          index === highlightedWordIndex ? 'bg-yellow-300/30 text-white' : ''
        }`}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white space-y-2 p-2 backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl relative">
        {/* Active label display */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full backdrop-blur-sm">
            <span className="text-xl">{activeIndex === 0 ? "✍️" : activeIndex === 1 ? "⌨️" : "🎧"}</span>
            <span className="font-semibold">{activeIndex === 0 ? "Write down" : activeIndex === 1 ? "Type" : "See & Listen"}</span>
            <span className="text-sm opacity-75">({activeIndex === 0 ? "Must memorize" : activeIndex === 1 ? "Easy but not intuitive" : "Intuitive"})</span>
          </div>
        </div>

        <div className="relative">
          <p 
            className={`text-lg ${activeIndex === 0 ? 'font-dancing' : ''} leading-relaxed px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-500`}
            style={{
              filter: activeIndex === 0 ? 'blur(0)' : 'blur(2px)',
              opacity: activeIndex === 0 ? '1' : '0.5',
              backgroundColor: '#4444ff1a',
              borderColor: '#4444ff33',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            aria-label="Write down"
          >
            <span id="paragraph-0">
              {activeIndex === 0 ? displayedText0 : fullText0}
            </span>
          </p>
        </div>

        <div className="relative">
          <p 
            className="text-lg leading-relaxed px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-500"
            style={{
              filter: activeIndex === 1 ? 'blur(0)' : 'blur(2px)',
              opacity: activeIndex === 1 ? '1' : '0.5',
              backgroundColor: '#44ff441a',
              borderColor: '#44ff4433',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            aria-label="Type"
          >
            <span id="paragraph-1">
              {activeIndex === 1 ? displayedText1 : fullText1}
            </span>
          </p>
        </div>

        <div className="relative">
          <p 
            className="text-lg leading-relaxed px-4 py-3 rounded-lg backdrop-blur-sm transition-all duration-500"
            style={{
              filter: activeIndex === 2 ? 'blur(0)' : 'blur(2px)',
              opacity: activeIndex === 2 ? '1' : '0.5',
              backgroundColor: '#ff44441a',
              borderColor: '#ff444433',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            aria-label="See & Listen"
          >
            <span id="paragraph-2">
              {renderHighlightedText(fullText2, true)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextContent;