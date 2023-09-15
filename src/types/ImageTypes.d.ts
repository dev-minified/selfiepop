type ImageSizesProps = {
  url?: string;
  settings?: {
    checkspexist?: boolean;
    transform?: boolean;
    defaultSize?: string;
    defaultUrl?: string;
    mobile?: string;
    all?: string;
    desktop?: string;
    smobile?: string;
    onlyMobile?: boolean;
    bdesktop?: boolean;
    isThumbBdesktop?: boolean;
    onlyDesktop?: boolean;
    onlysMobile?: boolean;
    onlyxsmobile?: boolean;
    imgix?: {
      mobile?: string;
      all?: string;
      desktop?: string;
    };
  };
};
