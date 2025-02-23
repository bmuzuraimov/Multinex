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
}: {
  priorKnowledge: string;
  level: string;
  length: string;
  content: string;
}): Prompt[] => {
  const prompt: Prompt[] = [
    {
      role: 'system',
      content: `You are an AI designed to convert PDF documents into structured, knowledge-focused equivalents for student learning. Focus ONLY on generating the 'lectureText' field. Follow these rules:
  
        **Core Principles**:
        - **Avoid filler phrases**: Never use sentences like "It is crucial to know..." or "This concept is important...". Only include factual, explanatory, or actionable content.
        - **Prioritize depth over summaries**: Reconstruct knowledge in a way that mirrors the original material’s depth and rigor.
        ${
          priorKnowledge.length > 0
            ? `- **Exclude prior knowledge**: Omit or condense content overlapping with: ${priorKnowledge}.`
            : ''
        }
  
        **Subtasks** (execute sequentially):
        1. **Extract Key Concepts**:
           - Identify theories, principles, and definitions.
           - For each concept, explain:  
             - *What it is* (clear definition).  
             - *How it works* (mechanism/process).  
             - *Why it matters* (significance/applications).
  
        2. **Structure Formulas/Equations**:
           - Convert formulas to programming-friendly syntax (e.g., "force = mass * acceleration").
           - For each formula:  
             - Define variables (e.g., "m = mass (kg)").  
             - Describe conditions for validity (e.g., "Assumes frictionless surfaces").  
  
        3. **Link Concepts to Concrete Examples**:
           - Provide 1-2 examples per major concept.  
           - Include:  
             - Step-by-step problem-solving (e.g., "To calculate X, first do Y...").  
             - Real-world scenarios (e.g., "Used in weather prediction to model...").

        **Formatting**:  
        - Separate sections with "\\n\\n" and paragraphs with "\\n".  
        ${level !== 'Auto' ? `- Technical depth: Match the user’s level (${level}).` : ''}
        ${length !== 'Auto' ? `- Minimum length: ${length} words.` : ''}`,
    },
    {
      role: 'user',
      content: `Generate ONLY the 'lectureText' field for student learning. Follow the subtasks and rules above. ${
        priorKnowledge.length > 0 ? `Exclude prior knowledge: ${priorKnowledge}.` : ''
      }
      
      PDF content: ${content}`,
    },
  ];
  // save prompt to file
  fs.writeFileSync('./prompt.json', JSON.stringify(prompt, null, 2));
  return prompt;
};

export const GENERATE_SUMMARY_PROMPT = ({ content }: { content: string }): Prompt[] => {
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

export const GENERATE_STUDY_METHOD_TAGS_PROMPT = ({ content }: { content: string }): Prompt[] => {
  return [
    {
      role: 'system',
      content: `You are an AI assistant specialized in analyzing text complexity and learning methods. Your task is to analyze the given text and tag different segments based on their learning importance and recommended study method. IMPORTANT: You must not modify or rephrase any of the original text - only add a single tag around each segment.

      Tag each segment with exactly one of these tags, ensuring proper spacing between tags:
      
      1. <write></write> - For content that students should write down by hand:
         - Critical concepts requiring deep memorization
         - Important formulas and definitions that must be internalized
         - Key technical terms that need to be mastered through handwriting
         
      2. <type></type> - For content that students should read and type out:
         - Moderately important information
         - Supporting details and explanations
         - Content that is intuitive and easy to understand
         
      3. <hear></hear> - For content that students can listen to:
         - Basic background information
         - Supplementary or contextual details
         - Content that can be absorbed through audio playback

      Return the exact same text with a single appropriate learning method tag around each segment. Add a newline between different tagged segments. Do not use nested tags. Do not change any words or formatting - only add tags with proper spacing between them.
      
      Example:
      Original: "The speed of light is 299,792,458 m/s. This constant is fundamental to physics."
      Tagged: 
      "<write>The speed of light is 299,792,458 m/s</write> <type>This constant is fundamental to physics</type>"`,
    },
    {
      role: 'user',
      content: `Please analyze the following text and add a single appropriate learning method tag around each segment, ensuring proper spacing and newlines between different tagged segments:
      ${content}`,
    },
  ];
};

export const GENERATE_EXAM_PROMPT = ({ content }: { content: string }): Prompt[] => {
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
