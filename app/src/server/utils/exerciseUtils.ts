import { SensoryMode } from '../../shared/types';

type FormattedEssaySection = {
  mode: SensoryMode;
  text: string[];
};

export function preprocessEssay(rawEssay: string) {
  // Parse the essay into formatted sections
  // Use a regex that properly matches nested tags by counting opening/closing tags
  const matches = [];
  let pos = 0;

  while (pos < rawEssay.length) {
    const tagMatch = rawEssay.slice(pos).match(/<(listen|write|type|mermaid)>/);
    if (!tagMatch) break;
    
    const mode = tagMatch[1];
    const startPos = pos + tagMatch.index!;
    pos = startPos + tagMatch[0].length;
    
    let depth = 1;
    let contentStart = pos;
    
    // Find matching closing tag accounting for nesting
    while (pos < rawEssay.length && depth > 0) {
      const nextOpen = rawEssay.indexOf(`<${mode}>`, pos);
      const nextClose = rawEssay.indexOf(`</${mode}>`, pos);
      
      if (nextClose === -1) break; // No matching close tag
      
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + mode.length + 2;
      } else {
        depth--;
        pos = nextClose + mode.length + 3;
      }
    }
    
    if (depth === 0) {
      const content = rawEssay.slice(contentStart, pos - mode.length - 3);
      matches.push({
        index: startPos,
        groups: [rawEssay.slice(startPos, pos), mode, content]
      });
    }
  }
  
  const formattedEssay = matches.map(match => {
    const [fullMatch, mode, content] = match.groups;
    // Get all characters between this match and the next tag or end of string
    const endIndex = rawEssay.indexOf('<', match.index + fullMatch.length);
    const endChars = endIndex === -1 
      ? rawEssay.slice(match.index + fullMatch.length)
      : rawEssay.slice(match.index + fullMatch.length, endIndex);

    let text: string[];
    switch (mode) {
      case 'type':
        // For type sections, split into individual characters
        text = Array.from(content);
        if (endChars) text.push(...Array.from(endChars));
        break;
        
      case 'listen':
        // For listen sections, split by whitespace preserving spaces
        text = content.split(/(\s+)/).filter(Boolean);
        if (endChars) text.push(...endChars.split(/(\s+)/).filter(Boolean));
        break;
        
      case 'write':
        // For write and mermaid sections, keep as single chunk of content
        text = [content];
        if (endChars) text.push(...endChars.split(/(\s+)/).filter(Boolean));
        break;
      case 'mermaid':
        text = [content.trim()];
        if (endChars) text.push(...endChars.split(/(\s+)/).filter(Boolean));
        break;
      default:
        text = [content];
        break;
    }
    
    return { mode, text } as FormattedEssaySection;
  });
  // Join all sections to create final essay string
  const essay = formattedEssay.map(section => section.text.join('')).join('');
  return { essay, formattedEssay };
}
