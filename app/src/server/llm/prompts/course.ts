import { courseFormat } from '../response_formats';

export const GENERATE_COURSE_PROMPT = ({
  content,
}: {
  content: string;
}): { messages: { role: 'system' | 'user'; content: string }[]; response_format: any } => {
  return {
    messages: [
      {
        role: 'system',
        content:
          'You are an AI tasked with converting a syllabus into a structured JSON format. Your output will have three main sections:\n\n1. courseName: This should be the title of the course with maximum 3 words.\n\n2. courseDescription: This should be a description of the course.\n\n3. topics: This should be an array of topic names extracted from the syllabus in order with 1-2 words.\n\nThe final output must be a valid JSON structure, formatted as follows:\n{\n "courseName": "Title of Course",\n "courseDescription": "Brief description of the course.",\n "topics": [\n "Topic 1",\n "Topic 2",\n ...\n ]\n}',
      },
      {
        role: 'user',
        content: `Please convert the following syllabus into a structured JSON format. The 'courseName' should be the title of the course. The 'courseDescription' should be a description and outcome of the course. 'topics' should be an array of topic names extracted from the syllabus. Ensure the output is in valid JSON format. Syllabus content: ${content}`,
      },
    ],
    response_format: courseFormat,
  };
};
