import React, { useState, useEffect } from 'react';

interface TextContentProps {
  activeIndex: number;
}

const TextContent: React.FC<TextContentProps> = ({ activeIndex }) => {
  const [displayedText0, setDisplayedText0] = useState('');
  const [displayedText1, setDisplayedText1] = useState('');
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(0);

  const fullText0 = "The formula for the area of a circle, A=πr², is fundamental in geometry. Here, r represents the radius of the circle, and π (approximately 3.14159) is a constant that relates the circle's circumference to its diameter.";
  const fullText1 = "This formula works because it integrates the radius into the calculation to define the space enclosed within a circle. For example, a circle with a radius of 3 cm would have an area of about 28.27 square centimeters. Understanding this allows for practical applications, like calculating the surface area of circular objects or spaces.";
  const fullText2 = "Interestingly, the concept of π has fascinated mathematicians for centuries, as it is an irrational number that continues infinitely without repeating patterns. Ancient civilizations, like the Egyptians and Babylonians, approximated π long before modern calculations refined its value.";

  useEffect(() => {
    let currentIndex = 0;
    let typingSpeed = activeIndex === 1 ? 20 : 50;

    const typeText = () => {
      if (activeIndex === 0 && currentIndex < fullText0.length) {
        setDisplayedText0(fullText0.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else if (activeIndex === 1 && currentIndex < fullText1.length) {
        setDisplayedText1(fullText1.slice(0, currentIndex + 1) + "_");
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      }
    };

    currentIndex = 0;
    if (activeIndex === 0) setDisplayedText0('');
    if (activeIndex === 1) setDisplayedText1('_');
    if (activeIndex === 2) {
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
    typeText();
  }, [activeIndex]);

  const renderHighlightedText = (text: string, isParagraphTwo: boolean = false) => {
    if (!isParagraphTwo) return text;
    
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className={`transition-all duration-300 ${
          index === highlightedWordIndex ? 'bg-primary-200 text-primary-900' : 'text-gray-800'
        }`}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="w-full min-h-[32rem] flex items-center justify-center bg-white p-8">
      <div className="max-w-4xl w-full space-y-6 relative">
        {/* Mode indicator */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="group relative flex items-center gap-4 px-6 py-3 rounded-xl bg-white shadow-lg border border-primary-100 transition-all duration-300 hover:border-primary-300">
            <span className="text-2xl">
              {activeIndex === 0 ? "✍️" : activeIndex === 1 ? "⌨️" : "🎧"}
            </span>
            <div className="flex flex-col">
              <span className={`font-satoshi font-bold text-lg ${
                activeIndex === 0 ? 'text-primary-600' :
                activeIndex === 1 ? 'text-secondary-600' :
                'text-tertiary-600'
              }`}>
                {activeIndex === 0 ? "Write down" : activeIndex === 1 ? "Type" : "See & Listen"}
              </span>
              <span className="text-sm font-manrope text-gray-600">
                {activeIndex === 0 ? "Must memorize" : activeIndex === 1 ? "Easy but not intuitive" : "Intuitive"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className={`p-6 rounded-xl transition-all duration-300 ${
            activeIndex === 0 
              ? 'bg-white shadow-lg border-2 border-primary-200' 
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <p className={`text-lg ${activeIndex === 0 ? 'font-dancing' : 'font-manrope'} leading-relaxed text-gray-800`}>
              {activeIndex === 0 ? displayedText0 : fullText0}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className={`p-6 rounded-xl transition-all duration-300 ${
            activeIndex === 1 
              ? 'bg-white shadow-lg border-2 border-secondary-200' 
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <p className="text-lg font-manrope leading-relaxed text-gray-800">
              {activeIndex === 1 ? displayedText1 : fullText1}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className={`p-6 rounded-xl transition-all duration-300 ${
            activeIndex === 2 
              ? 'bg-white shadow-lg border-2 border-tertiary-200' 
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <p className="text-lg font-manrope leading-relaxed">
              {renderHighlightedText(fullText2, true)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextContent;