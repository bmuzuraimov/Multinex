import OpenAI from 'openai';
import {
  generateExercisePrompt,
  generateSummaryPrompt,
  generateExamPrompt,
  generateStudyMethodTagsPrompt,
  generateCoursePrompt,
} from '../prompts';
import { MAX_TOKENS } from '../../../shared/constants';
import { HttpError } from 'wasp/server';
import { TEMPERATURE } from '../../../shared/constants';
import { SensoryMode } from '../../../shared/types';
import { BaseLLMService, LLMResponse } from './base';

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
    prePrompt: string,
    postPrompt: string
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        ...generateExercisePrompt({
          content: exerciseRawContent,
          prior_knowledge: priorKnowledge,
          length: exerciseLength,
          level: difficultyLevel,
          pre_prompt: prePrompt,
          post_prompt: postPrompt,
        }),
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      const exerciseContent = openaiResponse.choices[0]?.message?.content || '';

      if (!exerciseContent) {
        throw new Error('Exercise content missing from response.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: exerciseContent, usage: tokenUsage };
    }, 'generateExercise');
  }

  async generateSummary(lectureContent: string, modelName: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        ...generateSummaryPrompt({ content: lectureContent }),
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
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

  async generateQuestions(lectureContent: string, modelName: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        ...generateExamPrompt({ content: lectureContent }),
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
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

  async generateCourse(syllabusContent: string, modelName: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        ...generateCoursePrompt({ content: syllabusContent }),
        temperature: 0.3,
        max_tokens: MAX_TOKENS,
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
    sensoryModes: SensoryMode[]
  ): Promise<LLMResponse> {
    if (lectureContent.length === 0) {
      return { success: true, data: { taggedText: '' }, usage: 0 };
    }
    return this.withRetry(async () => {
      const openaiResponse = await this.openaiClient.chat.completions.create({
        model: modelName,
        ...generateStudyMethodTagsPrompt({
          content: lectureContent,
          sensory_modes: sensoryModes,
        }),
        temperature: 0.2,
        max_tokens: MAX_TOKENS,
      });

      const complexityContent = openaiResponse.choices[0]?.message?.content || '';
      if (!complexityContent) {
        throw new Error('Tagged text missing from complexity data.');
      }

      const tokenUsage = openaiResponse.usage?.total_tokens || 0;
      return { success: true, data: complexityContent, usage: tokenUsage };
    }, 'generateComplexity');
  }
}
