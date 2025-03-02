import fs from 'fs';

interface Prompt {
  role: 'system' | 'user';
  content: string;
}

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
}): {
  role: 'system' | 'user';
  content: string;
}[] => {
  const prompt = `${pre_prompt}

  Document content: ${content}

  You must follow these rules:
  - Separate sections with "\n\n" and paragraphs with "\n".
  ${priorKnowledge.length > 0 ? `- Exclude these topics: ${priorKnowledge}.\n` : ''}.
  ${level !== 'Auto' ? `- Technical depth: Match the user's level (${level}).\n` : ''}.
  ${length !== 'Auto' ? `- Minimum length: ${length} words.\n` : ''}.
  
  ${post_prompt}`;

  console.log('prompt', prompt);
  return [
    {
      role: 'user',
      content: prompt,
    },
  ];
};

export const GENERATE_SUMMARY_PROMPT = ({
  content,
}: {
  content: string;
}): {
  role: 'system' | 'user';
  content: string;
}[] => {
  return [
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
  ];
};

/**
 * Dynamically generate the "study method tags" prompt so it only includes
 * instructions for the modes that the user actually selected.
 */
export const GENERATE_STUDY_METHOD_TAGS_PROMPT = ({
  content,
  sensoryModes,
}: {
  content: string;
  sensoryModes: string[];
}): { role: 'system' | 'user'; content: string }[] => {
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

  return [
    {
      role: 'system',
      content: `You are an AI assistant specialized in analyzing text complexity and learning methods. Your task is to analyze the given text and tag different segments based on their learning importance and recommended study method. IMPORTANT: You must not modify or rephrase any of the original text - only add a single tag around each segment.

      Tag each segment with exactly one of these tags, ensuring proper spacing between tags:
      
      ${instructions}
      Return the exact same text with a single appropriate learning method tag around each segment. Add a newline between different tagged segments. Do not use nested tags. Do not change any words or formatting - only add tags with proper spacing between them.`,
    },
    {
      role: 'user',
      content: `Please analyze the following text and add a single appropriate learning method tag around each segment, ensuring proper spacing and newlines between different tagged segments:
      ${content}`,
    },
  ];
};

export const GENERATE_EXAM_PROMPT = ({
  content,
}: {
  content: string;
}): {
  role: 'system' | 'user';
  content: string;
}[] => {
  // Define the system prompt for generating MC questions
  const systemPrompt = `You are an AI assistant specialized in creating final exam-quality multiple-choice questions (MCQs). Your task is to design comprehensive and challenging MCQs based on the provided lecture text, emphasizing critical concepts, formulas, and key details. These questions should help students test their understanding and recall of essential material.

  Please follow these guidelines:
  
  1. **Question Design**:
     - Questions should cover all major topics and subtopics in the lecture text.
     - Include a mix of conceptual, applied, and formula-based questions.
     - Ensure questions test comprehension, application, and recall of important ideas and details.
  
  2. **Options**:
     - Provide four options (A, B, C, and D) for each question.
     - Ensure only **one correct answer** per question, with plausible distractors for incorrect options.
  
  3. **Formatting**:
     - Structure the output as a valid JSON object in the following format:
       {
         "questions": [
           {
             "text": "Question text here...",
             "options": [
               { "text": "Option A text here...", "isCorrect": false },
               { "text": "Option B text here...", "isCorrect": true },
               { "text": "Option C text here...", "isCorrect": false },
               { "text": "Option D text here...", "isCorrect": false }
             ]
           },
           // additional questions
         ]
       }
  
  4. **Question Variety**:
     - Include questions that require analysis, such as "Which statement best explains...?"
     - Add computational questions when relevant, e.g., "What is the value of...?"
     - Use "EXCEPT" questions to test nuanced understanding, e.g., "All of the following are true EXCEPT..."
     - Ensure some questions focus on definitions, key concepts, and interpretations.
  
  5. **Avoid Extraneous Information**:
     - Do not include any explanatory text outside the JSON structure.
     - Avoid trivial or overly simple questions.
  
  **Important Notes**:
  - Questions should challenge the user as if they were part of a final exam.
  - Ensure all content is accurate and error-free.

  ---
  Lecture Text:
  ${content}
  `;

  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content:
        'Please generate a set of final exam-style multiple-choice questions based on the provided lecture text.',
    },
  ];
};
