type ISocialIcon = {
  iconColor?: string;
  iconColorHistory?: string[];
};

type ICover = {
  image?: string;
  size?: string;
  style?: string;
  isActive?: boolean;
  useProfileImage?: boolean;
  profileImage?: string;
  backgroundColor?: string;
  opacity?: number;
  grayscale?: number;
  backgroundColorHistory?: string[];
  outlineColor?: string;
  outlineColorHistory?: string[];
  blendMode?: string;
  avatarPlaceholderColor?: string;
  avatarPlaceholderColorHistory?: string[];
  pstyle?: string;
  profileVideo?: {
    desktop?: string;
    mobile?: string;
    active?: boolean;
  };
};
type IButton = {
  style?: string;
  buttonColor?: string;
  buttonColorHistory?: string[];
  buttonRollOverColor?: string;
  buttonRollOverColorHistory?: string[];
  shadowColor?: string;
  shadowColorHistory?: string[];
  shadowRollOverColor?: string;
  shadowRollOverColorHistory?: string[];
  textColor?: string;
  textColorHistory?: string[];
  textRollOverColor?: string;
  textRollOverColorHistory?: string[];
  outlineColor?: string;
  outlineColorHistory?: string[];
  outlineRollOverColor?: string;
  outlineRollOverColorHistory?: string[];
};
type IBackground = {
  type?: 'color' | 'image' | 'video';
  subtype?: 'solid' | 'gradient';
  image?: string;
  imageBlur?: number;
  video?: string;
  videoOpacity?: number;
  layout?: string;
  pattern?: string;
  opacity?: number;
  solidColor?: string;
  solidColorHistory?: string[];
  gradientTop?: string;
  gradientTopHistory?: string[];
  gradientBottom?: string;
  gradientBottomHistory?: string[];
  gradientOrientation?: string;
  isVideoAdvanceActive?: boolean;
  patternColor?: string;
  patternColorHistory?: string[];
  gradient?: IGradient;
  videoBlendMode?: string;
  imageBlendMode?: string;
  imageOpacity?: number;
  colorOpacity?: number;
  colorBlendMode?: string;
  patternOpacity?: number;
  isPatternActive?: boolean;
};
type IAdditional = {
  titleSize?: string;
  titleColor?: string;
  titleColorHistory?: string[];

  sectionTitleSize?: string;
  sectionTitleColor?: string;
  sectionTitleColorHistory?: string[];

  taglineSize?: string;
  taglineColor?: string;
  taglineColorHistory?: string[];

  descriptionSize?: string;
  descriptionColor?: string;
  descriptionColorHistory?: string[];

  iconSecondaryColor?: string;
  iconSecondaryColorHistory?: string[];
  iconPrimaryColor?: string;
  iconPrimaryColorHistory?: string[];
  subtype?: 'solid' | 'gradient';
  gradient?: IGradient;
  solidColor?: string;
  solidColorHistory?: string[];
  iconColor?: string;
  titleFontSize?: string;
};
type IChat = {
  titleSize?: string;
  titleColor?: string;
  titleColorHistory?: string[];

  descriptionSize?: string;
  descriptionColor?: string;
  descriptionColorHistory?: string[];

  subtype?: 'solid' | 'gradient';
  gradient?: IGradient;
  solidColor?: string;
  solidColorHistory?: string[];

  inputsBackground?: string;
  inputsBackgroundHistory?: string[];

  inputsTextColor?: string;
  inputsTextColorHistory?: string[];

  placeholderColor?: string;
  placeholderColorHistory?: string[];

  inputSvgColor?: string;
  inputSvgColorHistory?: string[];

  inputBorderColor?: string;
  inputBorderColorHistory?: string[];
  inputBorderStyle?: { label: string; value: string };
  inputErrorColor?: string;
};

type IGradient = {
  angle: number;
  pallette: { offset: string; id: number; color: string; opacity?: number }[];
};
type ITheme = {
  _id?: string;
  name?: string;
  isSystemTheme?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  previewThumbnailPath?: string;
  profile?: ICover;
  cover?: ICover;
  button?: IButton;
  background?: IBackground;
  additional?: IAdditional;
  chat?: IChat;
  socialIcon?: ISocialIcon;
  font?: Font;
  isPublished?: boolean;
  isRendering?: boolean;
  categoryId?: string;
  category?: any;
};
type ThemeProps = {
  userThemes: ITheme[];

  systemThemes: ITheme[];
  totalThemesCount?: { userThemeCount: 0; systemthemeCount: 0 };
};
