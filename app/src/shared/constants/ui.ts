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

export const TEXT_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

export const TRACKING_MAP: Record<(typeof TEXT_SIZES)[number], string> = {
  xs: 'tracking-tight',
  sm: 'tracking-tight',
  base: 'tracking-normal',
  lg: 'tracking-normal',
  xl: 'tracking-normal',
  '2xl': 'tracking-normal',
  '3xl': 'tracking-wide',
  '4xl': 'tracking-wide',
  '5xl': 'tracking-wider',
  '6xl': 'tracking-wider',
};

export const PLAYBACK_SPEEDS = {
  200: '300 WPM',
  400: '150 WPM',
  600: '100 WPM',
  800: '75 WPM',
  1000: '60 WPM',
}; 