type IOrderUser = {
  _id?: string;
  pageTitle?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
  isOnline?: boolean;
  isDeactivate?: boolean;
  isEmailVerified?: boolean;
  idIsVerified?: boolean;
  offlineAt?: string;
  stripe?: IStripUser | undefined;
};
type IStripUser = {
  customerId?: string;
};

type ISubcription = {
  tags?: string[];
  _id?: string;
  oldPriceVariation?: PriceVariant;
  priceVariation?: PriceVariant;
  periodStart?: string;
  periodEnd?: string;
  createdAt?: string;

  sellerDeleted?: boolean;
  buyerDeleted?: boolean;
  tags?: string[];
  notifications?: boolean;
  textNotification?: boolean;
  autoRenew?: boolean;
  isActive?: boolean;
  test?: boolean;
  buyerId?: IOrderUser;
  orderId?: string;
  sellerId?: IOrderUser;

  sellerNotes?: string[];
  createdAt?: string;
  updatedAt?: string;

  lastMessage?: IPost;
  nickName?: string;
  unread?: number;
};
type IOrderUserType = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  totalEarnings?: number;
  lastOrderCreatedAt?: string;
  lastOrderUpdatedAt?: string;
  orderCount?: number;
  profileImage?: string;
  username?: string;
  tags?: string[];
  subscription?: ISubcription;
  lastMessage?: string;
  lastMessageAt?: string;
  subscriptionId?: string;
  unread?: number;
  buyer?: IOrderUser;
  seller?: IOrderUser;
  buyerId?: IOrderUser;
  sellerId?: IOrderUser;
};
type IOrderType = IPop & {
  priceVariation?: any;
  subscriptionId?: string;
  index?: number;
  seller?: IUser;
  buyer?: IUser;
};

type IPostUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
  pageTitle?: string;
  isDeactivate?: boolean;
};
type IPostTips = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string;
};
type IPostComment = {
  childCount?: number;
  likeCount?: number;
  comment?: string;
  createdAt?: string;
  commentType?: string;
  commentBy?: string;
  userId?: string | IPostUser;
  postId?: string;
  childComments?: IPostCommentType;
  commentLiked?: boolean;
  _id?: string;
  tempComment?: boolean;
};
type IPostTip = IPostComment & {};
type IPostTipsType = {
  items: IPostTip[];
  totalCount: number;
  totalTips?: number;
};
type IPostCommentType = {
  items: IPostComment[];
  totalCount: number;
};

type IPostLikes = {
  _id?: string;
  postId?: string;
  userId?: string | IPostUser;
  createdAt?: string;
  updatedAt?: string;
  postOwner?: boolean;
  comment?: string;
};
type IPostLikesType = {
  items: IPostLikes[];
  totalCount: number;
};
type IPostTipsType = {
  items: IPostLikes[];
  totalCount: number;
  totalTips?: number;
};
type IPostMembership = PriceVariant & {
  questions?: [];
};
type IPostMemberships = {
  memberShips?: IPostMembership[];
  _id?: string;
};

type IPostMembershipAccessTypes = {
  membershipId?: string;
  accessType?: string;
  viewPrice?: string | number;
};

type IPostMedia = MediaType & {};
type IPost = {
  media?: IPostMedia[];
  postLikes?: IPostLikesType;
  _id?: string;
  postType?: string;
  postText?: string;
  userId?: string | IPostUser;
  comments?: IPostCommentType;
  createdAt?: string;
  publishAt?: string;
  updatedAt?: string;
  template_id?: string;
  status?: string;

  membershipAccessType?: IPostMembershipAccessTypes[];
  liked?: boolean;
  membership?: IPostMembershipAccessTypes;
  isDeleted?: boolean;
  paymentComplete?: boolean;
  tips: IPostTipsType;
  expireAt?: string;
  expireDays?: string;
  title?: string;
  description?: string;
  id?: string;
  totalTips?: number;
};

type IPostStatistics = {
  totalTips?: number;
  totalComments?: number;
  payToView?: number;
  totalLikes?: number;
};
