import { FREE_CREDITS } from './pricing';
import { ADMIN_EMAIL } from './pricing';

export const PUBLIC_NAVBAR = [
  { name: 'Courses', href: '/public-courses' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
] as const;

export const AUTH_NAVBAR = [
  { name: 'Portal', href: '/portal' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Feedback', href: '/feedback' },
] as const;

export const FEATURES = [
  {
    name: 'Multi-sensory Learning',
    description: 'Listen, type, and write your way to memorize better.',
    icon: '🎧',
    href: '#',
  },
  {
    name: 'Smart Topic Selection', 
    description: 'Skip familiar topics and focus on knowledge gaps with customizable pre-settings that optimize your study time.',
    icon: '🎯',
    href: '#',
  },
  {
    name: 'Consistent Visual Layout',
    description: 'Standardized interface eliminates distractions from varying PDF formats.',
    icon: '👀',
    href: '#',
  },
  {
    name: 'Course Sharing',
    description: 'Share your course with your friends and classmates.',
    icon: '📊',
    href: '#',
  },
];

export const FAQS = [
  {
    id: 0,
    question: 'Do you provide free tier?',
    answer: `Yes, we offer ${FREE_CREDITS} free credits to get you started.`,
  },
  {
    id: 1,
    question: 'Which AI models do you support?',
    answer: 'We support models from OpenAI, Gemini and DeepSeek.',
    href: '',
  },
  {
    id: 2,
    question: 'Can I track my progress?',
    answer: 'Yes, our platform includes a feature to track your completion of topics, making learning measurable and more rewarding.',
    href: '',
  },
  {
    id: 3,
    question: 'Do you provide support?',
    answer: `Yes, we provide support via email. You can reach out to us at ${ADMIN_EMAIL}`,
    href: `mailto:${ADMIN_EMAIL}`,
  },
];

export const FOOTER_NAVIGATION = {
  app: [
    { name: 'Support', href: `mailto:${ADMIN_EMAIL}` },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
}; 