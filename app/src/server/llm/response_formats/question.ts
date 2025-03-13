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
                      is_correct: {
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
                      is_correct: {
                        type: 'boolean',
                        description: 'Indicates whether this option is the correct answer.',
                      },
                    },
                    required: ['text', 'is_correct'],
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