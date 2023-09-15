import { updateGuestUser } from 'api/User';
import { getCounterLabel } from 'api/Utils';
import { actions } from 'context/Auth';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import {
  resetOrder,
  setGuestUser,
  setGuestUserTokens,
} from 'store/reducer/checkout';
import { headerCount } from 'store/reducer/counter';
import {
  setIsPurchaseHeader,
  setPurchaseHeaderUrl,
} from 'store/reducer/headerState';
import SetPasswordForm from '../../components/PasswordFrom';
import { parseQuery, removeLocalStorage } from '../../util';
dayjs.extend(utc);
dayjs.extend(timezone);

export default function MyProfile() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { orderId, userId } = parseQuery(location.search);
  const order = useAppSelector((state) => state.checkout?.order);
  const guestUser = useAppSelector((state) => state.checkout?.guestUser);
  const gtokens = useAppSelector((state) => state.checkout?.tokens);
  const subscription = useAppSelector((state) => state.counter);
  const publicUser = useAppSelector((state) => state.global.publicUser);
  const { user, setToken, setUser } = useAuth();
  const title =
    'Ok, you are all set. Before we send you to your order page, please set your password so you can easily login to view your orders later as well.';
  const onSuccessCallback = () => {
    // history.push(`/my-purchases?order=${order}`);
    if (order?.popType === ServiceType.CHAT_SUBSCRIPTION) {
      // if (res.success && res.updatedOrder?.subscriptionId) {
      //   history.push(
      //     `/chat?subscription=${res.updatedOrder?.subscriptionId}`,
      //   );
      // } else {
      // history.push(`/chat`);
      if (!subscription?.subscription) {
        getCounterLabel()
          .then((counter) => {
            if (!counter.cancelled) {
              dispatch(headerCount(counter));
            }
          })
          .catch(console.error);
      } else {
        dispatch(
          headerCount({
            ...subscription,
            subscription: (subscription?.subscription || 0) + 1,
          }),
        );
      }
      history.push(
        `/messages/subscriptions?userId=${publicUser?._id}&type=chat`,
      );
      // }
    } else {
      history.push(`/my-purchases?userId=${userId}&order=${orderId}`);
    }
    removeLocalStorage('passwordset');
    dispatch(resetOrder());
  };
  const onBeforeSubmit = async () => {
    // history.push(`/my-purchases?order=${order}`);
    if (
      order?.popType === ServiceType.CHAT_SUBSCRIPTION &&
      !user?._id &&
      guestUser?.data
    ) {
      const resp = await updateGuestUser({
        skipOnBoarding: true,
        allowSelling: false,
        timeOffset: dayjs.tz.guess(),
        isPhoneNumberSkip: true,
        isPhoneNumberVerified: false,
      });
      delete resp?.data['themeColor'];

      setToken(gtokens?.token || '', gtokens?.refreshToken || '');
      setUser({
        ...guestUser.data,
        ...resp.data,
        skipOnBoarding: true,
        showPurchaseMenu: true,
        allowSelling: false,
        isPhoneNumberSkip: true,
        isPhoneNumberVerified: false,
      });
      dispatch({ type: actions.isAuthenticated, payload: true });
      dispatch(setGuestUser({}));
      dispatch(setGuestUserTokens({}));
      return resp;
    }
    return true;
  };
  useEffect(() => {
    if (order?._id && order?.popType === ServiceType.CHAT_SUBSCRIPTION) {
      if (user?.isPhoneNumberVerified) {
        dispatch(setIsPurchaseHeader(false));
      } else {
        dispatch(
          setPurchaseHeaderUrl(
            `/${publicUser?.username}/purchase/set-phone?order=${
              orderId || order?._id
            }&userId=${publicUser?._id}`,
          ),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?._id, publicUser?._id]);
  return (
    <>
      <SetPasswordForm
        onBeforeSubmit={onBeforeSubmit}
        onSuccessCallback={onSuccessCallback}
        title={title}
      />
    </>
  );
}
