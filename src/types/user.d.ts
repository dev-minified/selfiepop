// import ILibrary from './Library';
// import IPop from './Pop.type';
// import ISocialLink from './SocialLink';
// import ITheme from './Theme';
type IUserLink = {
  _id?: string;
  popLinksId?: IPop;
  url?: string;
  title?: string;
  imageURL?: string;
  linkType:
    | 'service'
    | 'socialLinks'
    | 'sectionTitle'
    | 'youtubeLink'
    | 'biography'
    | 'simpleLink'
    | 'contentBlock'
    | 'innerCircleLink';
  associatedRecordID?: string;
  sortOrder?: number;
  autoPlay?: boolean;
  mute?: boolean;
  loop?: boolean;
  isDeleted?: string;
  isThumbnailActive?: boolean;
  isSensitve?: string;
  isActive?: boolean;
  isTemp?: boolean;
  platfrom?: string;
  content?: string;
};
type MangerItem = {
  _id?: string;
  createdAt?: string;
  status?: 'pending' | 'active' | 'declined' | 'cancelled';
  allowMessage?: boolean;
  allowContent?: boolean;
  allowOrders?: boolean;
  allowCommissions?: boolean;
  commissionValue?: 65;
  userId?: {
    isOnline?: boolean;
    _id?: string;
    username?: string;
    pageTitle?: string;
    profileImage?: string;
  };
};
type IUser = {
  firstName: string;
  lastName: string;
  profileImage: string;
  profileImageOrignal: string;
  profileImageCropperObj: string;
  dob: Date;
  profileBackground: string;
  profileBackgroundOrignal: string;
  profileBGCropperObj: string;
  enableMembershipFunctionality?: boolean;
  version?: number;
  email: string;
  phone: string;
  creatorIp: string;
  parentUserId?: IUser;
  socialLinks?: ISocialLink;
  description: string;
  tags: string;
  tagLine: string;
  userSetupStatus: number;
  urlPath: string;
  verifiedPath: boolean;
  username: string;
  isDeleted: boolean;
  deletedAt: Date;
  isInfluencer: boolean;
  isCreative: boolean;
  isEducator: boolean;
  isActiveProfile: boolean;
  isEmailVerified: boolean;
  isActiveSeller: boolean;
  skipOnBoarding: boolean;
  sellerComissionRate: number;
  signupSource: string;
  sellerPlatformFee: number;
  sellerProcessingFee: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  links: IUserLink[];
  tempLinks: IUserLink[];
  servicesTitleEnabled: boolean;
  servicesTitleValue: string;
  linksTitleEnabled: boolean;
  linksTitleValue: string;
  isDeactivate?: boolean;
  stripe: {
    customerId: boolean;
  };
  coverPhoto: {
    image: string;
    isActive: boolean;
  };
  // Pop Live Props
  timeOffset: string;
  social: {
    facebook: {
      accessToken: string;
      refreshToken: string;
      profile: string;
    };
    instagram: {
      accessToken: string;
      refreshToken: string;
      profile: string;
    };
  };
  sundayPopLiveActive: boolean;
  sundayPopLiveSlots: string;
  mondayPopLiveActive: boolean;
  mondayPopLiveSlots: string;
  tuesdayPopLiveActive: boolean;
  tuesdayPopLiveSlots: string;
  wednesdayPopLiveActive: boolean;
  wednesdayPopLiveSlots: string;
  thursdayPopLiveActive: boolean;
  thursdayPopLiveSlots: string;
  fridayPopLiveActive: boolean;
  fridayPopLiveSlots: string;
  saturdayPopLiveActive: boolean;
  saturdayPopLiveSlots: string;
  stripeSellerAccountId: string;
  isGuest: boolean;
  phoneNumber?: string;
  shoutoutHoursToDeliver: number;
  fanmailHoursToDeliver: number;
  popLiveOrderBuffer: number;
  betaStatus: number;
  invitationHash: string;
  invitationActive: boolean;
  inviationStatus: string;
  userStatus: string;
  isAffiliate: boolean;
  isSuperAffiliate: boolean;
  allowPopLive: boolean;
  referralId: IUser;
  userThemeId: ITheme;
  allowSelling: boolean;
  idIsVerified: boolean;
  allowPopCreate: boolean;
  isInvitedUser: boolean;
  library: ILibrary[];
  pageTitle: string;
  socialMediaLinks: { url: string; type: string; _id: string }[];
  enableSystemThemeAccess?: boolean;
  allowPromotions?: boolean;
  isPhoneNumberSkip?: boolean;
  isPhoneNumberVerified?: boolean;
  _id?: string;
  allowPurchases?: boolean;
  ghostMode?: boolean;
  idIsVerified?: boolean;
  showPurchaseMenu?: boolean;
  showSellerMenu?: boolean;
  isAcctManager?: boolean;
  enableTmRecieve?: boolean;
  enableTmSend?: boolean;
  isSupportAgent?: boolean;
  isCreator?: boolean;
  isPasswordSet?: boolean;
  onboardingTypeId?: number;
  idVerificationStatus?: string;
  rulesActive?: boolean;
  allowPaymentExport?: boolean;
  allowTicketPunch?: boolean;
  gaTrackers?: { id: string; isActive: boolean }[];
  managerList?: MangerItem[];
  managedList?: MangerItem[];
  isSpManaged?: boolean;
};
