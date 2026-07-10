// Mock data for the Landing page. Shaped to resemble a future API
// response so swapping in a real fetch later is a drop-in replacement.

export const FEATURES = [
  {
    id: 'feat-global',
    icon: 'globe',
    title: 'Global Accessibility',
    description:
      'Your link works across all major networks and in over 50+ countries instantly.',
  },
  {
    id: 'feat-secure',
    icon: 'shield',
    title: 'Secure Transactions',
    description:
      'Bank-grade encryption for every airtime transfer. We prioritize your account security.',
  },
  {
    id: 'feat-analytics',
    icon: 'chart',
    title: 'Detailed Analytics',
    description:
      'Track who is sending you the most support with visual charts and history logs.',
  },
  {
    id: 'feat-mobile',
    icon: 'mobile',
    title: 'Mobile Optimized',
    description: 'A seamless experience on any device. Creating and sharing links takes seconds.',
  },
  {
    id: 'feat-team',
    icon: 'users',
    title: 'Team Management',
    description: 'Manage multiple phone lines under one single account for better organization.',
  },
  {
    id: 'feat-notify',
    icon: 'bell',
    title: 'Instant Notifications',
    description: 'Get notified via SMS or Email as soon as your airtime balance increases.',
  },
]

export const STEPS = [
  {
    id: 1,
    title: 'Generate Link',
    description: 'Sign up and create your personalized recharge URL in seconds.',
  },
  {
    id: 2,
    title: 'Share Anywhere',
    description: 'Paste your link on social bio, website, or send via DM.',
  },
  {
    id: 3,
    title: 'Get Airtime',
    description: 'Sponsors click, select network, and pay. You get the airtime instantly.',
  },
]

export const TESTIMONIALS = [
  {
    id: 'test-1',
    quote:
      'I use it on my stream bio. My fans can now support me with data bundles easily. Best tool ever!',
    name: 'Alex Rivers',
    role: 'Digital Creator',
    avatarSeed: 'alex-rivers',
    rating: 5,
  },
  {
    id: 'test-2',
    quote:
      'The interface is so clean. It took me less than 2 minutes to set up my global recharge link.',
    name: 'Sarah Jenkins',
    role: 'Marketing Manager',
    avatarSeed: 'sarah-jenkins',
    rating: 5,
  },
  {
    id: 'test-3',
    quote:
      'Reliable and fast. I never have to worry about my data running out during critical meetings.',
    name: 'Michael Chen',
    role: 'Freelance Developer',
    avatarSeed: 'michael-chen',
    rating: 5,
  },
]

export const FAQS = [
  {
    id: 'faq-1',
    question: 'Is there a fee for using Recharge4Me?',
    answer:
      'No, receiving airtime is completely free for you. The person sending the recharge pays the standard network rates.',
  },
  {
    id: 'faq-2',
    question: 'Which networks are supported?',
    answer:
      'We support all major mobile networks across 50+ countries, including MTN, Vodafone, Airtel, and more. Your link automatically detects the right network for your sponsor.',
  },
  {
    id: 'faq-3',
    question: 'How fast do I receive the airtime?',
    answer:
      'Airtime and data are credited instantly, typically within seconds of your sponsor completing payment. No manual processing required.',
  },
  {
    id: 'faq-4',
    question: 'Can I use my link on Instagram?',
    answer:
      'Yes. Your Recharge4Me link works anywhere you can paste a URL, including Instagram bio, Twitter, TikTok, YouTube descriptions, and personal websites.',
  },
]

export const STATS = [
  { id: 'stat-reach', label: 'Global Reach', value: '150+ Countries' },
  { id: 'stat-users', label: 'Active Users', value: '50k+' },
]
