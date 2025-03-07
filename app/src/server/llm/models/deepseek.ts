import OpenAI from 'openai';
import {
  GENERATE_EXERCISE_PROMPT,
  GENERATE_SUMMARY_PROMPT,
  GENERATE_EXAM_PROMPT,
  GENERATE_STUDY_METHOD_TAGS_PROMPT,
  GENERATE_COURSE_PROMPT,
} from '../prompts';
import { HttpError } from 'wasp/server';
import { SensoryMode } from '../../../shared/types';
import { BaseLLMService, LLMResponse } from './base';

export class DeepSeekService extends BaseLLMService {
  private deepseekClient!: OpenAI;

  constructor() {
    super();
    this.setupClient();
  }

  protected setupClient(): void {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new HttpError(500, 'DeepSeek API key is not set');
    }
    this.deepseekClient = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' });
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
      const deepseekResponse = await this.deepseekClient.chat.completions.create({
        model: 'deepseek-chat',
        ...GENERATE_EXERCISE_PROMPT({
          content: exerciseRawContent,
          priorKnowledge,
          length: exerciseLength,
          level: difficultyLevel,
          pre_prompt: prePrompt,
          post_prompt: postPrompt,
        }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const exerciseContent = deepseekResponse.choices[0]?.message?.content || '';

      if (!exerciseContent) {
        throw new Error('Exercise content missing from response.');
      }

      const tokenUsage = deepseekResponse.usage?.total_tokens || 0;
      return { success: true, data: exerciseContent, usage: tokenUsage };
    }, 'generateExercise');
  }

  async generateSummary(lectureContent: string, modelName: string, maxTokens: number): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseekResponse = await this.deepseekClient.chat.completions.create({
        model: 'deepseek-chat',
        ...GENERATE_SUMMARY_PROMPT({ content: lectureContent }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const summaryContent = deepseekResponse.choices[0]?.message?.content || '';
      const summaryData = JSON.parse(summaryContent);

      if (!summaryData?.paragraphSummary) {
        throw new Error('Paragraph summary missing from response JSON.');
      }

      const tokenUsage = deepseekResponse.usage?.total_tokens || 0;
      return { success: true, data: summaryData, usage: tokenUsage };
    }, 'generateSummary');
  }

  async generateQuestions(lectureContent: string, modelName: string, maxTokens: number): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseekResponse = await this.deepseekClient.chat.completions.create({
        model: 'deepseek-chat',
        ...GENERATE_EXAM_PROMPT({ content: lectureContent }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const questionsContent = deepseekResponse.choices[0]?.message?.content || '';
      const questionsData = JSON.parse(questionsContent);

      if (!questionsData?.questions || !Array.isArray(questionsData.questions)) {
        throw new Error('Invalid questions data. Missing "questions" array.');
      }

      const tokenUsage = deepseekResponse.usage?.total_tokens || 0;
      return { success: true, data: questionsData, usage: tokenUsage };
    }, 'generateQuestions');
  }

  async generateCourse(syllabusContent: string, modelName: string, maxTokens: number): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseekResponse = await this.deepseekClient.chat.completions.create({
        model: 'deepseek-chat',
        ...GENERATE_COURSE_PROMPT({ content: syllabusContent }),
        temperature: 0.3,
        max_tokens: 8192,
      });

      const courseContent = deepseekResponse.choices[0]?.message?.content || '';
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

      const tokenUsage = deepseekResponse.usage?.total_tokens || 0;
      return { success: true, data: courseData, usage: tokenUsage };
    }, 'generateCourse');
  }

  async generateComplexity(
    lectureContent: string,
    modelName: string,
    maxTokens: number,
    sensoryModes: SensoryMode[]
  ): Promise<LLMResponse> {
    if (lectureContent.length === 0) {
      return { success: true, data: { taggedText: '' }, usage: 0 };
    }
    return this.withRetry(async () => {
      const deepseekResponse = await this.deepseekClient.chat.completions.create({
        model: 'deepseek-chat',
        ...GENERATE_STUDY_METHOD_TAGS_PROMPT({
          content: lectureContent,
          sensoryModes: sensoryModes,
        }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const complexityContent = deepseekResponse.choices[0]?.message?.content || '';
      if (!complexityContent) {
        throw new Error('Tagged text missing from complexity data.');
      }

      const tokenUsage = deepseekResponse.usage?.total_tokens || 0;
      return { success: true, data: complexityContent, usage: tokenUsage };
    }, 'generateComplexity');
  }
}
