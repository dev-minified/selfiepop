export enum ServiceType {
  SHOUTOUT = 'shoutout',
  ADVERTISE = 'advertise',
  PAYMA = 'payma',
  POPLIVE = 'poplive',
  ADDITIONAL_SERVICES = 'additional-services',
  DIGITAL_DOWNLOADS = 'digital-download',
  CHAT_SUBSCRIPTION = 'chat-subscription',
}

export enum ArtType {
  VIDEO = 'video',
  IMAGE = 'image',
}
export enum ImageLayoutOptions {
  TITLE = 'Tile',
  FIT = 'fit',
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
  TOP_COVER = 'top-cover',
  MIDDLE_COVER = 'middle-cover',
  BOTTOM_COVER = 'bottom-cover',
}

export enum Time {
  SECONDS = 1000,
  MINUTES = 60 * SECONDS,
  HOURS = 60 * MINUTES,
  DAYS = 24 * HOURS,
  YEARS = 365 * DAYS,
}

export enum OrderStatus {
  COMPLETED = 'Completed',
  DISPUTE = 'Dispute',
  CANCELED = 'Canceled',
  IN_PROGRESS = 'In Progress',
  REFUNDED = 'Refunded',
  PRE_ORDER = 'pre-order',
  PENDING = 'Pending',
}
export enum SupportTicketStatus {
  ALL = 'all',
  OPEN = 'open',
  CLOSE = 'closed',
}

export enum SocialPlatforms {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
  TIKTOK = 'tiktok',
  ONLYFANS = 'onlyfans',
  SNAPCHAT = 'snapchat',
}
export enum SocialPlatformschecks {
  facebook = 'facebook.com',
  instagram = 'instagram.com',
  youtube = 'youtube.com',
  twitter = 'twitter.com',
  tiktok = 'tiktok.com',
  onlyfans = 'onlyfans.com',
  snapchat = 'snapchat.com',
}

export enum DayOfWeek {
  Sun = 0,
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6,
}
export enum WalletEventTypes {
  Sale = 'Sale',
  // 'Gift Received' = 'Gift Received',
  'Commission' = 'Commission',
  'Refund' = 'Refund',
  'Sale Approved' = 'Sale Approved',
  'Sale Delivered' = 'Sale Delivered',
  'Withdrawal Paid' = 'Withdrawal Paid',
  'Withdrawal' = 'Withdrawal',
  'Message Unlock' = 'Message Unlock',
  'Time Extend' = 'Time Extend',
  'Message Buy' = 'Message Buy',
  'Membership' = 'Membership',
  'Post Tip' = 'Post Tip',
  'Pay To View' = 'Pay To View',
  'Debit' = 'Debit',
  'Credit' = 'Credit',
  'Chargeback Repayment' = 'Chargeback Repayment',
  'Subscription Renew' = 'Subscription Renew',
}
export enum WalletEventIdTypes {
  'Message Unlock' = 'Message Unlock',
  'Post Tip' = 'Post Tip',
  'Pay To View' = 'Pay To View',
}
export enum MessageStatus {
  sent = 'SENT',
  pending = 'PENDING',
}

export enum postStatus {
  scheduled = 'scheduled',
  published = 'published',
}

export enum Slider {
  Promotional_Shoutout = 'PromotionalShoutout',
  Promotional_Media = 'PromotionalMedia',
  Schedule = 'schedule',
  Add_Post = 'Add_Post',
  Questions = 'Questions',
  Price_Variation = 'PriceVariation',
  DigitalDownloadFile = 'DigitalDownloadFile',
}

export enum PostTierTypes {
  free_to_view = 'free_to_view',
  pay_to_view = 'pay_to_view',
  hidden = 'hidden',
}
export enum ImagesSizes {
  '200x200' = '200x200',
  '320x320' = '320x320',
  '360x360' = '360x360',
  '163x163' = '163x163',
  '64x64' = '64x64',
  '480x220' = '480x220',
  '615x347' = '615x347',
  '900x600' = '900x600',
  '1920x1080' = '1920x1080',
  '960x540' = '1920x1080',
}

export enum RuleTriggerEvent {
  MembershipJoin = 'membership_join',
  TagAdded = 'tag_added',
  TagRemoved = 'tag_removed',
}

export enum FaqStatus {
  Complete = 'complete',
  Pending = 'pending',
  Deleted = 'deleted',
}
export enum ManagerItemStatus {
  cancelled = 'cancelled',
  active = 'active',
  declined = 'declined',
  pending = 'pending',
}
