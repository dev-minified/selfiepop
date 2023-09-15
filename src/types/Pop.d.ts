// import { IAdditionalArt } from '.';
// import { MediaType } from './ChatSubscription';

type PriceVariant = {
  _id?: string;
  title: string;
  price: number;
  isArchive?: boolean;
  isDefault?: boolean;
  isDeleted?: boolean;
  allowBuyerToMessage?: boolean;
  allowContentAccess?: boolean;
  allowUpsaleOffer?: boolean;
  questions?: any[];
  type?: string;
  description: string;
  sort?: number;
  isActive: boolean;
  stats?: { type: string; value: string };
};

type ResponseOptions = {
  value?: boolean;
  text?: string;
  key?: string;
};
type Questions = {
  _id?: string;
  title?: string;
  text?: string;
  responseType?: string;
  responseOptions?: ResponseOptions[];
  responseValue?: string;
  attachements?: { name?: string; url?: string; type?: string }[];
  isRequired?: boolean;
  isActive?: boolean;
  questionHint?: string;
  type?: { label: string; value: string };
};

type IPopMedia = MediaType & {
  sortOrder?: number;
  title?: string;
};

type IDigitalDownloads = {
  type: string;
  path: string;
  pathOrignal: string;
  pathCropperObj: string;
  name: string;
  size: number;
  isActive: boolean;
};

type IPop = {
  label?: string;
  title?: string;
  _id?: string;
  altOptions?: [];
  popName?: string;
  description?: string;
  actionText?: string;
  isActive?: boolean;
  isThumbnailActive?: boolean;
  popType?: string;
  price?: number;
  owner?: any;
  popThumbnail?: string | null;
  questions?: Questions[];
  additionalArt?: IAdditionalArt[];
  digitalDownloads?: IDigitalDownloads[];
  priceVariations?: PriceVariant[];
  timeIntervalBetweenEvents?: number;
  tes?: number;
  popLiveAdditionalPrice?: number;
  popLiveAdditionalTime?: number;
  pricePerAdditionalFiveMinutes?: number;
  weeklyHours?: {
    dayOfTheWeek?: 'Sun' | 'Sat' | 'Fri' | 'Thu' | 'Wed' | 'Tue' | 'Mon';
    startTime?: string;
    endTime?: string;
  }[];
  duration?: number;
  timeZone?: string;
  monEnabled?: boolean;
  tueEnabled?: boolean;
  wedEnabled?: boolean;
  thuEnabled?: boolean;
  friEnabled?: boolean;
  satEnabled?: boolean;
  sunEnabled?: boolean;
  socialMediaSorting?: string[];
  updatedAt?: string;
  createdAt?: string;
  dateOrderStarted?: string;
  orderStatus?: string;
};
