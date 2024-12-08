export const ADMIN_EMAIL = 'bmuzuraimov@typit.app';

export enum TierIds {
  BASIC = 'BASIC',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}
export const OPENAI_MODEL = 'gpt-4o-mini';
export const MAX_TOKENS = 8200;
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
export const ENGLISH_LAYOUT = {
  default: [
    '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
    '{tab} q w e r t y u i o p [ ] \\',
    "{lock} a s d f g h j k l ; ' {enter}",
    '{shift} z x c v b n m , . / {shift}',
    '.com @ {space}',
  ],
  shift: [
    '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
    '{tab} Q W E R T Y U I O P { } |',
    '{lock} A S D F G H J K L : " {enter}',
    '{shift} Z X C V B N M < > ? {shift}',
    '.com @ {space}',
  ],
};

export const EXERCISE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
export const AVAILABLE_MODELS = ['gpt-4o-mini'];
export const EXERCISE_LENGTHS = {
  '200 words (important)': 'Short (~200 words)',
  '400 words (important)': 'Medium (~400 words)',
  '600 words (important)': 'Detailed (~600 words)', 
  '800 words (important)': 'Long (~800 words)',
  '1000 words (important)': 'Very Long (~1000 words)',
};
