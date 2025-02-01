import testimonial_1 from '../static/testimonial_1.jpg';
import testimonial_2 from '../static/testimonial_2.jpg';
import testimonial_3 from '../static/testimonial_3.jpg';
import hku from '../static/hku.png';
import cuhk from '../static/cuhk.png';
import hkust from '../static/hkust.png';
import cityu from '../static/cityu.jpg';
import polyu from '../static/polyu.png';
import hkbu from '../static/hkbu.png';
import eduhk from '../static/eduhk.png';
import lignan from '../static/lignan.png';
import { FREE_TOKENS, ADMIN_EMAIL } from '../../shared/constants';
import { routes } from 'wasp/client/router';

export const navigation = [
  { name: 'Courses', href: routes.PublicCoursesRoute.build() },
  { name: 'Pricing', href: routes.PricingPageRoute.build() },
  { name: 'About', href: routes.AboutPageRoute.build() },
];

export const universities = [
  {
    name: 'Hong Kong University of Science and Technology',
    logoSrc: hkust,
    href: '#',
  },
  {
    name: 'University of Hong Kong',
    logoSrc: hku,
    href: '#',
  },
  {
    name: 'Hong Kong Baptist University',
    logoSrc: hkbu,
    href: '#',
  },
  {
    name: 'Hong Kong Polytechnic University',
    logoSrc: polyu,
    href: '#',
  },
  {
    name: 'Chinese University of Hong Kong',
    logoSrc: cuhk,
    href: '#',
  },
  {
    name: 'Education University of Hong Kong',
    logoSrc: eduhk,
    href: '#',
  },
  {
    name: 'Lingnan University',
    logoSrc: lignan,
    href: '#',
  },
  {
    name: 'City University of Hong Kong',
    logoSrc: cityu,
    href: '#',
  }
];

export const features = [
  {
    name: 'Real-Time Text Distillation',
    description: 'Immediate extraction of key points from your PDFs, displayed clearly in your browser.',
    icon: '🖥️',
    href: '#',
  },
  {
    name: 'Customizable Complexity',
    description: 'Adjust summaries based on your learning needs, from basic overviews to in-depth analyses.',
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
    name: 'Progress Tracking',
    description: 'Monitor your learning journey with gamified progress indicators.',
    icon: '📊',
    href: '#',
  },
];
export const testimonials = [
  {
    name: 'Felipe K.',
    role: 'Business Student',
    avatarSrc: testimonial_1,
    socialUrl: '',
    quote: "Helps me to skip the boring part and get good grades.",
  },
  {
    name: 'Eric J.',
    role: 'Computer Science Student',
    avatarSrc: testimonial_3,
    socialUrl: '',
    quote: 'I used spend too much time, now it takes me 10 minutes to cover a chapter.',
  },
  {
    name: 'Destiny U.',
    role: 'Computer Science Student',
    avatarSrc: testimonial_2,
    socialUrl: '#',
    quote: 'This app helps to complement gaps in my understanding.',
  },
];

export const faqs = [
  {
    id: 0,
    question: 'Do you provide free tier?',
    answer: `Yes, we offer ${FREE_TOKENS} free tokens to get you started. You can purchase more tokens as needed.`,
  },
  {
    id: 1,
    question: 'Do you store any of my files?',
    answer: 'No, all text extraction happens on your browser, ensuring your data\'s privacy and security.',
  },
  {
    id: 2,
    question: 'What levels of summary can I choose from?',
    answer: 'You can customize summaries for various understanding levels: from elementary explanations to detailed academic and professional insights.',
    href: '',
  },
  {
    id: 3,
    question: 'Can I track my progress?',
    answer: 'Yes, our platform includes a feature to track your completion of topics, making learning measurable and more rewarding.',
    href: '',
  },
  {
    id: 4,
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
