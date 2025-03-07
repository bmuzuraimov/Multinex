import { reportToAdmin } from '../../actions/utils';
import { RETRIES, DELAY_MS } from '../../../shared/constants';
import { TiktokenModel, encoding_for_model } from 'tiktoken';
import { OPENAI_MODEL } from '../../../shared/constants';
import { SensoryMode } from '../../../shared/types';


export interface LLMResponse {
  success: boolean;
  message?: string;
  data?: any;
  usage?: number;
}



export abstract class BaseLLMService {
  protected abstract setupClient(): void;

  protected async withRetry<T>(operation: () => Promise<T>, methodName: string, retries: number = RETRIES, delayMs: number = DELAY_MS): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return this.withRetry(operation, methodName, retries - 1, delayMs * 2);
      }
      return this.handleError(error, methodName);
    }
  }

  abstract generateExercise(
    content: string,
    priorKnowledge: string,
    length: string,
    level: string,
    model: string,
    maxTokens: number,
    pre_prompt: string,
    post_prompt: string
  ): Promise<LLMResponse>;

  abstract generateSummary(
    lectureContent: string,
    model: string,
    maxTokens: number
  ): Promise<LLMResponse>;

  abstract generateQuestions(
    lectureContent: string,
    model: string,
    maxTokens: number
  ): Promise<LLMResponse>;

  abstract generateCourse(
    syllabusContent: string,
    model: string,
    maxTokens: number
  ): Promise<LLMResponse>;

  abstract generateComplexity(
    lectureContent: string,
    model: string,
    maxTokens: number,
    sensoryModes: SensoryMode[]
  ): Promise<LLMResponse>;

  protected handleError(error: any, methodName: string): never {
    console.error(`Error in ${methodName}:`, error);
    reportToAdmin(`Error in ${methodName}: ${error.message}`);
    throw error;
  }

  static calculateRequiredTokens(content: string, model: TiktokenModel): number {
    const encoding = encoding_for_model(OPENAI_MODEL);
    return encoding.encode(content).length;
  }

  static async deductTokens(context: any, totalTokens: number): Promise<void> {
    await context.entities.User.update({
      where: { id: context.user.id },
      data: {
        tokens: {
          decrement: totalTokens,
        },
      },
    });
  }
} 