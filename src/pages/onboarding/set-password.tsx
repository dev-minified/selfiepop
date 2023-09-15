import { update } from 'api/User';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAnalytics } from 'use-analytics';
import SetPasswordForm from '../../components/PasswordFrom';
import useAuth from '../../hooks/useAuth';
import { getUserSetupUri, setLocalStorage } from '../../util';

export default function OnboardingBio() {
  const history = useHistory();
  const { user, setUser } = useAuth();
  const analytics = useAnalytics();

  const title =
    'Ok, you are all set. Before we send you to your pop page, please set your password so you can login to manage your orders and your pop page later.';

  const onSuccessCallback = () => {
    setUser({
      ...user,
      userSetupStatus: 10,
      isActiveProfile: true,
      showPurchaseMenu: true,
    });
    analytics.track('Set Password', {
      url: window.location.href,
    });
    const url = getUserSetupUri(10);
    setLocalStorage('onBoardingTour', 'true', false);
    history.push(url);
  };
  useEffect(() => {
    if (user?.userSetupStatus !== 3 && user?.userSetupStatus < 9) {
      setUser({
        ...user,
        userSetupStatus: 3,
      });
      update({
        userSetupStatus: 3,
      });
    }
  }, []);

  return (
    <>
      <SetPasswordForm
        onSuccessCallback={onSuccessCallback}
        requestProps={{ userSetupStatus: 10, isActiveProfile: true }}
        title={title}
      />
    </>
  );
}
