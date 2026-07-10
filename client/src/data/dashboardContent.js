// Mock data for the Dashboard page. Shaped to resemble a future API
// response so swapping in a real fetch later is a drop-in replacement.
//
// NOTE ON PERSONA/CURRENCY: the desktop mockup used "Jordan" + USD
// while the mobile mockup used "David" + Naira (₦) — two different
// demo personas from the design tool, not an intentional per-device
// locale switch. Standardized on David / ₦ throughout, per user
// decision, since this is one responsive page with one data source.
//
// NOTE ON LINK DOMAIN: prior screens showed three different domains
// for the public recharge link (recharge4me.io, recharge4me.com,
// recharge4.me). Standardized on "recharge4.me" going forward as the
// canonical short-link domain.

export const USER = {
  firstName: 'David',
  lastName: 'King',
  fullName: 'David King',
  email: 'david@example.com',
  phone: '+234 812 345 6789',
  accountId: '#RC-9982',
  planLabel: 'Pro Plan Active',
  linkUrl: 'recharge4.me/david-king',
  isOnline: true,
}

export const HERO_STATS = {
  newRechargesThisWeek: 12,
  totalAvailableCredit: 48250.0,
}

export const LINK_ACTIVITY = {
  totalClicks: 1240,
  conversionRate: 84,
}

export const MAIN_STATS = [
  {
    id: 'stat-value',
    label: 'Total Value Received',
    value: '₦2,450.80',
    trend: { direction: 'up', percent: '12.5%' },
    icon: 'trending-up',
  },
  {
    id: 'stat-airtime',
    label: 'Airtime Recharges',
    value: '142 Units',
    trend: { direction: 'up', percent: '8.2%' },
    icon: 'mobile',
  },
  {
    id: 'stat-data',
    label: 'Data Volume',
    value: '2.4 TB',
    trend: { direction: 'down', percent: '4.1%' },
    icon: 'database',
  },
]

export const QUICK_INSIGHTS = [
  { id: 'qi-received', label: 'Total Received', value: '124', trend: { direction: 'up', percent: '+12%' }, icon: 'trending-up' },
  { id: 'qi-links', label: 'Active Links', value: '03', icon: 'link' },
  { id: 'qi-impressions', label: 'Impressions', value: '1.2k', trend: { direction: 'up', percent: '+5%' }, icon: 'trending-up' },
  { id: 'qi-avg', label: 'Avg. Recharge', value: '₦1.5k', icon: 'bolt' },
]

export const TREND_DATA_WEEK = [
  { label: 'Mon', value: 1200 },
  { label: 'Tue', value: 2000 },
  { label: 'Wed', value: 1700 },
  { label: 'Thu', value: 3200 },
  { label: 'Fri', value: 2800 },
  { label: 'Sat', value: 4000 },
  { label: 'Sun', value: 3700 },
]

export const TREND_DATA_MONTH = [
  { label: 'Wk 1', value: 8500 },
  { label: 'Wk 2', value: 11200 },
  { label: 'Wk 3', value: 9800 },
  { label: 'Wk 4', value: 14600 },
]

export const QUICK_ACTIONS = [
  { id: 'qa-copy', label: 'Copy Link', icon: 'copy' },
  { id: 'qa-qr', label: 'Generate QR', icon: 'qr' },
  { id: 'qa-history', label: 'Full History', icon: 'history' },
  { id: 'qa-sponsors', label: 'Manage Sponsors', icon: 'users' },
]

export const PROFILE_COMPLETENESS = {
  percent: 100,
  message:
    "Complete profiles receive up to 45% more recharges. You've verified your email and linked your primary number.",
}

// STATUS: 'success' | 'pending' | 'failed'
export const RECENT_RECHARGES = [
  {
    id: 'txn-1',
    sponsor: 'Alex Johnson',
    type: 'Airtime',
    amount: '₦25.00',
    time: '2 mins ago',
    status: 'success',
  },
  {
    id: 'txn-2',
    sponsor: 'Sarah Williams',
    type: 'Data',
    amount: '5GB',
    time: '1 hour ago',
    status: 'success',
  },
  {
    id: 'txn-3',
    sponsor: 'Unknown Sponsor',
    type: 'Airtime',
    amount: '₦10.00',
    time: '4 hours ago',
    status: 'pending',
  },
  {
    id: 'txn-4',
    sponsor: 'Michael Chen',
    type: 'Airtime',
    amount: '₦50.00',
    time: 'Yesterday',
    status: 'success',
  },
  {
    id: 'txn-5',
    sponsor: 'Jessica Miller',
    type: 'Data',
    amount: '10GB',
    time: 'Oct 24, 2023',
    status: 'failed',
  },
]

export const RECENT_ACTIVITY_MOBILE = [
  {
    id: 'act-1',
    sponsor: 'Alexander Pierce',
    type: 'Airtime',
    time: 'Today, 11:45 AM',
    amount: '₦2,500.00',
    status: 'success',
  },
  {
    id: 'act-2',
    sponsor: 'Sarah Jenkins',
    type: 'Data Plan',
    time: 'Yesterday',
    amount: '5.0GB',
    status: 'success',
  },
  {
    id: 'act-3',
    sponsor: 'Unknown Sponsor',
    type: 'Airtime',
    time: 'Oct 24',
    amount: '₦5,000.00',
    status: 'pending',
  },
]

// ===================== RECHARGE LINK PAGE =====================
//
// NOTE: this mockup used yet another persona ("Alex Smith" on
// desktop, "Alex Doe" on mobile) and USD ($). Continuing the
// established rule from the Dashboard: standardized on David / ₦
// and the canonical recharge4.me domain throughout.

export const LINK_SETTINGS = {
  linkStatusEnabled: true,
  allowDataBundles: true,
  showVerification: true,
  allowAnonymousSponsors: true,
  isLive: true,
}

export const LINK_STATS = [
  { id: 'ls-clicks', label: 'Total Clicks', value: '12,482', trend: { direction: 'up', percent: '+18.5%' }, icon: 'cursor' },
  { id: 'ls-conversions', label: 'Conversions', value: '2,104', trend: { direction: 'up', percent: '+12.3%' }, icon: 'check' },
  { id: 'ls-avg', label: 'Avg. Recharge', value: '₦14,500', trend: { direction: 'down', percent: '-2.1%' }, icon: 'bolt' },
  { id: 'ls-activity', label: 'Last Activity', value: '2m ago', icon: 'history' },
]

export const LINK_QUICK_STATS_MOBILE = [
  { id: 'lq-views', label: 'Views', value: '1,284', icon: 'eye' },
  { id: 'lq-clicks', label: 'Clicks', value: '452', icon: 'cursor' },
  { id: 'lq-received', label: 'Received', value: '₦145,000', icon: 'card' },
  { id: 'lq-activity', label: 'Last Activity', value: '2h ago', icon: 'history' },
]

export const ENGAGEMENT_TIMELINE = [
  { label: 'Mon', value: 140 },
  { label: 'Tue', value: 180 },
  { label: 'Wed', value: 460 },
  { label: 'Thu', value: 400 },
  { label: 'Fri', value: 620 },
  { label: 'Sat', value: 780 },
  { label: 'Sun', value: 900 },
]

// ===================== SETTINGS PAGE =====================
//
// NOTE: this mockup used yet more personas ("Alexander Sterling" on
// desktop, "James Wilson" on mobile). Continuing the established
// rule: standardized on David / ₦ throughout.

export const PROFILE_INFO = {
  headline: 'Building the future of mobile connectivity.',
  isVerifiedIdentity: true,
}

export const NOTIFICATION_PREFS = {
  pushNotifications: true,
  emailNotifications: true,
  smsAlerts: false,
  marketingEmails: false,
}

export const APP_LANGUAGE = 'English (US)'

// ===================== TRANSACTIONS PAGE =====================

export const TRANSACTION_STATS = [
  { id: 'ts-total', label: 'Total Recharges', value: '₦2,450,000', trend: { direction: 'up', percent: '+12.5%' } },
  { id: 'ts-count', label: 'Total Transactions', value: '142', trend: { direction: 'up', percent: '+3.2%' } },
  { id: 'ts-success', label: 'Success Rate', value: '98.2%' },
]

// type: 'Airtime' | 'Data'; status: 'success' | 'pending' | 'failed'
export const ALL_TRANSACTIONS = [
  {
    id: 'txn-101',
    date: 'Oct 24, 2023',
    time: '02:15 PM',
    sponsor: 'Sarah Jenkins',
    isAnonymous: false,
    type: 'Airtime',
    network: 'MTN',
    amount: '₦25,000.00',
    valuedAt: null,
    status: 'success',
  },
  {
    id: 'txn-102',
    date: 'Oct 24, 2023',
    time: '11:04 AM',
    sponsor: 'Anonymous Sponsor',
    isAnonymous: true,
    type: 'Data',
    network: 'Airtel',
    amount: '10GB',
    valuedAt: '₦15,000.00',
    status: 'success',
  },
  {
    id: 'txn-103',
    date: 'Oct 23, 2023',
    time: '09:45 PM',
    sponsor: 'Michael Chen',
    isAnonymous: false,
    type: 'Airtime',
    network: 'Glo',
    amount: '₦10,000.00',
    valuedAt: null,
    status: 'pending',
  },
  {
    id: 'txn-104',
    date: 'Oct 22, 2023',
    time: '04:20 PM',
    sponsor: 'Emma Wilson',
    isAnonymous: false,
    type: 'Data',
    network: '9mobile',
    amount: '5GB',
    valuedAt: '₦8,000.00',
    status: 'success',
  },
  {
    id: 'txn-105',
    date: 'Oct 21, 2023',
    time: '10:10 AM',
    sponsor: 'David Smith',
    isAnonymous: false,
    type: 'Airtime',
    network: 'MTN',
    amount: '₦50,000.00',
    valuedAt: null,
    status: 'failed',
  },
  {
    id: 'txn-106',
    date: 'Oct 20, 2023',
    time: '08:00 AM',
    sponsor: 'Elena Rodriguez',
    isAnonymous: false,
    type: 'Airtime',
    network: 'Airtel',
    amount: '₦100,000.00',
    valuedAt: null,
    status: 'success',
  },
  {
    id: 'txn-107',
    date: 'Oct 19, 2023',
    time: '01:30 PM',
    sponsor: 'TechCorp Solutions',
    isAnonymous: false,
    type: 'Data',
    network: 'Glo',
    amount: '10GB',
    valuedAt: '₦12,000.00',
    status: 'success',
  },
]

export const TOTAL_TRANSACTIONS_COUNT = 58

// ===================== PUBLIC RECHARGE PAGE =====================

export const NETWORK_PROVIDERS = [
  { id: 'mtn', label: 'MTN', color: '#FFCC08', textColor: '#1a1a1a' },
  { id: 'airtel', label: 'Airtel', color: '#ED1C24', textColor: '#ffffff' },
  { id: 'glo', label: 'Glo', color: '#8DC63F', textColor: '#ffffff' },
  { id: '9mobile', label: '9mobile', color: '#00A651', textColor: '#ffffff' },
]

export const PRESET_AMOUNTS = [200, 500, 1000, 2000]
export const MIN_RECHARGE_AMOUNT = 100

