import OpenAI from 'openai';
import { GENERATE_EXERCISE_PROMPT, GENERATE_SUMMARY_PROMPT, GENERATE_EXAM_PROMPT, GENERATE_STUDY_METHOD_TAGS_PROMPT } from '../prompts/exercise';
import { GENERATE_COURSE_PROMPT } from '../prompts/course';
import { retry } from './utils';
import { HttpError } from 'wasp/server';
import { reportToAdmin } from '../../actions/utils';
import { TEMPERATURE } from '../../../shared/constants';
import {
  summaryFormat,
  questionsFormat,
  complexityFormat
} from '../response_formats/responseFormat';

function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new HttpError(500, 'OpenAI API key is not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const openai = setupOpenAI();

interface OpenAIResponse {
  success: boolean;
  data?: any;
  usage?: number;
  message?: string;
}

export class OpenAIService {
  // 1) Generate main exercise
  static async generateExercise(
    content: string,
    priorKnowledge: string,
    length: string,
    level: string,
    model: string,
    maxTokens: number,
    pre_prompt: string,
    post_prompt: string
  ): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        // We only use them if needed. If you want the final text to reflect modes, you'd add them to the prompt call:
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_EXERCISE_PROMPT({
            content,
            priorKnowledge,
            length,
            level,
            pre_prompt,
            post_prompt,
          }),
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: { type: 'text' },
        });

        const responseContent = response.choices[0]?.message?.content || '';

        if (!responseContent) {
          throw new Error('lectureContent missing from response.');
        }

        const exerciseJsonUsage = response.usage?.total_tokens || 0;
        return { success: true, data: responseContent, usage: exerciseJsonUsage };
      } catch (error: any) {
        await reportToAdmin(`Error in generateExercise: ${error.message}`);
        console.error('Error in generateExercise:', error);
        throw error;
      }
    });
  }

  // 2) Generate paragraph summary
  static async generateSummary(
    lectureContent: string,
    model: string,
    maxTokens: number
  ): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_SUMMARY_PROMPT({ content: lectureContent }),
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: summaryFormat,
        });

        const summaryContent = response.choices[0]?.message?.content || '';
        const summaryJson = JSON.parse(summaryContent);

        if (!summaryJson?.paragraphSummary) {
          throw new Error('paragraphSummary missing from summary JSON.');
        }

        const summaryJsonUsage = response.usage?.total_tokens || 0;
        return { success: true, data: summaryJson, usage: summaryJsonUsage };
      } catch (error: any) {
        await reportToAdmin(`Error in generateSummary: ${error.message}`);
        console.error('Error in generateSummary:', error);
        throw error;
      }
    });
  }

  // 3) Generate MC questions
  static async generateQuestions(
    lectureContent: string,
    model: string,
    maxTokens: number
  ): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_EXAM_PROMPT({ content: lectureContent }),
          response_format: questionsFormat,
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0.1,
          presence_penalty: 0,
        });

        const responseContent = response.choices[0]?.message?.content || '';
        const questionsJson = JSON.parse(responseContent);

        if (!questionsJson?.questions || !Array.isArray(questionsJson.questions)) {
          throw new Error('Invalid questions JSON. Missing "questions" array.');
        }

        const totalTokens = response.usage?.total_tokens || 0;
        return { success: true, data: questionsJson, usage: totalTokens };
      } catch (error: any) {
        await reportToAdmin(`Error in generateQuestions: ${error.message}`);
        console.error('Error in generateQuestions:', error);
        throw error;
      }
    });
  }

  // 4) Generate course structure
  static async generateCourse(
    syllabusContent: string,
    model: string,
    maxTokens: number
  ): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_COURSE_PROMPT({ content: syllabusContent }),
          temperature: 0.3,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: { type: 'json_object' },
        });

        const responseContent = response.choices[0]?.message?.content || '';
        const jsonContent = JSON.parse(responseContent);

        if (!jsonContent?.courseName) {
          throw new Error('courseName missing from response.');
        }
        if (!jsonContent?.courseDescription) {
          throw new Error('courseDescription missing from response.');
        }
        if (!Array.isArray(jsonContent.topics)) {
          throw new Error('topics missing from response.');
        }

        const totalTokens = response.usage?.total_tokens || 0;
        return { success: true, data: jsonContent, usage: totalTokens };
      } catch (error: any) {
        await reportToAdmin(`Error in generateCourse: ${error.message}`);
        console.error('Error in generateCourse:', error);
        throw error;
      }
    });
  }

  // 5) Generate complexity tags with user-selected modes
  static async generateComplexity(
    lectureContent: string,
    model: string,
    maxTokens: number,
    sensoryModes: ('listen' | 'type' | 'write')[]
  ): Promise<OpenAIResponse> {
    if (lectureContent.length === 0) {
      return { success: true, data: { taggedText: '' }, usage: 0 };
    }
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_STUDY_METHOD_TAGS_PROMPT({
            content: lectureContent,
            sensoryModes: sensoryModes,
          }),
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: complexityFormat,
        });

        const responseContent = response.choices[0]?.message?.content || '';
        const complexityJson = JSON.parse(responseContent);
        if (!complexityJson?.taggedText) {
          throw new Error('No "taggedText" found in complexity JSON.');
        }

        const totalTokens = response.usage?.total_tokens || 0;
        return { success: true, data: complexityJson, usage: totalTokens };
      } catch (error: any) {
        await reportToAdmin(`Error in generateComplexity: ${error.message}`);
        console.error('Error in generateComplexity:', error);
        throw error;
      }
    });
  }
}