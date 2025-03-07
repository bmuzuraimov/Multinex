export const exerciseFormat = { type: 'text' };

export const complexityFormat = { type: 'text' };

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
