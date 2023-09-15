type SocialLinksTpes =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'tiktok'
  | 'onlyfans'
  | 'snapchat';
type ISocialLink = {
  type?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: IUser;
  details?: any;
};

type SocialLink = {
  _id: string;
  name: string;
  url: string;
  type: SocialLinksTpes;
  stats?: any;
};
