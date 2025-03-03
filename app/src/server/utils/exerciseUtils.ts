type FormattedEssaySection = {
  mode: 'listen' | 'type' | 'write';
  text: string[];
};

export function preprocessEssay(rawEssay: string) {
  // Parse the essay into formatted sections
  // wrap newlines in <type> tags
  const matches = Array.from(rawEssay.matchAll(/<(listen|write|type)>([\s\S]*?)<\/\1>/g));
  const formattedEssay = matches.map(match => {
    const [fullMatch, mode, content] = match;
    // Get the character immediately after the matched section.
    const endChar = rawEssay.charAt(match.index! + fullMatch.length);

    if (mode === 'type') {
      // For type sections, keep character-level granularity.
      const chars = Array.from(content);
      if (endChar === '\n' || endChar === ' ') {
        // Instead of appending to the last element, add as a separate item.
        chars.push(endChar);
      }
      // Add newline after type sections
      if (endChar !== '\n') {
        chars.push('\n');
      }
      return {
        mode: 'type',
        text: chars
      };
    } else if (mode === 'listen') {
      // For listen sections, keep word-level granularity.
      // Split the content by whitespace, filtering out empty strings.
      let words = content.split(/(\s+)/).filter(word => word !== '');
      if (endChar === '\n' || endChar === ' ') {
        // Push the trailing character as a separate element.
        words.push(endChar);
      }
      return {
        mode: 'listen',
        text: words
      };
    } else { // mode === 'write'
      // For write sections, treat the content as a whole but separate the end character.
      let textArray = [content];
      if (endChar === '\n' || endChar === ' ') {
        textArray.push(endChar);
      }
      return {
        mode: 'write',
        text: textArray
      };
    }
  });

  // Create the final essay string by joining all sections
  const essay = formattedEssay.map(section => section.text.join('')).join('');
  return { 
    essay, 
    formattedEssay: formattedEssay as FormattedEssaySection[] 
  };
}
