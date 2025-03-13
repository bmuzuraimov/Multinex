import { courseFormat } from '../response_formats';

interface CoursePromptParams {
  content: string;
}

interface MessageFormat {
  role: 'system' | 'user';
  content: string;
}

const SYSTEM_PROMPT = `You are an AI tasked with converting a syllabus into a structured JSON format. Your output will have three main sections:

1. courseName: This should be the title of the course with maximum 3 words.

2. courseDescription: This should be a description of the course.

3. topics: This should be an array of topic names extracted from the syllabus in order with 1-2 words.

The final output must be a valid JSON structure, formatted as follows:
{
 "courseName": "Title of Course",
 "courseDescription": "Brief description of the course.",
 "topics": [
 "Topic 1",
 "Topic 2",
 ...
 ]
}`;

const USER_PROMPT = (syllabus_content: string): string => 
  `Please convert the following syllabus into a structured JSON format. The 'courseName' should be the title of the course. The 'courseDescription' should be a description and outcome of the course. 'topics' should be an array of topic names extracted from the syllabus. Ensure the output is in valid JSON format. Syllabus content: ${syllabus_content}`;

export const generateCoursePrompt = ({
  content,
}: CoursePromptParams): { messages: MessageFormat[]; response_format: any } => {
  return {
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: USER_PROMPT(content)
      }
    ],
    response_format: courseFormat,
  };
};
