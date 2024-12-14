export const ADMIN_EMAIL = 'bmuzuraimov@typit.app';

export enum TierIds {
  BASIC = 'BASIC',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}
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

export const FREE_TOKENS = 50000;

export enum TierTokens {
  BASIC_TOKENS = 200000,
  PRO_TOKENS = 350000,
  PREMIUM_TOKENS = 700000,
}

export const EXERCISE_LEVELS = {
  'Beginner Level': 'Beginner Level',
  'Intermediate Level': 'Intermediate Level',
  'Advanced Level': 'Advanced Level',
  'Expert Level': 'Expert Level',
  'Master Level': 'Master Level'
};

export const AVAILABLE_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
];
export const EXERCISE_LENGTHS = {
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
  1000: '60 WPM'
};
