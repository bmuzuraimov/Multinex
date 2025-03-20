import OpenAI from 'openai';
import {
  generateExercisePrompt,
  generateSummaryPrompt,
  generateStudyMethodTagsPrompt,
  generateCoursePrompt,
  generateExamPrompt,
} from '../prompts';
import { HttpError } from 'wasp/server';
import { SensoryMode } from '../../../shared/types';
import { BaseLLMService, LLMResponse } from './base';

export class DeepSeekService extends BaseLLMService {
  private deepseek_client!: OpenAI;

  constructor() {
    super();
    this.setupClient();
  }

  protected setupClient(): void {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new HttpError(500, 'DeepSeek API key is not set');
    }
    this.deepseek_client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' });
  }

  async generateExercise(
    exercise_raw_content: string,
    prior_knowledge: string,
    exercise_length: string,
    difficulty_level: string,
    model_name: string,
    pre_prompt: string,
    post_prompt: string
  ): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseek_response = await this.deepseek_client.chat.completions.create({
        model: 'deepseek-chat',
        ...generateExercisePrompt({
          content: exercise_raw_content,
          prior_knowledge,
          length: exercise_length,
          level: difficulty_level,
          pre_prompt,
          post_prompt,
        }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const exercise_content = deepseek_response.choices[0]?.message?.content || '';

      if (!exercise_content) {
        throw new Error('Exercise content missing from response.');
      }

      const token_usage = deepseek_response.usage?.total_tokens || 0;
      return { success: true, data: exercise_content, usage: token_usage };
    }, 'generateExercise');
  }

  async generateSummary(lecture_content: string, model_name: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseek_response = await this.deepseek_client.chat.completions.create({
        model: 'deepseek-chat',
        ...generateSummaryPrompt({ content: lecture_content }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const summary_content = deepseek_response.choices[0]?.message?.content || '';
      const summary_data = JSON.parse(summary_content);

      if (!summary_data?.paragraphSummary) {
        throw new Error('Paragraph summary missing from response JSON.');
      }

      const token_usage = deepseek_response.usage?.total_tokens || 0;
      return { success: true, data: summary_data, usage: token_usage };
    }, 'generateSummary');
  }

  async generateQuestions(lecture_content: string, model_name: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseek_response = await this.deepseek_client.chat.completions.create({
        model: 'deepseek-chat',
        ...generateExamPrompt({ content: lecture_content }),
        temperature: 1.3,
        max_tokens: 8192,
      });

      const questions_content = deepseek_response.choices[0]?.message?.content || '';
      const questions_data = JSON.parse(questions_content);

      if (!questions_data?.questions || !Array.isArray(questions_data.questions)) {
        throw new Error('Invalid questions data. Missing "questions" array.');
      }

      const token_usage = deepseek_response.usage?.total_tokens || 0;
      return { success: true, data: questions_data, usage: token_usage };
    }, 'generateQuestions');
  }

  async generateCourse(syllabus_content: string, model_name: string): Promise<LLMResponse> {
    return this.withRetry(async () => {
      const deepseek_response = await this.deepseek_client.chat.completions.create({
        model: 'deepseek-chat',
        ...generateCoursePrompt({ content: syllabus_content }),
        temperature: 0.3,
        max_tokens: 8192,
      });

      const course_content = deepseek_response.choices[0]?.message?.content || '';
      const course_data = JSON.parse(course_content);

      if (!course_data?.courseName) {
        throw new Error('Course name missing from response.');
      }
      if (!course_data?.courseDescription) {
        throw new Error('Course description missing from response.');
      }
      if (!Array.isArray(course_data.topics)) {
        throw new Error('Course topics missing from response.');
      }

      const token_usage = deepseek_response.usage?.total_tokens || 0;
      return { success: true, data: course_data, usage: token_usage };
    }, 'generateCourse');
  }

  async generateComplexity(
    lecture_content: string,
    model_name: string,
    sensory_modes: SensoryMode[]
  ): Promise<LLMResponse> {
    if (lecture_content.length === 0) {
      return { success: true, data: { tagged_text: '' }, usage: 0 };
    }
    const prompt = generateStudyMethodTagsPrompt({
      content: lecture_content,
      sensory_modes: sensory_modes,
    });
    prompt.messages.push({
      role: 'user',
      content: `EXAMPLE JSON OUTPUT:
{
  "paragraphs": [
    {
      "content": "This is a sample paragraph",
      "type": "write"
    }
  ]
}`,
    });
    return this.withRetry(async () => {
      const deepseek_response = await this.deepseek_client.chat.completions.create({
        model: 'deepseek-chat',
        messages: prompt.messages,
        response_format: {
          type: 'json_object',
        },
        temperature: 1.3,
        max_tokens: 8192,
      });

      const complexity_content = deepseek_response.choices[0]?.message?.content || '';
      const parsed_content = JSON.parse(complexity_content);
      if (!parsed_content?.paragraphs) {
        throw new Error('Tagged text missing from complexity data.');
      }
      let tagged_text = parsed_content.paragraphs
        .map((p: { content?: string; type: string }) => (p.content ? `<${p.type}>${p.content}</${p.type}>` : ''))
        .join('\n\n');

      const token_usage = deepseek_response.usage?.total_tokens || 0;
      return { success: true, data: tagged_text, usage: token_usage };
    }, 'generateComplexity');
  }
}
