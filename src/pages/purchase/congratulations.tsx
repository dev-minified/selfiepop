import { getCounterLabel } from 'api/Utils';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { resetOrder } from 'store/reducer/checkout';
import { headerCount } from 'store/reducer/counter';
// import { createLinks, updateGuestUser } from '../../api/User';
import { update } from '../../api/User';
import Button from '../../components/NButton';
import RadioGroup from '../../components/RadioGroup';
import useAuth from '../../hooks/useAuth';
import { onboardingSequency, parseQuery } from '../../util';
dayjs.extend(utc);
dayjs.extend(timezone);
export default function MyProfile() {
  const order = useAppSelector((state) => state.checkout?.order);
  const { user, setUser } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const publicUser = useAppSelector((state) => state.global.publicUser);
  const { order: orderId, userId } = parseQuery(location.search);
  const [confirmation, setConfirmation] = useState('yes');
  const [loading, setloading] = useState(false);
  const dispatch = useAppDispatch();
  const subscription = useAppSelector((state) => state.counter);

  const onNoClickHandler = async () => {
    try {
      const resp = await update({
        skipOnBoarding: true,
        allowSelling: false,
        timeOffset: dayjs.tz.guess(),
      });
      delete resp?.data['themeColor'];
      setUser({
        ...user,
        ...resp.data,
        skipOnBoarding: true,
        showPurchaseMenu: true,
        allowSelling: false,
      });
      if (order?.popType === ServiceType.CHAT_SUBSCRIPTION) {
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
        history.push(`/orders/my-purchases?userId=${userId}&order=${orderId}`);
      }
      dispatch(resetOrder());
    } catch (e) {
      console.error(e);
    }
  };

  const onTakeMeBoarding = async () => {
    try {
      const updateUserRequest = update({
        allowSelling: true,
        timeOffset: dayjs.tz.guess(),
      });
      await Promise.all([updateUserRequest])
        .then(([resp]) => {
          delete resp?.data['themeColor'];
          setUser({
            ...user,
            ...resp.data,
          });
          history.push(onboardingSequency[0]);
        })
        .catch(console.log);
    } catch (e) {
      console.error(e);
    }
    dispatch(resetOrder());
  };

  const checkConfirmation = async () => {
    setloading(true);
    await (confirmation === 'yes' ? onTakeMeBoarding : onNoClickHandler)();
    setloading(false);
  };

  return (
    <>
      <div className="profile--info mb-30">
        <h2 className="text-center">Congratulations, your order is all set!</h2>
        <h5 className="text-center">
          Would you like to setup your own free pop page just like{' '}
          <span className="text-primary">
            {(order?.seller?.pageTitle || publicUser?.pageTitle) ??
              'Incognito User'}
            's
          </span>{' '}
          so you can store your social media links all in one place?
        </h5>
      </div>
      <div className="mb-30">
        {/* FIXME: Radio buttons not working */}
        <RadioGroup
          name="confirmation"
          value={confirmation}
          border
          items={[
            { label: 'No thank you, I am good for now.', value: 'no' },
            {
              label: 'YES, I do want a better place to keep my links!',
              value: 'yes',
            },
          ]}
          onChange={(e: any) => {
            setConfirmation(e.target.value);
          }}
        />
        <div className="d-flex justify-content-center ">
          <Button
            htmlType="button"
            onClick={checkConfirmation}
            type="primary"
            size="large"
            isLoading={loading}
          >
            NEXT
          </Button>
        </div>
      </div>
    </>
  );
}
