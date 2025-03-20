export const exerciseFormat = { type: 'text' };

export const complexityFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'document_schema',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        paragraphs: {
          type: 'array',
          description: 'A collection of paragraphs in the document.',
          items: {
            type: 'object',
            properties: {
              content: {
                type: 'string',
                description: 'The textual content of the paragraph.',
              },
              type: {
                type: 'string',
                description: 'The sensory mode of the content.',
                enum: ['mermaid', 'listen', 'type', 'write'],
              },
            },
            required: ['content', 'type'],
            additionalProperties: false,
          },
        },
      },
      required: ['paragraphs'],
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
