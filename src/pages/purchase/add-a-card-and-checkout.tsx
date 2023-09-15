import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { chargeUser, fetchCards } from 'api/billing';
import { updateOrder } from 'api/Order';
import { checkUserName, getUser, updateGuestUser } from 'api/User';
import { getCounterLabel } from 'api/Utils';
import CardForm from 'components/AddCard/CardForm';
import Checkbox from 'components/checkbox';
import { AppAlert } from 'components/Model';
import Button from 'components/NButton';
import SignInPopUP from 'components/SignInPopUp';
import { STRIPE_PUBLIC_KEY } from 'config';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { useAnalytics } from 'use-analytics';

import useOpenClose from 'hooks/useOpenClose';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed';
import {
  setGuestUser as reduxSetGuestUser,
  setGuestUserTokens,
  setOrder,
} from 'store/reducer/checkout';
import { headerCount } from 'store/reducer/counter';
import styled from 'styled-components';

import { USERCHARGEBACKMESSAGE } from 'appconstants';
import PaymentWidget from 'components/PaymentWidget';
import { RequestLoader } from 'components/SiteLoader';
import { toast } from 'components/toaster';
import UserCards from 'components/UserCards';
import { actions } from 'context/Auth';
import { setCallbackForPayment } from 'store/reducer/cardModal';
import { parseQuery, slugify } from 'util/index';
import * as yup from 'yup';
import ChatSubCheckut from './ChatSubCheckut';
import GuestContactForm from './component/GuestContactForm';
import DynamicQuestionFrom from './dynamic-flow/QuestionForm';
dayjs.extend(utc);
dayjs.extend(timezone);
const apikey = STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(apikey === undefined ? '' : apikey);
type questiontype = Omit<Questions, 'title'> & {
  fieldName?: string;
  index?: number;
  title?: string | React.ReactElement;
  validationSchema?: any;
  validate?: any;
};
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  // name: yup.string().required('Name is required').trim(),
  pageTitle: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long!'),
  // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'At least one space is required'),
  phone: yup
    .string()
    .matches(
      /^$|^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      'Invalid Phone Number',
    ),
});

const AddCardAndCheckout = () => {
  const history = useHistory();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const {
    loggedIn,
    user: loggedUser,
    setUser,
    setToken,
    dispatch: authDispatch,
  } = useAuth();
  const ref = useRef<any>(null);

  const appdispatch = useAppDispatch();

  const [isAgeSet, setIsAgeSet] = useState(true);

  const [loading, setloading] = useState(false);

  const { order: orderId, type } = parseQuery(location.search);
  const order = useAppSelector((state) => state.checkout?.order);
  const subscription = useAppSelector((state) => state.counter);
  const guestUserContext = useAppSelector((state) => state.checkout?.guestUser);
  const gtokens = useAppSelector((state) => state.checkout?.tokens);

  const [isOpen, openSignPopUp, closeSignPopUp] = useOpenClose(false);
  const [disableEmail, setdisableEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [card, setCard] = useState();
  const analytics = useAnalytics();
  const [userCards, setUserCards] = useState([]);
  const [guestUser, setGuestUser] = useState({
    name: `${guestUserContext?.data?.firstName || ''} ${
      guestUserContext?.data?.lastName || ''
    }`.trim(),
    phone: guestUserContext?.data?.phone || '',
    email: guestUserContext?.data?.email || '',
    pageTitle: guestUserContext?.data?.pageTitle,
    password: '',
    username: slugify(guestUserContext?.data?.pageTitle),
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [isQuestionRequired, setIsQuestionRequired] = useState(false);
  const questionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setGuestUser((prev) => ({
      ...prev,
      name: `${order?.buyer?.firstName || ''} ${
        order?.buyer?.lastName || ''
      }`.trim(),
      phone: order?.buyer?.phone || '',
      email: type === ServiceType.CHAT_SUBSCRIPTION ? order?.buyer?.email : '',
      pageTitle: guestUserContext?.data?.pageTitle,
      username: slugify(guestUserContext?.data?.pageTitle),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 700);
  }, []);

  const onOpenSignInPop = () => {
    openSignPopUp();
  };
  const isNotChatSub = order?.popType !== ServiceType.CHAT_SUBSCRIPTION;
  const guestToLogin = (guestData: any) => {
    const guestUsers = { ...guestData };
    // eslint-disable-next-line
    const { themeColor, ...rest } = guestUsers?.data;

    authDispatch({ type: actions.isAuthenticated, payload: true });
    setUser({
      ...rest,
      isPasswordSet: true,
    });
    setToken(gtokens?.token || '', gtokens?.refreshToken || '');
    appdispatch(reduxSetGuestUser({}));
    appdispatch(setGuestUserTokens({}));
  };
  const onNext = useCallback(
    async (user: any) => {
      if (loggedUser?._id && !loggedUser?.allowPurchases) {
        toast.error(USERCHARGEBACKMESSAGE);

        history.replace('/my-profile');
        return;
      }
      if (isQuestionRequired) {
        AppAlert({
          title: 'Incomplete Fields',
          text: 'You must answer all the required questions before booking',
          onConfirm: () => {
            questionsRef?.current &&
              smoothScrollIntoView(questionsRef.current, {
                behavior: 'smooth',
                block: 'start',
                scrollMode: 'if-needed',
              });
          },
        });

        return;
      }
      setloading(true);
      try {
        await updateOrder(orderId as string, { questions });
        if (user?.stripe?.customerId) {
          appdispatch(
            setCallbackForPayment({
              callback: () =>
                chargeUser(
                  {
                    orderId,
                    isCreatingIntent: !!order?.price,
                  },
                  null,
                  appdispatch,
                ),
            }),
          );
          const res = await chargeUser(
            {
              orderId,
              isCreatingIntent: !!order?.price,
            },
            null,
            appdispatch,
          );
          if (res?.success && !loggedIn) {
            if (!isNotChatSub) {
              await updateGuestUser({
                skipOnBoarding: true,
                allowSelling: false,
                timeOffset: dayjs.tz.guess(),
                isPasswordSet: true,
              })
                .then((data) => {
                  guestToLogin({ ...guestUserContext, ...data });
                })
                .catch(() => {
                  guestToLogin({ ...guestUserContext });
                });
            } else {
              await updateGuestUser({
                timeOffset: dayjs.tz.guess(),
                isPasswordSet: true,
              })
                .then((data) => {
                  guestToLogin({ ...guestUserContext, ...data });
                })
                .catch(() => {
                  guestToLogin({ ...guestUserContext });
                });
            }
          }
          if (!isNotChatSub) {
            analytics.track('new_subscription', {
              purchasedFrom: order?.seller?._id,
              member_level_id: ServiceType.CHAT_SUBSCRIPTION,
              purchaseAmount: 0,
            });
          }
          analytics.track('purchase_end', {
            purchasedFrom: order?.seller?._id,
            purchaseTypeSlug: order?.popId?.popType,
            purchaseAmount: order?.price,
            itemId: order?.popId?._id,
          });

          appdispatch(setOrder(res?.updatedOrder));
          if (!loggedIn) {
            if (!isNotChatSub) {
              return history.replace(
                `/${username}/purchase/set-phone?order=${orderId}&userId=${order?.seller?._id}`,
              );
            } else {
              return history.replace(
                `/${username}/purchase/congratulations?order=${orderId}&userId=${order?.seller?._id}`,
              );
            }
          }
          await getUser(user._id).then((res) => setUser(res));

          if (order?.popType === ServiceType.CHAT_SUBSCRIPTION) {
            if (!subscription?.subscription) {
              getCounterLabel()
                .then((counter) => {
                  if (!counter.cancelled) {
                    appdispatch(headerCount(counter));
                  }
                })
                .catch(console.error);
            } else {
              appdispatch(
                headerCount({
                  ...subscription,
                  subscription: (subscription?.subscription || 0) + 1,
                }),
              );
            }
            if (!user?.isPhoneNumberVerified) {
              return history.replace(
                `/${username}/purchase/set-phone?order=${orderId}&userId=${order?.seller?._id}`,
              );
            } else {
              history.replace(
                `/messages/subscriptions?userId=${order?.seller?._id}&type=chat`,
              );
            }
          } else {
            history.replace(`/orders/my-purchases?order=${orderId}`);
          }
          // appdispatch(resetOrder());
        }
      } catch (e: any) {
        if (e && e?.message) {
          toast.error(e?.message);
        }
        console.error(e);
      }
      setloading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isQuestionRequired,
      questions,
      orderId,
      appdispatch,
      loggedIn,
      history,
      username,
      setUser,
    ],
  );

  useEffect(() => {
    fetchBillingCards();
    handleQuestionChanges(order?.questions || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBillingCards = async () => {
    // FIXME: In case on guest user there no Stripe Customer ID

    if (loggedIn) {
      try {
        setIsLoading(true);
        const response = await fetchCards();
        setUserCards(response?.sources || []);
        setIsLoading(false);
        setCard(response?.sources.find((item: any) => item.isPrimary));
        if (!!response?.sources?.length) {
          setIsAgeSet(true);
        }
        return response;
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  const onSuccessLoginCB = async (user?: IUser) => {
    if (!user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      closeSignPopUp();
      history.replace('/my-profile');
      return;
    }
    setdisableEmail(true);
    ref.current?.click();
    closeSignPopUp();
  };
  const validateUsername = async (value: string) => {
    const reg = /[^A-Za-z0-9-_\s]/g;
    let msg = '';
    if (value && reg.test(value)) {
      msg = 'Name Can only contain - and _ along with alpha-numeric characters';
      // setFieldError(
      //   'pageTitle',
      //   'Username Can only contain - and _ along with alpha-numeric characters',
      // );
      return msg;
    }
    if (!value) {
      msg = 'Name is required';
      return msg;
    }

    const slug = slugify(value);
    if (slug?.length <= 2) {
      // setFieldError(
      //   'pageTitle',
      //   'Username must be at least 3 characters long!',
      // );
      msg = 'Name must be at least 3 characters long!';
      return msg;
    }
    // setFieldError('pageTitle', undefined);
    // setCLoader({ username: value });
    // setIsCheckingUserName(true);
    return checkUserName(slug)
      .then(() => {
        // setCLoader({});
        // setFieldError('pageTitle', undefined);
        return msg;
        // onGuestInputDataChange({ username: slug, pageTitle: value });
      })
      .catch(() => {
        // setCLoader({});
        // setFieldError('pageTitle', 'Username has already been taken');
        msg = 'Name has already been taken';
        return msg;
      })
      .finally(() => {
        // setIsCheckingUserName(false);
      });
  };
  const guestUserUpdate = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      await validationSchema.validate(guestUser);
      let isAllowTocreate = '';
      if (
        isNotChatSub &&
        !loggedUser?._id &&
        guestUser?.pageTitle &&
        guestUser.pageTitle !== guestUserContext.data.pageTitle
      ) {
        isAllowTocreate = await validateUsername(guestUser?.pageTitle || '');
      }

      if (isAllowTocreate) {
        throw Error(isAllowTocreate);
      }
      const name = guestUser.name?.replace(/\s{2,}/g, ' ').trim();
      let firstName = name?.split(' ').slice(0, -1)?.join(' ');
      let lastName = name?.split(' ').slice(-1)?.join(' ');
      if (!firstName) {
        firstName = lastName;
        lastName = '';
      }
      const gu = await updateGuestUser({
        ...guestUser,
        firstName,
        lastName,
        isPasswordSet: true,
      });
      appdispatch(reduxSetGuestUser({ ...guestUserContext, ...gu }));
      return gu;
    } catch (e) {
      throw e;
    }
  };
  const handleQuestionChanges = (questions: questiontype[]) => {
    const isRequired =
      order?.popType !== ServiceType.SHOUTOUT &&
      questions?.some((q) => {
        if (q.isRequired) {
          if (q.responseType === 'file') {
            return q.attachements && q.attachements?.length < 1;
          }
          if (q.responseType === 'selectList') {
            return !(
              q.responseOptions &&
              q.responseOptions?.find((r) => r?.value)?.value
            );
          }
          if (q.responseValue?.trim() === '') {
            return true;
          }
        }

        return false;
      });
    setIsQuestionRequired(!!isRequired);
  };
  const platformFee = !!order?.price
    ? (order?.orderPlatformFee / 100) * order?.price + 0.5
    : 0;
  const isPaid = order?.price + platformFee > 0;
  const RenderPaymentWidget = useCallback(() => {
    return (
      <>
        <PaymentWidget className="mb-30" order={order} seller={order?.seller} />
        <hr className="d-none" />
      </>
    );
  }, [order, order?.seller]);
  const requestPaymentButton = useCallback(
    ({ isLoading, ...props }: any) => {
      const platformFee = !!order?.price
        ? (order?.orderPlatformFee / 100) * order?.price + 0.5
        : 0;
      const isDisable = !isNotChatSub && !isAgeSet;
      const Price = (order?.price + platformFee || 0).toFixed(2);
      return (
        <div>
          {!isNotChatSub && (
            <>
              <RenderPaymentWidget />
              <div className="agewidget">
                <Checkbox
                  className="make_it_required"
                  name="agelimit"
                  onChange={(e: any) => {
                    setIsAgeSet(e.target.checked);
                  }}
                  label="I am 18 years of age or older"
                  value={isAgeSet}
                />
              </div>
            </>
          )}
          <div className="d-flex justify-content-center">
            <Button
              type="primary"
              size="x-large"
              block
              isLoading={isLoading || loading}
              disabled={isLoading || loading || isDisable}
              className="mb-0"
              htmlType="submit"
              ref={ref}
              {...props}
            >
              {isNotChatSub
                ? order?.price + platformFee > 0
                  ? `Order for $${Price}`
                  : `Order`
                : order?.price + platformFee > 0
                ? `Get Access for $${Price}`
                : `Get Free Access`}
            </Button>
          </div>
        </div>
      );
    },
    [order, isAgeSet, isNotChatSub, setIsAgeSet, ref, loading],
  );
  if (isLoading) {
    return <RequestLoader isLoading />;
  }
  return (
    <>
      {!loggedIn && isNotChatSub && (
        <GuestContactForm
          onGuestInputChange={(prop: string, value: string) => {
            setGuestUser({ ...guestUser, [prop]: value });
          }}
          onGuestInputDataChange={(value: Record<string, any>) => {
            setGuestUser({ ...guestUser, ...(value || {}) });
          }}
          type={type}
          order={order}
        />
      )}

      {/* Custom Question Logic */}
      {order?.questions?.length > 0 && (
        <DynamicQuestionFrom
          questionsRef={questionsRef}
          questions={order.questions}
          popType={order?.popType}
          order={order}
          onChange={(questions) => {
            setQuestions(questions);
            handleQuestionChanges(questions);
          }}
        />
      )}
      {/* Custom Question Logic */}
      {!isNotChatSub ? <ChatSubCheckut order={order} isPaid={isPaid} /> : null}

      <div className="mb-0">
        {isNotChatSub && <RenderPaymentWidget />}
        {loggedIn && !!userCards?.length ? (
          <UserCards
            userCards={userCards}
            primaryCard={card}
            fetchBillingCards={fetchBillingCards}
            requestPaymentButton={requestPaymentButton}
            onSubmit={onNext}
            isPlaceholderDisabled={true}
          />
        ) : (
          <Elements stripe={stripePromise}>
            <CardForm
              totalCards={0}
              functions={{ onSave: onNext }}
              elementsProps={{ Save: requestPaymentButton }}
              visibility={true}
              showEmailField={false}
              disableEmail={disableEmail}
              onOpenSignInPop={onOpenSignInPop}
              onGuestInputChange={(value: Record<string, any>) => {
                setGuestUser({ ...guestUser, ...(value || {}) });
              }}
              updateGuestUser={guestUserUpdate}
              isQuestionRequired={isQuestionRequired}
            />
          </Elements>
        )}

        {!isNotChatSub && (
          <div className="terms-area text-center">
            <p>
              By ordering you are agreeing to our{' '}
              <strong>
                {' '}
                <Link to="/terms" target="_blank">
                  Terms of Service
                </Link>
              </strong>{' '}
              and{' '}
              <strong>
                {' '}
                <Link to="/policy" target="_blank">
                  Privacy Policy
                </Link>
              </strong>
            </p>
          </div>
        )}
      </div>

      <SignInPopUP
        isOpen={isOpen}
        onClose={closeSignPopUp}
        onSuccessCallback={onSuccessLoginCB}
        email={guestUser.email}
      />
    </>
  );
};

export default styled(AddCardAndCheckout)`
  .coupon_input {
    display: flex;
    .text-input {
      flex-grow: 1;
      flex-basis: 0;
      margin-bottom: 0 !important;
    }
    .button {
      width: 120px;
      margin-left: 10px;
      min-width: inherit;
      @media (max-width: 640px) {
        width: 110px;
      }
    }
  }

  .applied_coupon {
    font-weight: 600;
  }
`;
