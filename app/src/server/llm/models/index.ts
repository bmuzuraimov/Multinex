import { BaseLLMService } from './base';
import { OpenAIService } from './openai';
import { DeepSeekService } from './deepseek';
import { GeminiService } from './gemini';
import { LLMResponse } from './base';

// Model vendor mapping
export enum ModelVendor {
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek',
  GEMINI = 'gemini'
}

// Factory class for LLM services
export class LLMFactory {
  private static instances: Record<ModelVendor, BaseLLMService> = {
    [ModelVendor.OPENAI]: new OpenAIService(),
    [ModelVendor.DEEPSEEK]: new DeepSeekService(),
    [ModelVendor.GEMINI]: new GeminiService()
  };

  // Map model names to vendors
  private static modelToVendor: Record<string, ModelVendor> = {
    // OpenAI models
    'gpt-4o-mini': ModelVendor.OPENAI,
    'gpt-4o': ModelVendor.OPENAI,
    // DeepSeek models
    'deepseek-chat': ModelVendor.DEEPSEEK,
    'deepseek-coder': ModelVendor.DEEPSEEK,
    // Gemini models
    'gemini-2.0-flash-lite': ModelVendor.GEMINI,
    'gemini-1.5-flash': ModelVendor.GEMINI
  };

  static getService(model: string): BaseLLMService {
    const vendor = this.modelToVendor[model];
    if (!vendor) {
      throw new Error(`Unsupported model: ${model}`);
    }
    return this.instances[vendor];
  }

  // Factory methods
  static async generateQuestions(lectureContent: string, model: string): Promise<LLMResponse> {
    const service = this.getService(model);
    return service.generateQuestions(lectureContent, model);
  }

  static async generateCourse(syllabusContent: string, model: string): Promise<LLMResponse> {
    const service = this.getService(model);
    return service.generateCourse(syllabusContent, model);
  }

  static async generateModule(
    context: string,
    topic_name: string,
    model: string,
    prePrompt: string,
    postPrompt: string
  ): Promise<LLMResponse> {
    const service = this.getService(model);
    return service.generateModule(
      context,
      topic_name,
      model,
      prePrompt,
      postPrompt
    );
  }
}

// Export the LLM services for backward compatibility
export * from './openai';
export * from './deepseek';
export * from './gemini';