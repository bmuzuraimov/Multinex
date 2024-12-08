interface Prompt {
  role: 'system' | 'user';
  content: string;
}

export const GENERATE_EXERCISE_PROMPT = ({
  level,
  length,
  content,
}: {
  level: string;
  length: string;
  content: string;
}): Prompt[] => {
  return [
    {
      role: 'system',
      content: `You are an AI tasked with converting PDF documents into structured, educational JSON-formatted text for typing exercises. Ensure the output is in English, tailored to the content's complexity level specified by the user. Your tasks include:

          1. preExerciseText: Generate an engaging outline or series of thought-provoking questions (separated by <br/>) that highlight the main themes and prepare the user for the content, especially focusing on any important formulas. The lectureText should not be formatted (raw text).
          
          2. lectureText: Accurately transcribe and clearly present the core content from the PDF, including all significant formulas and technical details. All formulas must be converted to a programming-friendly format using plain text without special characters, suitable for implementation in a programming language. For example, instead of "a² + b² = c²", write "a^2 + b^2 = c^2". Strive for a balance between detailed explanation and concise summarization, using appropriate technical vocabulary and style to match the original document. Use '\\n\\n' for paragraph breaks and include necessary clarifications to make technical content accessible at different complexity levels ('beginner', 'intermediate', 'advanced').

          The output JSON structure should include:
          {
            "name": "Title of PDF Material",
            "preExerciseText": "Useful outline or engaging questions.",
            "lectureText": "Accurate and comprehensive representation of the core content, including formulas written in a programming-friendly format, with adjusted complexity."
          }`,
    },
    {
      role: 'user',
      content: `Extract essential information from the provided PDF material, ensuring the 'lectureText' thoroughly includes and explains all significant formulas in a programming-friendly format without special characters, suitable for a(n) ${level} user, and meets a minimum of ${length} words. Maintain the technical style of the original document and use '\\n\\n' for paragraph breaks. The 'preExerciseText' should prompt in-depth reflection on the content, formatted with <br/>. Ensure the output is in valid JSON format. PDF content: ${content}`,
    },
  ];
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

export const GENERATE_EXAM_PROMPT = ({ content }: { content: string }): Prompt[] => {
  // Define the system prompt for generating MC questions
  const systemPrompt = `You are an AI assistant specialized in creating high-quality educational content. Your task is to generate a comprehensive set of multiple-choice questions based on the provided lecture text, which should mirror the complexity and coverage expected in a final exam.

    Please adhere to these guidelines:
    
    1. Generate a diverse set of multiple-choice questions that comprehensively cover all key topics and important points from the lecture text.
    2. Each question should have four options, labeled A, B, C, and D.
    3. Only one option per question should be marked as correct.
    4. Questions must be clear, specific, and directly related to significant concepts within the lecture content.
    5. Format the output as a valid JSON object:
    
    {
      "questions": [
        {
          "text": "Question 1 text...",
          "options": [
            { "text": "Option A text...", "isCorrect": false },
            { "text": "Option B text...", "isCorrect": true },
            { "text": "Option C text...", "isCorrect": false },
            { "text": "Option D text...", "isCorrect": false }
          ]
        },
        // additional questions
      ]
    }
    
    **Important:** Avoid including any extraneous text. Ensure that the JSON is well-structured and error-free.
    
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
      content: 'Please generate multiple-choice questions based on the lecture text provided.',
    },
  ];
};
