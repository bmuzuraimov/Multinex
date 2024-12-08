// import Anthropic from '@anthropic-ai/sdk';
// import { GENERATE_EXERCISE_PROMPT, GENERATE_SUMMARY_PROMPT, GENERATE_EXAM_PROMPT } from '../prompts/exercise';
// import { GENERATE_COURSE_PROMPT } from '../prompts/course';
// import { retry } from './utils';
// import { HttpError } from 'wasp/server';
// import { reportToAdmin } from '../actions/utils';
// import { TEMPERATURE } from '../../shared/constants';
// import fetch from 'node-fetch';

// function setupAnthropic() {
//   if (!process.env.ANTHROPIC_API_KEY) {
//     throw new HttpError(500, 'Anthropic API key is not set');
//   }
//   return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
// }

// const anthropic = setupAnthropic();

// interface AnthropicResponse {
//   success: boolean;
//   data?: any;
//   usage?: number;
//   message?: string;
// }

// async function fetchAndConvertFile(fileUrl: string): Promise<string> {
//   try {
//     const response = await fetch(fileUrl);
//     const arrayBuffer = await response.arrayBuffer();
//     return Buffer.from(arrayBuffer).toString('base64');
//   } catch (error: any) {
//     throw new Error(`Error fetching file: ${error.message}`);
//   }
// }

// export class AnthropicService {
//   static async generateExercise(
//     content: string,
//     length: string,
//     level: string,
//     model: string,
//     maxTokens: number,
//     fileUrl?: string
//   ): Promise<AnthropicResponse> {
//     return retry(async () => {
//       try {
//         const messageContent: any[] = [];

//         if (fileUrl) {
//           const fileBase64 = await fetchAndConvertFile(fileUrl);
//           messageContent.push({
//             type: 'document',
//             source: {
//               media_type: 'application/pdf',
//               type: 'base64',
//               data: fileBase64,
//             },
//           });
//         }

//         messageContent.push({
//           type: 'text',
//           text: GENERATE_EXERCISE_PROMPT({ content, length, level })
//             .map((msg) => msg.content)
//             .join('\n'),
//         });

//         const response = await anthropic.beta.messages.create({
//           model: model || 'claude-3-sonnet-20240229',
//           max_tokens: maxTokens,
//           temperature: TEMPERATURE,
//           messages: [
//             {
//               role: 'user',
//               content: messageContent,
//             },
//           ],
//           system: 'Respond using JSON format.'
//         });

//         const responseContent = response.content[0] || '';
//         const exerciseJson = JSON.parse(responseContent);

//         if (!exerciseJson?.lectureText) {
//           throw new Error('lectureText is missing from the response.');
//         }

//         return { success: true, data: exerciseJson };
//       } catch (error: any) {
//         await reportToAdmin(`Error in generateExercise: ${error.message}`);
//         console.error('Error in generateExercise:', error);
//         throw error;
//       }
//     });
//   }

//   static async generateSummary(
//     lectureText: string,
//     model: string,
//     maxTokens: number
//   ): Promise<AnthropicResponse> {
//     return retry(async () => {
//       try {
//         const response = await anthropic.beta.messages.create({
//           model: model || 'claude-3-sonnet-20240229',
//           max_tokens: maxTokens,
//           temperature: TEMPERATURE,
//           messages: [
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'text',
//                   text: GENERATE_SUMMARY_PROMPT({ content: lectureText })
//                     .map((msg) => msg.content)
//                     .join('\n'),
//                 },
//               ],
//             },
//           ],
//           system: 'Respond using JSON format.'
//         });

//         const summaryContent = response.content[0]?.text || '';
//         const summaryJson = JSON.parse(summaryContent);

//         if (!summaryJson?.paragraphSummary) {
//           throw new Error('paragraphSummary is missing from the response.');
//         }

//         return { success: true, data: summaryJson };
//       } catch (error: any) {
//         await reportToAdmin(`Error in generateSummary: ${error.message}`);
//         console.error('Error in generateSummary:', error);
//         throw error;
//       }
//     });
//   }

//   static async generateQuestions(
//     lectureText: string,
//     model: string,
//     maxTokens: number
//   ): Promise<AnthropicResponse> {
//     return retry(async () => {
//       try {
//         const response = await anthropic.beta.messages.create({
//           model: model || 'claude-3-sonnet-20240229',
//           max_tokens: maxTokens,
//           temperature: TEMPERATURE,
//           messages: [
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'text',
//                   text: GENERATE_EXAM_PROMPT({ content: lectureText })
//                     .map((msg) => msg.content)
//                     .join('\n'),
//                 },
//               ],
//             },
//           ],
//           system: 'Respond using JSON format.'
//         });

//         const responseContent = response.content[0]?.text || '';
//         const questionsJson = JSON.parse(responseContent);

//         if (!questionsJson?.questions || !Array.isArray(questionsJson.questions) || questionsJson.questions.length === 0) {
//           throw new Error('Invalid JSON structure: "questions" array is missing or empty.');
//         }

//         return { success: true, data: questionsJson };
//       } catch (error: any) {
//         await reportToAdmin(`Error in generateQuestions: ${error.message}`);
//         console.error('Error in generateQuestions:', error);
//         throw error;
//       }
//     });
//   }

//   static async generateCourse(
//     syllabusContent: string,
//     model: string,
//     maxTokens: number
//   ): Promise<AnthropicResponse> {
//     return retry(async () => {
//       try {
//         const response = await anthropic.beta.messages.create({
//           model: model || 'claude-3-sonnet-20240229',
//           max_tokens: maxTokens,
//           temperature: 0.3,
//           messages: [
//             {
//               role: 'user',
//               content: [
//                 {
//                   type: 'text',
//                   text: GENERATE_COURSE_PROMPT({ content: syllabusContent })
//                     .map((msg) => msg.content)
//                     .join('\n'),
//                 },
//               ],
//             },
//           ],
//           system: 'Respond using JSON format.'
//         });

//         const responseContent = response.content[0]?.text || '';
//         const jsonContent = JSON.parse(responseContent);

//         if (!jsonContent?.courseName) {
//           throw new Error('courseName is missing from the response.');
//         }
//         if (!jsonContent?.courseDescription) {
//           throw new Error('courseDescription is missing from the response.');
//         }
//         if (!Array.isArray(jsonContent.topics)) {
//           throw new Error('topics array is missing from the response.');
//         }

//         return { success: true, data: jsonContent };
//       } catch (error: any) {
//         await reportToAdmin(`Error in generateCourse: ${error.message}`);
//         console.error('Error in generateCourse:', error);
//         throw error;
//       }
//     });
//   }
// }
