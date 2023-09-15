import { update, updateGuestUser, verifyPhoneOTP } from 'api/User';
import { LOGS_EVENTS } from 'appconstants';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { setGuestUser, setGuestUserTokens } from 'store/reducer/checkout';
import { setPurchaseHeaderUrl } from 'store/reducer/headerState';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { getCookieByName, parseQuery } from 'util/index';
import * as yup from 'yup';

import useAuth from 'hooks/useAuth';
import SetPhoneNumber from './component/PhoneVerify';
dayjs.extend(utc);
dayjs.extend(timezone);

const validationSchema = yup.object().shape({
  otp: yup
    .number()
    .min(8, 'Please enter 8 digit number you were sent over text')
    .required('OTP is required'),
});
function PhoneNumber({ className }: { className?: string }) {
  const order = useAppSelector((state) => state.checkout?.order);
  const guestUser = useAppSelector((state) => state.checkout?.guestUser);
  const publicUser = useAppSelector((state) => state.global?.publicUser);
  const { setUser, setToken, setLoggedData, user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { order: orderId, userId } = parseQuery(location.search);
  const appdispatch = useAppDispatch();
  const analytics = useAnalytics();

  const { values, isSubmitting, resetForm, setFieldValue, handleSubmit } =
    useFormik({
      validationSchema,
      initialValues: {
        otp: undefined,
      },
      onSubmit: async () => {
        await onVerifyOTP();
      },
    });
  const onVerifyOTP = async () => {
    try {
      await verifyPhoneOTP(values?.otp + '');
      analytics.track(LOGS_EVENTS.phone_added, {});
    } catch (e: any) {
      if (e?.message) {
        toast.error(
          e?.message || `Your Phone number is not verified Please try again. `,
        );
      }
      return;
    }
    try {
      if (!user?._id) {
        const resp = await updateGuestUser({
          skipOnBoarding: true,
          allowSelling: false,
          timeOffset: dayjs.tz.guess(),
          isPhoneNumberSkip: false,
          isPhoneNumberVerified: true,
        });
        setToken(guestUser.token, guestUser.refreshToken);
        setUser({
          ...guestUser.data,
          ...resp.data,
          skipOnBoarding: true,
          showPurchaseMenu: true,
          allowSelling: false,
          isPhoneNumberSkip: false,
          isPhoneNumberVerified: true,
          passwordset: false,
        });
        toast.success('Your Phone number is verified.');
        appdispatch(setGuestUser({}));
        appdispatch(setGuestUserTokens({}));
        history.replace(
          `/${username}/purchase/set-password?orderId=${
            orderId || order?._id
          }&userId=${userId}`,
        );
      } else {
        await update({ ...values }).then((res) => {
          resetForm();
          toast.success('Your Phone number is verified.');
          setLoggedData({
            data: {
              ...res.data,
              isPhoneNumberVerified: true,
              showPurchaseMenu: true,
            },
            token: getCookieByName('token'),
          });
          appdispatch(setGuestUser({}));
          appdispatch(setGuestUserTokens({}));

          history.replace(
            `/messages/subscriptions?userId=${
              publicUser?._id || order?.seller?._id
            }&type=chat`,
          );
        });
      }

      // history.push(`/${username}/purchase/verify-phone`);
    } catch (e: any) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (user && user?.isPhoneNumberVerified) {
      history.push(
        `/messages/subscriptions?userId=${
          publicUser?._id || order?.seller?._id
        }&type=chat`,
      );
    } else {
      const locationn = `/${
        publicUser?.username || order?.seller?.username
      }/purchase/set-phone${location.search}`;
      appdispatch(setPurchaseHeaderUrl(locationn));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  return (
    <div className={className}>
      <SetPhoneNumber
        otp={values.otp}
        onSubmit={async (values) => {
          setFieldValue('otp', values.otp);
          return await handleSubmit();
        }}
        bottomLinkSettings={{
          text: 'Go Back',
          onClick: () => {
            history.push(
              `/${username}/purchase/set-phone?order=${
                orderId || order?._id
              }&userId=${publicUser?._id || order?.seller?._id}`,
            );
          },
          showbottomLink: true,
        }}
        showAvatar={true}
        seller={order?.seller}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default styled(PhoneNumber)``;
