import { useCallback, useEffect } from 'react';
import { useAnalytics } from 'use-analytics';
import { getLocalStorage } from 'util/index';

const SpFrontEndErrors = () => {
  const analytics = useAnalytics();

  const onWindowError = useCallback((e: ErrorEvent) => {
    let user = getLocalStorage('user', true);
    if (!user?._id) {
      user = getLocalStorage('guestUser')?.data || {};
    }

    analytics.track('react_error', {
      message: e?.message,
      location: window.location.href,
      email: user?.email,
      userId: user?._id || ' ',
    });
    return true;
  }, []);

  useEffect(() => {
    window.addEventListener('error', onWindowError);
    return () => {
      window.removeEventListener('error', onWindowError);
    };
  }, []);
  return null;
};

export default SpFrontEndErrors;
