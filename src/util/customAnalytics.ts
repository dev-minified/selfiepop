import { AnalyticsPlugin } from 'analytics';
import { postEvent } from 'api/analytics';
import dayjs from 'dayjs';
import Utc from 'dayjs/plugin/utc';
dayjs.extend(Utc);
type payloadType = {
  event: string;
  anonymousId: string;
  meta: Record<string, any>;
  options: Record<string, any>;
  properties?: Record<string, any>;
  type: string;
  userId: string;
};
type props = {
  payload: payloadType;
};
/* custom logger plugin */

const eventMapper = (p: payloadType): SPEvent => {
  return {
    eventSlug: p.event,
    metadata: { ...p.meta, ...p.properties, date: dayjs.utc().format() },
    anonymousId: p.anonymousId,
    userId: p.userId,
  };
};

const customAnalyticsPlugin: AnalyticsPlugin = {
  name: 'my-custom-whatever',
  page: (props: props) => {
    const payload = props.payload;
    postEvent(eventMapper({ ...payload, event: 'pageview' }));
  },
  track: (props: props) => {
    const payload = props.payload;
    postEvent(eventMapper(payload));
  },
  identify: (props: props) => {
    const payload = props.payload;
    postEvent(eventMapper({ ...payload, event: 'identify' }));
  },
  loaded: () => {
    return true;
  },
};

export default customAnalyticsPlugin;
