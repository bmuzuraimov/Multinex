import { questionsFormat } from '../response_formats';

export const GENERATE_EXAM_PROMPT = ({
    content,
  }: {
    content: string;
  }): { messages: { role: 'system' | 'user'; content: string }[]; response_format: any } => {
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
  
    return {
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content:
            'Please generate a set of final exam-style multiple-choice questions based on the provided lecture text.',
        },
      ],
      response_format: questionsFormat
    };
  };