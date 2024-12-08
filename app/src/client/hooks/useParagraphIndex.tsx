import { useMemo } from 'react';

const useParagraphIndex = (text: string, charIndex: number) => {
    return useMemo(() => {
      // Split the text into an array of paragraphs
      const paragraphs = text.split(/\n\n/);
      // Initialize variables to store the cumulative character count and word index
      let cumulativeCharCount = 0;

      // Iterate over the array of paragraphs
      for (let i = 0; i < paragraphs.length; i++) {
        // Add the length of the current word + 1 for the space to the cumulative count
        cumulativeCharCount += paragraphs[i].length + 1;

        // Check if the cumulative character count surpasses the character index
        if (cumulativeCharCount > charIndex) {
          return i; // Return the current word index
        }
      }

      // Return -1 if the character index is out of bounds
      return -1;
    }, [text, charIndex]); // Depend on text and character index for memoization
  };

  export default useParagraphIndex;