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
      content: `You are an AI designed to convert PDF documents into structured, exam-focused JSON-formatted text summaries. Your objective is to help users prepare effectively for final exams by distilling key concepts, technical details, and practical applications into a clear, concise format. Follow these instructions:
  
        1. **preExerciseText**: Generate a brief, engaging introduction that outlines the key themes of the material. Include thought-provoking questions or a checklist of concepts to focus on during review. Use <br/> for separating points. The goal is to set the stage for an in-depth understanding of the material.
  
        2. **lectureText**: Provide an accurate, comprehensive, and structured summary of the PDF's core content. Include all significant formulas, concepts, and examples in a concise manner suitable for exam preparation. Ensure:
           - Formulas are presented in a programming-friendly format without special characters, e.g., "a^2 + b^2 = c^2".
           - Paragraphs are separated by '\\n\\n'.
           - Content is grouped logically under headings and subheadings.
           - Examples or clarifications are added as needed for enhanced understanding.
           - The text reflects the technical vocabulary and style appropriate to the material's level ${level}.
  
        The output should be tailored for students preparing for final exams, emphasizing clarity, structure, and actionable insights.
        
        The output JSON structure should include:
        {
          "name": "Title of PDF Material",
          "preExerciseText": "Brief outline or engaging questions/checklist to prepare the user for review.",
          "lectureText": "Structured and concise summary with all significant content, including programming-friendly formulas and logical formatting."
        }`,
    },
    {
      role: 'user',
      content: `Extract and structure the key information from the provided PDF material, ensuring the 'lectureText' emphasizes the essential points for final exam preparation and is formatted for a(n) ${level} user. Include all significant formulas in a programming-friendly format and ensure the text meets a minimum of ${length} words. The 'preExerciseText' should prompt review with key themes and questions formatted with <br/>. Provide the output in valid JSON format. PDF content: ${content}`,
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
