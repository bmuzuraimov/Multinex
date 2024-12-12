import OpenAI from 'openai';
import { GENERATE_EXERCISE_PROMPT, GENERATE_SUMMARY_PROMPT, GENERATE_EXAM_PROMPT } from '../prompts/exercise';
import { GENERATE_COURSE_PROMPT } from '../prompts/course';
import { retry } from './utils';
import { HttpError } from 'wasp/server';
import { reportToAdmin } from '../actions/utils';
import { TEMPERATURE } from '../../shared/constants';

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
  static async generateExercise(content: string, priorKnowledge: string, length: string, level: string, model: string, maxTokens: number): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_EXERCISE_PROMPT({ content, priorKnowledge, length, level }),
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: {
            "type": "json_schema",
            "json_schema": {
              "name": "exam_summary",
              "strict": true,
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Title of PDF Material"
                  },
                  "preExerciseText": {
                    "type": "string",
                    "description": "Brief outline or engaging questions/checklist to prepare the user for review."
                  },
                  "lectureText": {
                    "type": "string",
                    "description": "Structured and concise summary with all significant content, including programming-friendly formulas and logical formatting."
                  }
                },
                "required": [
                  "name",
                  "preExerciseText",
                  "lectureText"
                ],
                "additionalProperties": false
              }
            }
          },
        });

        const responseContent = response.choices[0]?.message?.content || '';
        const exerciseJson = JSON.parse(responseContent);

        if (!exerciseJson?.lectureText) {
          throw new Error('lectureText is missing from the response.');
        }

        const exerciseJsonUsage = response.usage?.total_tokens || 0;
        return { success: true, data: exerciseJson, usage: exerciseJsonUsage };
      } catch (error: any) {
        await reportToAdmin(`Error in generateExercise: ${error.message}`);
        console.error('Error in generateExercise:', error);
        throw error;
      }
    });
  }

  static async generateSummary(lectureText: string, model: string, maxTokens: number): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_SUMMARY_PROMPT({ content: lectureText }),
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format: {
            "type": "json_schema",
            "json_schema": {
              "name": "lecture_summary",
              "strict": true,
              "schema": {
                "type": "object",
                "properties": {
                  "paragraphSummary": {
                    "type": "string",
                    "description": "Concise names for the paragraphs separated by '|'"
                  }
                },
                "required": [
                  "paragraphSummary"
                ],
                "additionalProperties": false
              }
            }
          },
        });

        const summaryContent = response.choices[0]?.message?.content || '';
        const summaryJson = JSON.parse(summaryContent);

        if (!summaryJson?.paragraphSummary) {
          throw new Error('paragraphSummary is missing from the response.');
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

  static async generateQuestions(lectureText: string, model: string, maxTokens: number): Promise<OpenAIResponse> {
    return retry(async () => {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: GENERATE_EXAM_PROMPT({ content: lectureText }),
          response_format: {
            "type": "json_schema",
            "json_schema": {
              "name": "mcq_schema",
              "strict": true,
              "schema": {
                "type": "object",
                "properties": {
                  "questions": {
                    "type": "array",
                    "description": "A list of multiple-choice questions designed based on lecture text.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "text": {
                          "type": "string",
                          "description": "The textual content of the question."
                        },
                        "options": {
                          "type": "array",
                          "description": "A set of options for the multiple-choice question.",
                          "items": {
                            "type": "object",
                            "properties": {
                              "text": {
                                "type": "string",
                                "description": "The text of the option."
                              },
                              "isCorrect": {
                                "type": "boolean",
                                "description": "Indicates whether this option is the correct answer."
                              }
                            },
                            "required": [
                              "text",
                              "isCorrect"
                            ],
                            "additionalProperties": false
                          }
                        }
                      },
                      "required": [
                        "text",
                        "options"
                      ],
                      "additionalProperties": false
                    }
                  }
                },
                "required": [
                  "questions"
                ],
                "additionalProperties": false
              }
            }
          },
          temperature: TEMPERATURE,
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0.1,
          presence_penalty: 0,
        });

        const responseContent = response.choices[0]?.message?.content || '';
        const questionsJson = JSON.parse(responseContent);

        if (!questionsJson?.questions || !Array.isArray(questionsJson.questions) || questionsJson.questions.length === 0) {
          throw new Error('Invalid JSON structure: "questions" array is missing or empty.');
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
  static async generateCourse(syllabusContent: string, model: string, maxTokens: number): Promise<OpenAIResponse> {
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
          response_format: {
            type: 'json_object',
          },
        });

        const responseContent = response.choices[0]?.message?.content || '';
        const jsonContent = JSON.parse(responseContent);

        if (!jsonContent?.courseName) {
          throw new Error('courseName is missing from the response.');
        }
        if (!jsonContent?.courseDescription) {
          throw new Error('courseDescription is missing from the response.');
        }
        if (!Array.isArray(jsonContent.topics)) {
          throw new Error('topics array is missing from the response.');
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
}
