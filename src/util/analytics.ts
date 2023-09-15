import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';
import { GOOGLE_TRACK } from 'config';
import customAnalyticsPlugin from './customAnalytics';

/**
 * Initialize analytics with perfumejs plugin and include any
 * third party analytics tool you'd like the perf data to be sent to
 */
const analytics = Analytics({
  app: 'my-app',
  plugins: [
    // Custom plugins to now send perf data to
    customAnalyticsPlugin,
    googleAnalytics({
      measurementIds: [GOOGLE_TRACK],
    }),
  ],
});

export default analytics;
