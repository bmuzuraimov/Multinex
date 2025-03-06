import OpenAI from 'openai';
import { GENERATE_EXERCISE_PROMPT, GENERATE_SUMMARY_PROMPT, GENERATE_EXAM_PROMPT, GENERATE_STUDY_METHOD_TAGS_PROMPT } from '../prompts/exercise';
import { GENERATE_COURSE_PROMPT } from '../prompts/course';
import { HttpError } from 'wasp/server';
import { TEMPERATURE } from '../../../shared/constants';
import { BaseLLMService, LLMResponse } from './baseLLMService';
import {
  summaryFormat,
  questionsFormat,
  complexityFormat
} from '../response_formats/responseFormat';

export class OpenAIService extends BaseLLMService {
  private openaiClient!: OpenAI;

  constructor() {
    super();
    this.setupClient();
  }

  protected setupClient(): void {
    if (!process.env.OPENAI_API_KEY) {
      throw new HttpError(500, 'OpenAI API key is not set');
    }
    this.openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateExercise(
    exerciseRawContent: string,
    priorKnowledge: string,
    exerciseLength: string,
    difficultyLevel: string,
    modelName: string,
    maxTokens: number,
    prePrompt: string,
    postPrompt: string
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        messages: GENERATE_EXERCISE_PROMPT({
          content: exerciseRawContent,
          priorKnowledge,
          length: exerciseLength,
          level: difficultyLevel,
          pre_prompt: prePrompt,
          post_prompt: postPrompt,
        }),
        temperature: TEMPERATURE,
        max_tokens: maxTokens,
        response_format: { type: 'text' },
      });

      const exerciseContent = openaiResponse.choices[0]?.message?.content || '';

      if (!exerciseContent) {
        throw new Error('Exercise content missing from response.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: exerciseContent, usage: tokenUsage };
    }, 'generateExercise');
  }

  async generateSummary(
    lectureContent: string,
    modelName: string,
    maxTokens: number
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        messages: GENERATE_SUMMARY_PROMPT({ content: lectureContent }),
        temperature: TEMPERATURE,
        max_tokens: maxTokens,
        response_format: summaryFormat,
      });

      const summaryContent = openaiResponse.choices[0]?.message?.content || '';
      const summaryData = JSON.parse(summaryContent);

      if (!summaryData?.paragraphSummary) {
        throw new Error('Paragraph summary missing from response JSON.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: summaryData, usage: tokenUsage };
    }, 'generateSummary');
  }

  async generateQuestions(
    lectureContent: string,
    modelName: string,
    maxTokens: number
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        messages: GENERATE_EXAM_PROMPT({ content: lectureContent }),
        response_format: questionsFormat,
        temperature: TEMPERATURE,
        max_tokens: maxTokens,
      });

      const questionsContent = openaiResponse.choices[0]?.message?.content || '';
      const questionsData = JSON.parse(questionsContent);

      if (!questionsData?.questions || !Array.isArray(questionsData.questions)) {
        throw new Error('Invalid questions data. Missing "questions" array.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: questionsData, usage: tokenUsage };
    }, 'generateQuestions');
  }

  async generateCourse(
    syllabusContent: string,
    modelName: string,
    maxTokens: number
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        messages: GENERATE_COURSE_PROMPT({ content: syllabusContent }),
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      });

      const courseContent = openaiResponse.choices[0]?.message?.content || '';
      const courseData = JSON.parse(courseContent);

      if (!courseData?.courseName) {
        throw new Error('Course name missing from response.');
      }
      if (!courseData?.courseDescription) {
        throw new Error('Course description missing from response.');
      }
      if (!Array.isArray(courseData.topics)) {
        throw new Error('Course topics missing from response.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: courseData, usage: tokenUsage };
    }, 'generateCourse');
  }

  async generateComplexity(
    lectureContent: string,
    modelName: string,
    maxTokens: number,
    sensoryModes: ('listen' | 'type' | 'write')[]
  ): Promise<LLMResponse> {
    if (lectureContent.length === 0) {
      return { success: true, data: { taggedText: '' }, usage: 0 };
    }
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        messages: GENERATE_STUDY_METHOD_TAGS_PROMPT({
          content: lectureContent,
          sensoryModes: sensoryModes,
        }),
        temperature: TEMPERATURE,
        max_tokens: maxTokens,
        response_format: complexityFormat,
      });

      const complexityContent = openaiResponse.choices[0]?.message?.content || '';
      const complexityData = JSON.parse(complexityContent);
      if (!complexityData?.taggedText) {
        throw new Error('Tagged text missing from complexity data.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: complexityData, usage: tokenUsage };
    }, 'generateComplexity');
  }
}