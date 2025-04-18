import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateTopicPrompt, generateExamPrompt, generateCoursePrompt } from '../prompts';
import { HttpError } from 'wasp/server';
import { TEMPERATURE, MAX_TOKENS } from '../../../shared/constants';
import { BaseLLMService, LLMResponse } from './base';

export class GeminiService extends BaseLLMService {
  private geminiClient!: GoogleGenerativeAI;

  constructor() {
    super();
    this.setupClient();
  }

  protected setupClient(): void {
    if (!process.env.GEMINI_API_KEY) {
      throw new HttpError(500, 'Gemini API key is not set');
    }
    this.geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateTopic(
    exerciseRawContent: string,
    selectedTopics: string,
    exerciseLength: string,
    difficultyLevel: string,
    modelName: string,
    prePrompt: string,
    postPrompt: string
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const model = this.geminiClient.getGenerativeModel({
        model: modelName, // Use the specified model name
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: MAX_TOKENS,
          topP: 0.95,
          topK: 10,
        },
      });

      const prompt = generateTopicPrompt({
        content: exerciseRawContent,
        selected_topics: selectedTopics,
        length: exerciseLength,
        level: difficultyLevel,
        pre_prompt: prePrompt,
        post_prompt: postPrompt,
      });

      const chatSession = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: prompt.messages[0].content }],
          },
        ],
      });

      const result = await chatSession.sendMessage('Generate exercise content');
      const exerciseContent = result.response.text();

      if (!exerciseContent) {
        throw new Error('Exercise content missing from response.');
      }

      return { success: true, data: exerciseContent, usage: 0 };
    }, 'generateTopic');
  }

  async generateQuestions(lectureContent: string, modelName: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const model = this.geminiClient.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: MAX_TOKENS,
          topP: 0.95,
          topK: 10,
        },
      });

      const prompt = generateExamPrompt({ content: lectureContent });

      const chatSession = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: prompt.messages[0].content }],
          },
        ],
      });

      const result = await chatSession.sendMessage('Generate questions');
      const questionsContent = result.response.text();

      try {
        const questionsData = JSON.parse(questionsContent);

        if (!questionsData?.questions || !Array.isArray(questionsData.questions)) {
          throw new Error('Invalid questions data. Missing "questions" array.');
        }

        return { success: true, data: questionsData, usage: 0 };
      } catch (error: any) {
        throw new Error(`Failed to parse questions JSON: ${error.message}`);
      }
    }, 'generateQuestions');
  }

  async generateCourse(syllabusContent: string, modelName: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const model = this.geminiClient.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: MAX_TOKENS,
          topP: 0.95,
          topK: 10,
        },
      });

      const prompt = generateCoursePrompt({ content: syllabusContent });

      const chatSession = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: prompt.messages[0].content }],
          },
        ],
      });

      const result = await chatSession.sendMessage('Generate course');
      const courseContent = result.response.text();

      try {
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

        return { success: true, data: courseData, usage: 0 };
      } catch (error: any) {
        throw new Error(`Failed to parse course JSON: ${error.message}`);
      }
    }, 'generateCourse');
  }
}
