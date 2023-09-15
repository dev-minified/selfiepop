type ChatUserType = {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  isOnline?: boolean;
  offlineAt?: string;
  tagline?: string;
  pageTitle?: string;
  isEmailVerified?: boolean;
  idIsVerified?: boolean;
  isDeactivate?: boolean;
};
type ChatSubsType = {
  buyerActiveAt: string;
  buyerDeleted: boolean;
  buyerId: ChatUserType;
  sellerId: ChatUserType;
  createdAt: string;
  nickName?: string;
  notifications?: boolean;
  textNotification?: boolean;
  isActive: boolean;
  priceVariation?: PriceVariant;
  sellerNotes: NoteType[];
  orderId: string;
  periodEnd: string;
  periodStart: string;
  sellerActiveAt: string;
  sellerDeleted: boolean;
  updatedAt: string;
  _id: string;
  lastMessage?: ChatMessage;
  unread?: number;
  tags?: string[];
  autoRenew: boolean;
};

type NoteType = {
  _id?: string;
  noteValue: string;
  noteDateTime: string;
};
type MessagesType = 'GIFT' | 'SIMPLE' | 'pay-to-view';

type MediaType = {
  createdAt?: string;
  updatedAt?: string | number;
  isPaidType?: boolean;
  path?: string;
  type: 'image' | 'video' | string;
  name?: string;
  thumbnail?: string;
  videoDuration?: string;
  _id?: string;
  id?: string;
  size?: string;
  blurThumnail?: string;
  paymentComplete?: boolean;
  orignalFile?: File;
  islocK?: boolean;
  duration?: number;
  url?: string;
  isActive?: boolean;
  imageURL?: string;
  fallbackUrl?: string;
  width?: number;
  height?: number;
};
type PostedBy = {
  _id?: string;
  profileImage?: string;
  pageTitle?: string;
  username?: string;
};
type ReadBy = PostedBy;
type ChatMessage<T = MessagesType> = {
  subscriptionId: string;
  templateId?: string;
  sentFrom: 'BUYER' | 'SELLER';
  messageValue: string;
  messageMedia: MediaType[];
  isPaidType: boolean;
  paymentComplete: boolean;
  paymentIntentId: string;
  emojis: {
    type: string;
    from: 'BUYER' | 'SELLER';
    _id: string;
  }[];
  postedBy?: PostedBy | string;
  readBy?: ReadBy | string;
  price?: number;
  messageType: T;
  isRead: boolean;
  readAt: Date;
  createdAt?: string;
  url?: string;
  isSent?: boolean;
  _id?: string;
  publishDateTime?: string;
  tagsToAdd?: string[];
  tagsToRemove?: string[];
  includedTags?: string[];
  excludedTags?: string[];
  listToAdd?: string[];
  listToRemove?: string[];
  excludedMedia?: MediaType[] | string[];
  status: 'SENT' | 'PENDING';
  giftId?: GiftType;
  blurThumnail?: string;
  title?: string;
  description?: string;
  updatedAt?: string | number;
};
type SubscriptionSubList = {
  associatedSubscriptions?: [];
  createdAt?: string;
  listSellerId?: string;
  listTitle: string;
  updatedAt?: string;

  _id?: string;
};

type SubscriptionTask = {
  id: string;
  slug: string;
  status: string;
  isDeleted: boolean;
  subscriptionId: string;
  createdAt: string;
  updatedAt: string;
  completedBy?: { _id: string; username: string };
  completedOn?: string;
  taskData: Task;
};
type UnloackMedia = {
  isDeleted: boolean;
  _id: string;
  size: number;
  type: string;
  path: string;
  blurThumbnail: string;
  name: string;
  updatedAt: string;
  sortOrder: number;
  width: number;
  height: number;
  folderId: string;
  title: string;
  addedBy: string;
  userId: string;
  createdAt: string;
};

type Task = {
  taskTitle: string;
  taskDescription?: string;
  taskSteps?: SubTask[];
  taskTagsAddOnComplete?: string[];
  taskTagsRemoveOnComplete?: string[];
};

type SubTask = {
  stepTitle: string;
  stepDescription?: string;
  stepTagsAddOnComplete?: string[];
  stepTagsRemoveOnComplete?: string[];
  isComplete?: boolean;
  completedBy?: { _id: string; username: string };
  completedOn?: string;
};
type MemberShipT = {
  allowBuyerToMessage: boolean;
  allowContentAccess: boolean;
  allowUpsaleOffer: boolean;
  description: string;
  isActive: boolean;
  isArchive: boolean;
  isDefault: boolean;
  isDeleted: boolean;
  price: number;
  title: string;
  type: string;
  _id: string;
};
type SubscriptionLog = {
  buyerId: string;
  executionSteps: string[];
  executionTime: string;
  id: string;
  isDeleted: boolean;
  metadata: RuleMetadata;
  ruleSlug: string;
  ruleStatus: string;
  sellerId: string;
  slug: string;
  subscriptionId: string;
  tags: string;
};
