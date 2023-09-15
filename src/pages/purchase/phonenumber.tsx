import { update, updateGuestUser, updatePhoneNumber } from 'api/User';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { setGuestUser } from 'store/reducer/checkout';
import styled from 'styled-components';
import * as yup from 'yup';
import { getCookieByName, parseQuery } from '../../util';
import SetPhoneNumber from './component/Setphone';

dayjs.extend(utc);
dayjs.extend(timezone);

const validationSchema = yup.object().shape({
  phone: yup
    .string()
    .max(14)
    .matches(
      /^$|^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      'Invalid Phone Number',
    )
    .required('Enter Phone Number'),
});
function PhoneNumber({ className }: { className?: string }) {
  const order = useAppSelector((state) => state.checkout?.order);
  const guestUser = useAppSelector((state) => state.checkout?.guestUser);
  const gTokens = useAppSelector((state) => state.checkout?.tokens);
  const publicUser = useAppSelector((state) => state.global.publicUser);
  const { user, loggedIn } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { order: orderId, userId } = parseQuery(location.search);
  const dispatch = useAppDispatch();

  const {
    values,
    setValues,
    setFieldValue,
    isSubmitting,
    setSubmitting,
    handleSubmit,
  } = useFormik({
    validationSchema,
    initialValues: {
      phone: loggedIn
        ? user?.phone || user?.phoneNumber
        : guestUser?.data?.phone || guestUser?.data?.phoneNumber || '',
    },
    onSubmit: async () => {
      return await onSendOTP();
    },
  });
  useEffect(() => {
    if (user?._id) {
      if (user?.isPhoneNumberVerified) {
        history.push(
          `/messages/subscriptions?userId=${publicUser?._id}&type=chat`,
        );
      } else setValues({ phone: user?.phone || user?.phoneNumber });
    } else {
      setValues({
        phone: guestUser?.data?.phone || guestUser?.data?.phoneNumber,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, guestUser?.data?._id]);

  const setUserAcc = async (
    isPhoneSkiped: boolean,
    isPhoneVerified: boolean,
  ) => {
    if (!user?._id) {
      const resp = await updateGuestUser({
        skipOnBoarding: true,
        allowSelling: false,
        timeOffset: dayjs.tz.guess(),
        isPhoneNumberSkip: isPhoneSkiped,
        isPhoneNumberVerified: isPhoneVerified,
      });

      dispatch(setGuestUser({ ...guestUser, ...resp }));
      return resp;
    } else {
      return await update({
        isPhoneNumberSkip: isPhoneSkiped,
        isPhoneNumberVerified: isPhoneVerified,
      }).then((res) => {
        return res;
      });
    }
  };
  const onSendOTP = async () => {
    try {
      try {
        await updatePhoneNumber(
          values.phone,
          getCookieByName('token') || gTokens?.token,
        );
      } catch (error: any) {
        if (error?.message) {
          toast.error(
            error?.message || `OTP sending failed. Please try again! `,
          );
        }
        return;
      }

      const user = await setUserAcc(false, false);
      toast.success(`8 digit OTP number sent to your contact number!`);
      // history.push(`/${username}/purchase/set-password?order=${orderId}`);
      history.push(
        `/${username || publicUser?.username}/purchase/verify-phone?orderId=${
          orderId || order?._id
        }&userId=${userId}`,
      );
      return user;
    } catch (e) {
      console.error(e);
    }
  };
  const onSkip = async (e?: any) => {
    try {
      e?.preventDefault();
      setSubmitting(true);
      await setUserAcc(true, false);
      setSubmitting(false);

      if (user?._id) {
        history.push(
          `/messages/subscriptions?userId=${
            publicUser?._id || order?.seller?._id
          }&type=chat`,
        );
        return;
      } else {
        const resp = await updateGuestUser({
          skipOnBoarding: true,
          allowSelling: false,
          timeOffset: dayjs.tz.guess(),
          isPhoneNumberSkip: true,
          isPhoneNumberVerified: false,
        });
        dispatch(setGuestUser({ ...guestUser, ...resp }));
      }
      return history.push(
        `/${username || publicUser?.username}/purchase/set-password?orderId=${
          orderId || order?._id
        }&userId=${userId}`,
      );
    } catch (e) {
      setSubmitting(false);
      console.error(e);
    }
    history?.push(
      `/${username || publicUser?.username}/purchase/set-password?orderId=${
        orderId || order?._id
      }&userId=${userId}`,
    );
  };
  return (
    <>
      <div className={className}>
        <SetPhoneNumber
          phone={values.phone}
          onSubmit={async (values) => {
            setFieldValue('phone', values.phone);
            return await handleSubmit();
          }}
          bottomLinkSettings={{
            text: 'Skip this step',
            onClick: onSkip,
            showbottomLink: true,
          }}
          showAvatar={true}
          seller={typeof order?.seller === 'object' ? order.seller : publicUser}
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
}
export default styled(PhoneNumber)``;
