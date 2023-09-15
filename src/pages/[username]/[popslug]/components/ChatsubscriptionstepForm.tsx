import { chargeUser } from 'api/billing';
import { checkOrderExists, orderCreate } from 'api/Order';
import { checkUserName, updateGuestUser } from 'api/User';
import { createOrderWithGuestUser, getCounterLabel } from 'api/Utils';
import { USERCHARGEBACKMESSAGE } from 'appconstants';
import {
  AvatarName,
  EmailSvg,
  EypeClose,
  EypeOpen,
  NameSvg,
} from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import FocusInput from 'components/focus-input';
import Model, { AppAlert } from 'components/Model';
import Button from 'components/NButton';
import SignInPopUP from 'components/SignInPopUp';
import { toast } from 'components/toaster';
import { actions } from 'context/Auth';
import dayjs from 'dayjs';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useRequestLoader from 'hooks/useRequestLoader';
import { stringify } from 'querystring';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { setCallbackForPayment } from 'store/reducer/cardModal';
import {
  resetOrder,
  setGuestUser,
  setGuestUserTokens,
  setOrder,
} from 'store/reducer/checkout';
import { headerCount } from 'store/reducer/counter';
import { store } from 'store/store';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { arrayFilter, getGradient, slugify } from 'util/index';
import * as yup from 'yup';
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  password: yup
    .string()

    .max(50)
    .min(6, 'Password should be at least 6 characters long')
    .required('Password is required'),
  pageTitle: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters long!'),
  // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter Valid username'),
});
const StyledListItem = styled.div`
  .form_section {
    /* background: rgba(255, 255, 255, 0.7); */
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.04);
    padding: 23px 17px;
    color: var(--pallete-text-light-250);
    margin: 0 0 30px;
    ${({ theme }) => {
      const gradient: string = getGradient(
        theme?.chat?.subtype || 'solid',
        theme?.chat?.gradient,
        theme?.chat?.solidColor || 'var(--pallete-background-primary-light)',
      );
      return `background: ${gradient};
      `;
    }}
    ${({ theme }) => {
      if (theme?.button?.style?.includes('soft-square')) {
        return `
          border-radius: 4px;
        `;
      }
      if (theme?.button?.style?.includes('circule')) {
        return `
           border-radius: 35px;
        `;
      }
    }}
    .user_head {
      margin: 0 0 16px;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      span {
        ${({ theme }) => {
          return `font-size: ${theme?.chat?.descriptionSize};
          color: ${theme?.chat?.descriptionColor};        
  `;
        }}
      }
    }
    .form-heading {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 20px;
      h2 {
        ${({ theme }) => {
          return `font-size: ${theme?.chat?.titleSize};
          color: ${theme?.chat?.titleColor};        
  `;
        }}
        margin: 0;
        line-height: 32px;
        font-weight: 700;
        @media (max-width: 767px) {
          font-size: 24px;
          line-height: 28px;
        }
      }
    }
    .user-image {
      width: 50px;
      height: 50px;
      min-width: 50px;
      margin: 0 15px 0 0;
      @media (max-width: 767px) {
        width: 30px;
        height: 30px;
        min-width: 30px;
        margin: 0 10px 0 0;
      }
    }
    .materialized-input {
      &.text-input {
        margin: 0 0 16px !important;
        &.input-active {
          label {
            font-size: 13px;
            top: -8px;
          }
        }
        label {
          color: #9b9b9b;
          font-size: 18px;
          line-height: 22px;
          font-weight: 400;
          top: 17px;
          background: none;
          .sp_dark & {
            color: #e0e0e0;
          }
          &:after {
            position: absolute;
            left: 0;
            right: 0;
            top: 10px;
            content: '';
            height: 2px;
            background: var(--pallete-background-default);
            .sp_dark & {
              background: #505050;
            }
          }
          span {
            position: relative;
            z-index: 2;
          }
        }
        .pre-fix {
          top: 16px;
          left: 14px;
          width: 22px;
          path {
            fill: #9b9b9b;
          }
        }
        .error-msg {
          ${({ theme }) => {
            return `color: ${theme?.chat?.inputErrorColor} !important;
            `;
          }}

          @media (min-width: 768px) {
            position: static;
            margin: 4px 0 0;
            right: 10px;
            top: 16px !important;
            width: auto !important;
          }
        }
      }
      .form-control {
        height: 52px;
        border-color: #484848;
        background: var(--pallete-background-default);

        .sp_dark & {
          background: #505050;
          border-color: #505050;
        }
      }
    }
    .profile-btn {
      margin: 0 !important;
    }
    .inputs-wrap {
      .inputFields {
        ${({ theme }) => {
          return `background: ${theme?.chat?.inputsBackground}  !important;
             color: ${theme?.chat?.inputsTextColor}  !important;
             border-color:${theme?.chat?.inputBorderColor}  !important;
             border-style: ${theme?.chat?.inputBorderStyle?.value} !important;
  `;
        }}
        &::placeholder {
          color: #f00;
        }
      }
      .pre-fix {
        path {
          ${({ theme }) => {
            return `fill: ${theme?.chat?.inputSvgColor} !important;        
  `;
          }}
        }
      }
      label {
        ${({ theme }) => {
          return `color: ${theme?.chat?.placeholderColor} !important;        
  `;
        }}
        &:after {
          ${({ theme }) => {
            return `background: ${theme?.chat?.inputsBackground} !important;        
  `;
          }}
        }
      }
    }
  }
`;
const ChatSubscriptionFormStep2 = ({
  className,
  onSubmitCb,
  publicUser = {},
  onCreateOrder,
  ownProfile,
  pop,
  selectedV,
}: any) => {
  const {
    loggedIn,
    user,
    setToken,
    setUser,
    dispatch: contextDispatch,
  } = useAuth();
  const [isOpen, openSignPopUp, closeSignPopUp] = useOpenClose(false);
  const [stopPOPup, onStopPOPupOpen, onStopPOPupClose] = useOpenClose();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setdisabled] = useState<boolean>(false);
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();

  const history = useHistory();
  const subscription = useAppSelector((state) => state.counter);
  const { username } = useParams<{ username: string }>();
  const [showPassword, setShowPassword] = useState(false);

  // const [isCheckingUserName, setIsCheckingUserName] = useState(false);

  const { setLoading } = useRequestLoader();
  const gstUser = useAppSelector((state) => state.checkout?.guestUser);
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setFieldError,
    setFieldValue,
  } = useFormik({
    validationSchema,
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      pageTitle: user?.pageTitle || gstUser?.data?.pageTitle,
      username: user?.username || gstUser?.data?.username,
    },
    onSubmit: async (formData) => {
      setLoading(true);
      await handleCreateOrder(formData);
      await onSubmitCb?.(formData);
      setLoading(false);
    },
  });
  const checkFor = async () => {
    try {
      setdisabled(true);
      setLoading(true);
      return await checkOrderExists(pop?._id).then((res: any) => {
        if (res?.isExist) {
          setdisabled(false);
          setLoading(false);

          history.push(
            `/messages/subscriptions?userId=${publicUser?._id}&type=chat`,
          );
          return false;
        }
        setdisabled(false);
        setLoading(false);
        return true;
      });
    } catch (error) {
      setdisabled(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    setdisabled(!!(user?._id && user?._id === publicUser?._id));
    if (
      pop?._id &&
      pop?.popType === ServiceType.CHAT_SUBSCRIPTION &&
      loggedIn &&
      user._id &&
      user._id !== publicUser?._id
    ) {
      checkFor();
    }
    return () => {};
  }, [pop?._id, publicUser?._id]);

  const onSuccessLoginCB = async (user?: IUser) => {
    if (!user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      closeSignPopUp();
      history.replace('/my-profile');
      return;
    }
    const selected = selectedV;
    const ifNotExist = await checkIfexist();
    if (!ifNotExist) {
      return;
    }
    const sQuestions = arrayFilter(pop?.questions || [], {
      isActive: true,
    }).concat(arrayFilter(selected?.questions || [], { isActive: true }));

    const requestData: any = {
      questions: sQuestions,
      popId: pop._id,
      vpopId: selected?._id,
      buyer: loggedIn && user?._id ? user?._id : null,
    };
    const response = await orderCreate(requestData);
    const { order } = response;
    dispatch(setOrder(order));
    onCreateOrder?.(order);
    if (!order?.price) {
      checkoutForfree(order, user);
    } else {
      const prams = stringify({ order: order._id, type: pop.popType });
      history.push(
        `/${publicUser?.username}/purchase/add-a-card-and-checkout?${prams}`,
      );
    }
    closeSignPopUp();
  };
  const validateUsername = async (value: string) => {
    const reg = /[^A-Za-z0-9-_\s]/g;
    if (value && reg.test(value)) {
      setFieldError(
        'pageTitle',
        'Name Can only contain - and _ along with alpha-numeric characters',
      );
      return false;
    }
    if (!value) {
      setFieldError('pageTitle', 'Name is required');
      return false;
    }

    const slug = slugify(value);
    if (slug?.length <= 2) {
      setFieldError('pageTitle', 'Name must be at least 3 characters long!');
      return false;
    }
    setFieldError('pageTitle', undefined);
    // setCLoader({ username: value });
    return checkUserName(slug)
      .then(() => {
        // setCLoader({});
        setFieldError('pageTitle', undefined);

        setFieldValue('pageTitle', value);
        setFieldValue('username', slug);
        return true;
      })
      .catch(() => {
        // setCLoader({});
        setFieldError('pageTitle', 'Name has already been taken');
        return false;
      })
      .finally(() => {});
  };

  const checkoutForfree = async (
    order: Record<string, any>,
    loggedUser?: Record<string, any>,
  ) => {
    try {
      dispatch(
        setCallbackForPayment({
          callback: () =>
            chargeUser(
              {
                orderId: order?._id,
                isCreatingIntent: !!order?.price,
                checkCards: !!order?.price,
              },
              null,
              dispatch,
            ),
        }),
      );
      const res = await chargeUser(
        {
          orderId: order?._id,
          isCreatingIntent: !!order?.price,
          checkCards: !!order?.price,
        },
        null,
        dispatch,
      );
      // if (user?.stripe?.customerId) {

      if (!res?.success) {
        throw Error(res?.data?.message);
      }

      analytics.track('new_subscription', {
        purchasedFrom: order?.seller?._id,
        member_level_id: ServiceType.CHAT_SUBSCRIPTION,
        purchaseAmount: 0,
      });

      analytics.track('purchase_end', {
        purchasedFrom: order?.seller?._id,
        purchaseTypeSlug: order?.popId?.popType,
        purchaseAmount: order?.price,
        itemId: order?.popId?._id,
      });
      dispatch(setOrder(res?.updatedOrder));
      if (!loggedIn && !loggedUser?._id) {
        const gstData = store.getState()?.checkout?.guestUser || {};
        if (!order?.price && gstData?.data) {
          const guestData = store.getState()?.checkout?.guestUser || {};
          // eslint-disable-next-line
          const { themeColor, ...rest } = guestData?.data || {};

          contextDispatch({
            type: actions.isAuthenticated,
            payload: true,
          });
          setToken(guestData.token, guestData.refreshToken);
          setUser({
            ...rest,
          });
          dispatch(setGuestUser({}));
          dispatch(setGuestUserTokens({}));
        }
        return history.push(
          `/${username || publicUser?.username}/purchase/set-phone?order=${
            order?._id
          }&userId=${publicUser?._id || order?.seller?._id}`,
        );
      }

      // if (order?.popType === ServiceType.CHAT_SUBSCRIPTION) {
      if (!subscription?.subscription) {
        getCounterLabel()
          .then((counter) => {
            dispatch(headerCount(counter));
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
      if (!loggedUser?.isPhoneNumberVerified) {
        return history.push(
          `/${username || publicUser?.username}/purchase/set-phone?order=${
            order?._id
          }&userId=${order?.seller?._id}`,
        );
      } else {
        history.push(
          `/messages/subscriptions?userId=${order?.seller?._id}&type=chat`,
        );
      }
    } catch (e: any) {
      if (e && e?.message) {
        if (e?.message === 'You have already purchased') {
          return history.push(
            `/messages/subscriptions?userId=${publicUser?._id}&type=chat`,
          );
        } else toast.error(e?.message);
      }
      console.error(e);
    }
  };
  const OrderChat = (order: Record<string, any>) => {
    if (!order?.price) {
      checkoutForfree(order, user);
    } else {
      dispatch(setOrder(order));
      const prams = stringify({
        order: order._id,
        type: pop.popType,
      });
      return history.push(
        `/${publicUser?.username}/purchase/add-a-card-and-checkout?${prams}`,
      );
    }
  };
  const handleCreateOrder = async (values?: {
    name: string;
    email: string;
    phone: string;
    username: string;
    pageTitle: string;
    password: string;
  }) => {
    if (ownProfile) {
      onStopPOPupOpen();
      return true;
    }
    if (user?._id && !user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return;
    }
    let isAllowTocreate = true;
    if (
      !user?._id &&
      values?.pageTitle &&
      values.pageTitle !== gstUser.data.pageTitle
    ) {
      isAllowTocreate = !user?._id
        ? await validateUsername(values?.pageTitle || '')
        : true;
    }
    if (!isAllowTocreate) {
      return;
    }
    const selected = selectedV;

    const sQuestions = arrayFilter(pop?.questions || [], {
      isActive: true,
    }).concat(arrayFilter(selected?.questions || [], { isActive: true }));
    setIsLoading(true);
    setLoading(true);
    dispatch(resetOrder());
    const buyerId =
      loggedIn || gstUser?.data?._id ? user?._id ?? gstUser?.data?._id : null;
    const requestData: any = {
      questions: sQuestions,
      popId: pop._id,
      vpopId: selected?._id,
      buyer: buyerId,
    };
    try {
      !loggedIn && (await validationSchema.validate(values));
      const response =
        loggedIn || gstUser?.data?._id
          ? await orderCreate(requestData)
          : await createOrderWithGuestUser(requestData, values?.email);

      const { order, guestUser } = response;
      if (!loggedIn && !gstUser?.data?._id) {
        dispatch(setGuestUser(guestUser));
        dispatch(
          setGuestUserTokens({
            token: guestUser.token,
            refreshToken: guestUser.refreshToken,
          }),
        );
      }
      const GuestUser = gstUser?.data?._id ? gstUser : guestUser;
      let orderr = { ...order };
      if (!loggedIn) {
        orderr = {
          ...orderr,
          buyer: { ...orderr.buyer, email: values?.email },
        };
      }
      dispatch(setOrder(orderr));
      onCreateOrder?.(orderr);

      if (!loggedIn) {
        await validationSchema.validate(values);
        const name = values?.pageTitle?.replace(/\s{2,}/g, ' ').trim();
        // const firstName = name?.split(' ').slice(0, -1).join(' ');
        // const lastName = name?.split(' ').slice(-1).join(' ');
        const guestUserData = {
          email: values?.email,
          phone: values?.phone,
          password: values?.password,
          pageTitle: name,
          username: slugify(values?.pageTitle || ''),
          userSetupStatus: 0,
          skipOnBoarding: true,
          allowSelling: false,
          timeOffset: dayjs.tz.guess(),
          isPasswordSet: true,
        };
        return await updateGuestUser(guestUserData).then((data) => {
          dispatch(setGuestUser({ ...GuestUser, ...data }));
          orderr = {
            ...orderr,
            buyer: {
              ...orderr.buyer,
              ...guestUserData,
            },
          };
          return OrderChat(orderr);
        });
      } else {
        return OrderChat(orderr);
      }
    } catch (e: any) {
      setIsLoading(false);
      setLoading(false);
      if (e?.message === 'email already exists') {
        openSignPopUp();
        return;
      }
      AppAlert({
        title: 'Please Enter Correct information',
        text: e.message,
      });
    }
    setLoading(false);
    setIsLoading(false);
  };
  const checkIfexist = async () => {
    return await checkOrderExists(pop?._id).then((res: any) => {
      if (res?.isExist) {
        setIsLoading(false);
        history.push(
          `/messages/subscriptions?userId=${publicUser?._id}&type=chat`,
        );
        // AppAlert({
        //   title: 'Subscription Exists',
        //   buttons: ['', 'Continue'],
        //   text: 'You have already subscribed. Click the button below to continue to your subscription',
        //   onConfirm: () => {
        //     history.push(
        //       `/my-subscriptions?userId=${publicUser?._id}&type=chat`,
        //     );
        //   },
        //   onClose: () => {
        //     history.push(
        //       `/my-subscriptions?userId=${publicUser?._id}&type=chat`,
        //     );
        //   },
        // });
        return false;
      }
      return true;
    });
  };

  const submitHandler = async (e: any) => {
    if (ownProfile) {
      onStopPOPupOpen();
      return;
    }
    if (!ownProfile) {
      if (loggedIn) {
        e?.preventDefault();
        setIsLoading(true);
        const ifNotExist = await checkIfexist();
        if (ifNotExist) {
          handleCreateOrder(values);
        } else {
          return;
        }
      } else {
        handleSubmit();
      }
    } else {
      onStopPOPupClose();
    }
  };
  // const isPriceExist = (selectedV.price || 0) > 0;
  const handlePasswordChecker = (e: any) => {
    setFieldValue('password', e.target.value);
  };
  return (
    <>
      <div className={`${className} form-subscription-area text-center`}>
        <StyledListItem>
          <div className="form_section">
            <div className="user_head">
              <div className="form-heading">
                <AvatarStatus
                  imgSettings={{
                    onlyMobile: true,

                    imgix: { all: 'w=163&h=163' },
                  }}
                  src={publicUser?.profileImage ? publicUser?.profileImage : ''}
                  fallbackComponent={
                    <AvatarName
                      text={publicUser.pageTitle || 'Incognito User'}
                    />
                  }
                  // fallbackUrl={'/assets/images/default-profile-img.svg'}
                />
                <h2>{pop?.title ?? 'Join My Pop Page'}</h2>
              </div>
              <span>
                {pop?.description ||
                  `Signup here to access my private chat and exclusive members only content!`}
              </span>
            </div>
            {!loggedIn && (
              <div className="fields-wrap inputs-wrap">
                <FocusInput
                  value={values.pageTitle}
                  hasIcon={true}
                  label="Your Name"
                  name="pageTitle"
                  prefixElement={<NameSvg />}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.pageTitle}
                  materialDesign
                  touched={touched.pageTitle}
                  class="user-fields inputFields"
                />
                <div className="form_fields inputs-wrap">
                  <FocusInput
                    value={values.email}
                    hasIcon={true}
                    class="email-fields inputFields"
                    label="Your Email"
                    name="email"
                    prefixElement={<EmailSvg />}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    materialDesign
                    touched={touched.email}
                  />
                </div>
                <div className="field">
                  <FocusInput
                    onChange={handlePasswordChecker}
                    onBlur={handleBlur}
                    error={
                      (!values.password || values.password?.length < 6) &&
                      errors.password
                    }
                    autocomplete={'false'}
                    touched={touched.password}
                    label="Password *"
                    type={showPassword ? 'text' : 'password'}
                    limit={50}
                    inputClasses={`mb-25 icon-right `}
                    name="password"
                    class="inputFields"
                    materialDesign
                    value={values.password}
                    hasIcon={true}
                    icon={
                      <span
                        onClick={() => {
                          values.password
                            ? setShowPassword(!showPassword)
                            : setShowPassword(false);
                        }}
                        style={{
                          cursor: 'pointer',
                          margin: '14px 0 0',
                          display: 'block',
                        }}
                      >
                        {showPassword ? <EypeClose /> : <EypeOpen />}
                      </span>
                    }
                  />
                </div>
              </div>
            )}

            <div className="fields-wrap">
              <Button
                type="primary"
                size="x-large"
                htmlType="submit"
                block
                disabled={disabled || isLoading}
                isLoading={isLoading}
                onClick={submitHandler}
              >
                Let's Chat!
                {/* {`Get access For ${
                  isPriceExist
                    ? `$${(selectedV.price || 0).toFixed(2)}`
                    : 'Free'
                } `} */}
              </Button>
            </div>
          </div>
        </StyledListItem>
      </div>
      <Model
        open={stopPOPup}
        icon="error"
        title="Can not perform this action"
        text="Sorry, but you can not purchase a service from yourself."
        onClose={onStopPOPupClose}
        onConfirm={onStopPOPupClose}
      />
      <SignInPopUP
        isOpen={isOpen}
        onClose={closeSignPopUp}
        onSuccessCallback={onSuccessLoginCB}
        email={values.email}
      />
    </>
  );
};
export default styled(ChatSubscriptionFormStep2)``;
