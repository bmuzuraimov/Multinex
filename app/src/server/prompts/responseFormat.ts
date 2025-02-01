export const lectureContentFormat: {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: {
      type: string;
      properties: {
        lectureContent: {
          type: string;
          description: string;
        };
      };
      required: string[];
      additionalProperties: boolean;
    };
  };
} = {
  type: 'json_schema',
  json_schema: {
    name: 'lecture_content',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        lectureContent: {
          type: 'string',
          description:
            'Structured and concise summary with all significant content, including programming-friendly formulas and logical formatting.',
        },
      },
      required: ['lectureContent'],
      additionalProperties: false,
    },
  },
};

export const summaryFormat: {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: {
      type: string;
      properties: {
        paragraphSummary: {
          type: string;
          description: string;
        };
      };
      required: string[];
      additionalProperties: boolean;
    };
  };
} = {
  type: 'json_schema',
  json_schema: {
    name: 'lecture_summary',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        paragraphSummary: {
          type: 'string',
          description: "Concise names for the paragraphs separated by '|'",
        },
      },
      required: ['paragraphSummary'],
      additionalProperties: false,
    },
  },
};

export const questionsFormat: {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: {
      type: string;
      properties: {
        questions: {
          type: string;
          description: string;
          items: {
            type: string;
            properties: {
              text: {
                type: string;
                description: string;
              };
              options: {
                type: string;
                description: string;
                items: {
                  type: string;
                  properties: {
                    text: {
                      type: string;
                      description: string;
                    };
                    isCorrect: {
                      type: string;
                      description: string;
                    };
                  };
                  required: string[];
                  additionalProperties: boolean;
                };
              };
            };
            required: string[];
            additionalProperties: boolean;
          };
        };
      };
      required: string[];
      additionalProperties: boolean;
    };
  };
} = {
  type: 'json_schema',
  json_schema: {
    name: 'mcq_schema',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          description: 'A list of multiple-choice questions designed based on lecture text.',
          items: {
            type: 'object',
            properties: {
              text: {
                type: 'string',
                description: 'The textual content of the question.',
              },
              options: {
                type: 'array',
                description: 'A set of options for the multiple-choice question.',
                items: {
                  type: 'object',
                  properties: {
                    text: {
                      type: 'string',
                      description: 'The text of the option.',
                    },
                    isCorrect: {
                      type: 'boolean',
                      description: 'Indicates whether this option is the correct answer.',
                    },
                  },
                  required: ['text', 'isCorrect'],
                  additionalProperties: false,
                },
              },
            },
            required: ['text', 'options'],
            additionalProperties: false,
          },
        },
      },
      required: ['questions'],
      additionalProperties: false,
    },
  },
};


export const complexityFormat: {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: {
      type: string;
      properties: {
        taggedText: {
          type: string;
          description: string;
        };
      };
      required: string[];
      additionalProperties: boolean;
    };
  };
} = {
  type: 'json_schema',
  json_schema: {
    name: 'complexity_analysis',
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "taggedText": {
          "type": "string",
          "description": "Text with complexity tags (<write></write>, <type></type>, <hear></hear>) added"
        }
      },
      "required": [
        "taggedText"
      ],
      "additionalProperties": false
    }
  }
}