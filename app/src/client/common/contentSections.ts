import { FREE_CREDITS, ADMIN_EMAIL } from '../../shared/constants';
import { routes } from 'wasp/client/router';

export const navigation = [
  { name: 'Courses', href: routes.PublicCoursesRoute.build() },
  { name: 'Pricing', href: routes.PricingPageRoute.build() },
  { name: 'About', href: routes.AboutPageRoute.build() },
];

export const features = [
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

export const faqs = [
  {
    id: 0,
    question: 'Do you provide free tier?',
    answer: `Yes, we offer ${FREE_CREDITS} free credits to get you started.`,
  },
  {
    id: 1,
    question: 'Which AI models do you support?',
    answer: 'We support OpenAI GPT-4 and GPT-4-mini models, as well as models from Google Gemini.',
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
export const footerNavigation = {
  app: [
    { name: 'Support', href: `mailto:${ADMIN_EMAIL}` },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};
