import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GENERATE_EXERCISE_PROMPT,
  GENERATE_SUMMARY_PROMPT,
  GENERATE_EXAM_PROMPT,
  GENERATE_STUDY_METHOD_TAGS_PROMPT,
} from '../prompts';
import { GENERATE_COURSE_PROMPT } from '../prompts/course';
import { HttpError } from 'wasp/server';
import { TEMPERATURE } from '../../../shared/constants';
import { SensoryMode } from '../../../shared/types';
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
      const model = this.geminiClient.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40
        }
      });
      
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: GENERATE_EXERCISE_PROMPT({
              content: exerciseRawContent,
              priorKnowledge,
              length: exerciseLength,
              level: difficultyLevel,
              pre_prompt: prePrompt,
              post_prompt: postPrompt,
            }).messages[0].content }]
          }
        ]
      });

      const result = await chatSession.sendMessage("Generate exercise content");
      const exerciseContent = result.response.text();

      if (!exerciseContent) {
        throw new Error('Exercise content missing from response.');
      }

      return { success: true, data: exerciseContent, usage: 0 };
    }, 'generateExercise');
  }

  async generateSummary(lectureContent: string, modelName: string, maxTokens: number): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const model = this.geminiClient.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40,
          responseMimeType: "application/json"
        }
      });
      
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: GENERATE_SUMMARY_PROMPT({ content: lectureContent }).messages[0].content }]
          }
        ]
      });

      const result = await chatSession.sendMessage("Generate summary");
      const summaryContent = result.response.text();
      const summaryData = JSON.parse(summaryContent);

      if (!summaryData?.paragraphSummary) {
        throw new Error('Paragraph summary missing from response JSON.');
      }

      return { success: true, data: summaryData, usage: 0 };
    }, 'generateSummary');
  }

  async generateQuestions(lectureContent: string, modelName: string, maxTokens: number): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const model = this.geminiClient.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40,
          responseMimeType: "application/json"
        }
      });
      
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: GENERATE_EXAM_PROMPT({ content: lectureContent }).messages[0].content }]
          }
        ]
      });

      const result = await chatSession.sendMessage("Generate questions");
      const questionsContent = result.response.text();
      const questionsData = JSON.parse(questionsContent);

      if (!questionsData?.questions || !Array.isArray(questionsData.questions)) {
        throw new Error('Invalid questions data. Missing "questions" array.');
      }

      return { success: true, data: questionsData, usage: 0 };
    }, 'generateQuestions');
  }

  async generateCourse(syllabusContent: string, modelName: string, maxTokens: number): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const model = this.geminiClient.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40,
          responseMimeType: "application/json"
        }
      });
      
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: GENERATE_COURSE_PROMPT({ content: syllabusContent }).messages[0].content }]
          }
        ]
      });

      const result = await chatSession.sendMessage("Generate course");
      const courseContent = result.response.text();
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
      const model = this.geminiClient.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: TEMPERATURE,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40,
          responseMimeType: "application/json"
        }
      });
      
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: GENERATE_STUDY_METHOD_TAGS_PROMPT({
              content: lectureContent,
              sensoryModes: sensoryModes,
            }).messages[0].content }]
          }
        ]
      });

      const result = await chatSession.sendMessage("Generate complexity analysis");
      const complexityContent = result.response.text();
      const complexityData = JSON.parse(complexityContent);

      if (!complexityData?.taggedText) {
        throw new Error('Tagged text missing from complexity data.');
      }

      return { success: true, data: complexityData, usage: 0 };
    }, 'generateComplexity');
  }
}
