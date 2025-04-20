import { RETRIES, DELAY_MS } from '../../../shared/constants';
import { TiktokenModel, encoding_for_model } from 'tiktoken';
import { OPENAI_MODEL } from '../../../shared/constants';
import { handleError } from '../../actions/utils';

export interface LLMResponse {
  success: boolean;
  message?: string;
  data?: any;
  usage?: number;
}


export abstract class BaseLLMService {
  protected abstract setupClient(): void;

  protected async withRetry<T>(operation: () => Promise<T>, method_name: string, retries: number = RETRIES, delay_ms: number = DELAY_MS): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay_ms));
        return this.withRetry(operation, method_name, retries - 1, delay_ms * 2);
      }
      handleError('LLM Base', error, method_name);
      throw error;
    }
  }

  abstract generateModule(
    context: string,
    topic_name: string,
    model: string,
    pre_prompt: string,
    post_prompt: string
  ): Promise<LLMResponse>;

  abstract generateQuestions(
    lecture_content: string,
    model: string,
  ): Promise<LLMResponse>;

  abstract generateCourse(
    syllabus_content: string,
    model: string,
  ): Promise<LLMResponse>;

  static calculateRequiredTokens(content: string, model: TiktokenModel): number {
    const encoding = encoding_for_model(OPENAI_MODEL);
    return encoding.encode(content).length;
  }

  static async deductTokens(context: any, total_tokens: number): Promise<void> {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: {
        tokens: {
          decrement: total_tokens,
        },
      },
    });
  }
}