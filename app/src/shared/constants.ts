export const ADMIN_EMAIL = 'bmuzuraimov@gmail.com';
export const DEFAULT_PRE_PROMPT = `You are an AI designed to convert PDF documents into structured, knowledge-focused equivalents for student learning.

  Core Principles:
  - Avoid filler phrases: Never use sentences like "It is crucial to know..." or "This concept is important...". Only include factual, explanatory, or actionable content.
  - Prioritize depth over summaries: Reconstruct knowledge in a way that mirrors the original material's depth and rigor.

  Execute these subtasks sequentially:
  1. Extract Key Concepts:
     - Identify theories, principles, and definitions.
     - For each concept, explain:
       - What it is (clear definition).
       - How it works (mechanism/process).
       - Why it matters (significance/applications).

  2. Structure Formulas/Equations:
     - Convert formulas to programming-friendly syntax (e.g., "force = mass * acceleration").
     - For each formula:
       - Define variables (e.g., "m = mass (kg)").
       - Describe conditions for validity (e.g., "Assumes frictionless surfaces").

  3. Link Concepts to Concrete Examples:
     - Provide 1-2 examples per major concept.
     - Include:
       - Step-by-step problem-solving (e.g., "To calculate X, first do Y...").
       - Real-world scenarios (e.g., "Used in weather prediction to model...").`;

export const DEFAULT_POST_PROMPT = '';
export const TIERS = [
  {
    id: 'BASIC',
    name: 'Pro Package',
    price: '$7.99',
    description: 'Perfect for 4 courses per semester',
    credits: 30,
    features: ['30 credits', 'Basic email support'],
    bestDeal: false,
  },
  {
    id: 'PRO',
    name: 'Premium Package',
    price: '$9.99',
    description: 'Perfect for 6 courses per semester',
    credits: 50,
    features: ['50 credits', 'Priority email support'],
    bestDeal: true,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 'Contact Sales',
    description: 'Perfect for universities and educational institutions',
    credits: 100,
    features: [
      'Enterprise-level course management',
      'Student enrollment portal',
      'Advanced analytics dashboard',
      'Custom LMS integrations',
      'Priority 24/7 support',
      'Contact bmuzuraimov@gmail.com',
    ],
    bestDeal: false,
  },
];

export const OPENAI_MODEL = 'gpt-4o-mini';
export const MAX_TOKENS = 16383;
export const TEMPERATURE = 0.7;
export const RETRIES = 3;
export const DELAY_MS = 500;

export const COURSE_IMAGES = [
  'bg-gradient-to-r from-green-400 to-blue-500',
  'bg-gradient-to-r from-pink-500 to-yellow-500',
  'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
  'bg-gradient-to-r from-yellow-200 via-green-200 to-green-500',
  'bg-gradient-to-r from-red-200 via-red-300 to-yellow-200',
  'bg-gradient-to-r from-pink-200 via-pink-300 to-pink-500',
  'bg-gradient-to-r from-purple-200 via-purple-300 to-purple-500',
  'bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-500',
  'bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500',
  'bg-gradient-to-r from-green-200 via-green-300 to-green-500',
];

export const FREE_CREDITS = 10;

export const EXERCISE_LEVELS = {
  Auto: 'Auto',
  'Beginner Level': 'Beginner Level',
  'Intermediate Level': 'Intermediate Level',
  'Advanced Level': 'Advanced Level',
  'Expert Level': 'Expert Level',
  'Master Level': 'Master Level',
};

export const AVAILABLE_MODELS = ['gpt-4o-mini', 'gpt-4o'];
export const EXERCISE_LENGTHS = {
  Auto: 'Auto',
  '200 words (important)': 'Short (~200 words)',
  '400 words (important)': 'Medium (~400 words)',
  '600 words (important)': 'Detailed (~600 words)',
  '800 words (important)': 'Long (~800 words)',
  '1000 words (important)': 'Very Long (~1000 words)',
};

export const TEXT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

export const PLAYBACK_SPEEDS = {
  200: '300 WPM',
  400: '150 WPM',
  600: '100 WPM',
  800: '75 WPM',
  1000: '60 WPM',
};

export const TRACKING_MAP: Record<(typeof TEXT_SIZES)[number], string> = {
  xs: 'tracking-tight',
  sm: 'tracking-tight',
  base: 'tracking-normal',
  lg: 'tracking-normal',
  xl: 'tracking-normal',
  '2xl': 'tracking-normal',
  '3xl': 'tracking-wide',
  '4xl': 'tracking-wider',
  '5xl': 'tracking-[0.1em]',
  '6xl': 'tracking-[0.15em]',
  '7xl': 'tracking-[0.2em]',
  '8xl': 'tracking-[0.25em]',
  '9xl': 'tracking-[0.3em]',
};

export const BORDER_MAP: Record<(typeof TEXT_SIZES)[number], string> = {
  xs: 'border-b-[1px]',
  sm: 'border-b-2',
  base: 'border-b-2',
  lg: 'border-b-3',
  xl: 'border-b-3',
  '2xl': 'border-b-4',
  '3xl': 'border-b-[5px]',
  '4xl': 'border-b-[6px]',
  '5xl': 'border-b-[7px]',
  '6xl': 'border-b-[8px]',
  '7xl': 'border-b-[9px]',
  '8xl': 'border-b-[10px]',
  '9xl': 'border-b-[11px]',
};
