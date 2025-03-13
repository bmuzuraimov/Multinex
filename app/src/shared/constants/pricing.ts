export const ADMIN_EMAIL = 'bmuzuraimov@gmail.com';

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

export const FREE_CREDITS = 10; 