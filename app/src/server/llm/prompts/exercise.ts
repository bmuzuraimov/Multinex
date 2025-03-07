import { exerciseFormat, complexityFormat, summaryFormat } from '../response_formats';

export const GENERATE_EXERCISE_PROMPT = ({
  priorKnowledge,
  level,
  length,
  content,
  pre_prompt,
  post_prompt,
}: {
  priorKnowledge: string;
  level: string;
  length: string;
  content: string;
  pre_prompt: string;
  post_prompt: string;
}): { messages: { role: 'system' | 'user'; content: string }[]; response_format: any } => {
  const prompt = `${pre_prompt}

  Document content: ${content}

  You must follow these rules:
  - Separate sections with "\n\n" and paragraphs with "\n".
  ${priorKnowledge.length > 0 ? `- Exclude these topics: ${priorKnowledge}.\n` : ''}.
  ${level !== 'Auto' ? `- Technical depth: Match the user's level (${level}).\n` : ''}.
  ${length !== 'Auto' ? `- Minimum length: ${length} words.\n` : ''}.
  
  ${post_prompt}`;

  return {
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: exerciseFormat,
  };
};

export const GENERATE_SUMMARY_PROMPT = ({
  content,
}: {
  content: string;
}): { messages: { role: 'system' | 'user'; content: string }[]; response_format: any } => {
  return {
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant tasked with summarizing paragraphs from a text. You will receive a 'lectureText' that consists of multiple paragraphs separated by '\\n\\n'. For each paragraph, generate a concise name with 2-3 words. Combine these summaries into a single string, separating each summary with '|'.
    The final output must be a valid JSON object in the following format:
    
    {
      "paragraphSummary": "Paragraph summary 1|Paragraph summary 2|Paragraph summary 3"
    }
    
    Do not include any additional text outside of the JSON object. Ensure that the JSON is properly formatted.`,
      },
      {
        role: 'user',
        content: `Please generate paragraph outline for the following lectureText:
    ${content}`,
      },
    ],
    response_format: summaryFormat
  };
};

export const GENERATE_STUDY_METHOD_TAGS_PROMPT = ({
  content,
  sensoryModes,
}: {
  content: string;
  sensoryModes: string[];
}): { messages: { role: 'system' | 'user'; content: string }[]; response_format: any } => {
  // Build instructions based on the selected modes.
  let instructions = '';

  // Map of mode to its instructions
  const modeInstructions = {
    write: {
      tag: 'write',
      description: 'For content that students should write down by hand:',
      examples: [
        'Critical concepts requiring deep memorization',
        'Important formulas and definitions that must be internalized',
        'Key technical terms that need to be mastered through handwriting',
      ],
    },
    type: {
      tag: 'type',
      description: 'For content that students should read and type out:',
      examples: [
        'Moderately important information',
        'Supporting details and explanations',
        'Content that is intuitive and easy to understand',
      ],
    },
    listen: {
      tag: 'listen',
      description: 'For content that students can listen to:',
      examples: [
        'Basic background information',
        'Supplementary or contextual details',
        'Content that can be absorbed through audio playback',
      ],
    },
  };

  // Build instructions string from selected modes
  sensoryModes.forEach((mode, index) => {
    const { tag, description, examples } = modeInstructions[mode as keyof typeof modeInstructions];
    instructions += `${index + 1}. <${tag}></${tag}> - ${description}\n`;
    examples.forEach((example) => {
      instructions += `   - ${example}\n`;
    });
    instructions += '\n';
  });

  return {
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant specialized in analyzing text complexity and learning methods. Your task is to analyze the given text and tag different paragraphs based on their learning importance and recommended study method. IMPORTANT: You must not modify or rephrase any of the original text - only add a single tag around each paragraph.

      Tag each segment with exactly one of these tags, ensuring proper spacing between tags:
      
      ${instructions}
      Return the exact same text with a single appropriate learning method tag around each paragraph. Add a newline between different tagged paragraphs. Do not use nested tags. Do not change any words or formatting - only add tags with proper spacing between them.`,
      },
      {
        role: 'user',
        content: `Please analyze the following text and add a single appropriate learning method tag around each paragraph, ensuring proper spacing and newlines between different tagged paragraphs:
      ${content}`,
      },
    ],
    response_format: complexityFormat
  };
};
