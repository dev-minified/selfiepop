// export const API_URL = 'http://localhost:3001';
export const API_URL = process.env.REACT_APP_SERVER_URL;
// export const API_URL = 'https://api.dev.selfiepop.com';
// export const API_URL = 'https://a80b-192-140-147-37.ngrok.io';
// export const API_URL = 'https://api.stage.selfiepop.com';
// export const API_URL = 'https://api.selfiepop.com';
export const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_URL;
// dev
// export const ANALYTICS_URL = "https://qag5a1akr7.execute-api.us-west-2.amazonaws.com";
export const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT;
export const VERSION = process.env.REACT_APP_VERSION;
export const S3_URL = process.env.REACT_APP_S3_URL;
export const CLOUD_FRONT_S3 = process.env.REACT_APP_CLOUDFRONT_S3_BUCKET;
// Prod
// export const CLOUD_FRONT_S3_IMAGES_BUCKET =
//   'https://d3r98ptv26mqnz.cloudfront.net';
export const CLOUD_FRONT_S3_IMAGES_BUCKET =
  process.env.REACT_APP_CLOUDFRONT_S3_IMAGES_BUCKET;
export const CLOUD_FRONT_THUMBNAI =
  process.env.REACT_APP_CLOUDFRONT_S3_BUCKET_THUMBNAIL;
// prod
// export const CLOUD_FRONT_THUMBNAI =
// 'https://d29lys80xf47b6.cloudfront.net';
export const LIGHTGALLARYLICENCEKEY =
  process.env.REACT_APP_LIGHTGALLARYLICENCEKEY;
export const COUNTRY_API_KEY = process.env.REACT_APP_COUNTRIES_API_KEY;
export const COUNTRY_API_EMAIL = process.env.REACT_APP_COUNTRIES_API_EMAIL;
export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
export const GOOGLE_FONT_KEY = process.env.REACT_APP_GOOGLE_FONT_KEY;
export const SENTRY_DNS = process.env.REACT_APP_SENTRY_DSN;
export const CHIME_URL = process.env.REACT_APP_CHIME_URL;
export const IMAGE_UPLOAD_URL = process.env.REACT_APP_IMAGE_URLS;
export const GOOGLE_TRACK = process.env.REACT_APP_GOOGLE_TRACKING_ID as string;
export const POP_LINK_DISABLE = !(
  process.env.REACT_APP_POP_LINK_DISABLE === 'true'
);
export const POP_YOUTUBE_VIDEO_DISABLE = !(
  process.env.REACT_APP_POP_YOUTUBE_VIDEO_DISABLE === 'true'
);
export const POP_CUSTOM_VIDEO_DISABLE = !(
  process.env.REACT_APP_POP_CUSTOM_VIDEO_DISABLE === 'true'
);
export const POP_PAID_FANMAIL_DISABLE = !(
  process.env.REACT_APP_POP_PAID_FANMAIL_DISABLE === 'true'
);
export const POP_BIOGRAPHY_DISABLE = !(
  process.env.REACT_APP_POP_BIOGRAPHY_DISABLE === 'true'
);
export const POP_LIVE_DISABLE = !(
  process.env.REACT_APP_POP_LIVE_DISABLE === 'true'
);
export const POP_PAID_PROMOTIONS_DISABLE = !(
  process.env.REACT_APP_POP_PAID_PROMOTIONS_DISABLE === 'true'
);
export const POP_CUSTOM_SERVICES_DISABLE = !(
  process.env.REACT_APP_POP_CUSTOM_SERVICES_DISABLE === 'true'
);
export const POP_DIGITAL_DOWNLOADS_DISABLE = !(
  process.env.REACT_APP_POP_DIGITAL_DOWNLOADS_DISABLE === 'true'
);
export const POP_CHAT_SUBSCRIPTION_DISABLE = !(
  process.env.REACT_APP_POP_CHAT_SUBSCRIPTION_DISABLE === 'true'
);
// export const POP_COURSE_DISABLE = !(
//   process.env.REACT_APP_POP_COURSE_DISABLE === 'true'
// );
export const POP_SECTION_TITLE_DISABLE = !(
  process.env.REACT_APP_POP_SECTION_TITLE_DISABLE === 'true'
);
export const POP_CONTENT_BLOCK_DISABLE = !(
  process.env.REACT_APP_POP_CONTENT_BLOCK_DISABLE === 'true'
);
// export const ENABLE_ADD_SERVICE =
//   process.env.REACT_APP_ENABLE_ADD_SERVICE === 'true';

export const LOG_ROCKET_APP_ID = process.env.REACT_APP_LOG_ROCKET_APP_ID;
export const VIDEOURL = 'pops/order-videos/';
export const SP_HOUSE_ID = process.env.REACT_APP_SP_HOUSE_ID;
