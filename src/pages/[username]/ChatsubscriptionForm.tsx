import { checkOrderExists, orderCreate } from 'api/Order';
import { getPopByName } from 'api/Pop';
import { checkUserName, updateGuestUser } from 'api/User';
import { createOrderWithGuestUser } from 'api/Utils';
import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { AvatarName, EmailSvg, NameSvg } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import Model, { AppAlert } from 'components/Model';
import SignInPopUP from 'components/SignInPopUp';
import FocusInput from 'components/focus-input';
import { toast } from 'components/toaster';
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
import {
  resetOrder,
  setGuestUser,
  setGuestUserTokens,
  setOrder,
} from 'store/reducer/checkout';
import styled from 'styled-components';
import { arrayFilter, getGradient, isValidUrl, slugify } from 'util/index';
import * as yup from 'yup';
import ListItem from './components/ListItem';
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
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
          return `background: ${theme?.chat?.inputsBackground} !important;
             color: ${theme?.chat?.inputsTextColor} !important;
             border-color:${theme?.chat?.inputBorderColor} !important;
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
const ChatSubscriptionForm = ({
  className,
  onSubmitCb,
  publicUser = {},
  createLog,
  isPreview,
}: any) => {
  const { loggedIn, user } = useAuth();
  const [isOpen, openSignPopUp, closeSignPopUp] = useOpenClose(false);
  const [stopPOPup, onStopPOPupOpen, onStopPOPupClose] = useOpenClose();
  const [selectedV, setSelectedV] = useState<any>({});
  const { popLinksId } = useAppSelector((state) => state.popslice?.previewPop);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [ownProfile, setOwnProfile] = useState<boolean>(false);
  const [pop, setPop] = useState<any>({});
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);

  const { setLoading } = useRequestLoader();
  const gstUser = useAppSelector((state) => state.checkout?.guestUser);

  const { username, popslug } = useParams<{
    username: string;
    popslug: string;
  }>();

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    setFieldError,
    setFieldValue,
    setValues,
  } = useFormik({
    validationSchema,
    initialValues: {
      name: '',
      email: '',
      phone: '',
      pageTitle: user?.pageTitle || gstUser?.data?.pageTitle,
      username: user?.username || gstUser?.data?.username,
    },
    onSubmit: async (formData) => {
      handleCreateOrder(formData);
      onSubmitCb?.(formData);
    },
  });
  useEffect(() => {
    if (popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION)
      setPop(popLinksId);
  }, [popLinksId]);
  useEffect(() => {
    //     if (!!username && !!popslug) {
    //   getPopData();
    // }
    // Remove later when api is ready to give pop
    if (publicUser?._id) {
      if (user?._id === publicUser._id) {
        setValues({ ...values, pageTitle: '', username: '' });
        setOwnProfile(true);
        const userChatSubPop: any = publicUser.links.find(
          (u: any) => u?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        );
        if (userChatSubPop) {
          setPop(userChatSubPop.popLinksId);
          setShowForm(true);
        }
      } else {
        const userChatSubPop: any = publicUser.links.find(
          (u: any) => u?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        );
        if (userChatSubPop) {
          getPopData(userChatSubPop.popLinksId.popName);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicUser?._id]);
  const getPopData = async (slug = '') => {
    const popData = await getPopByName(username, popslug || slug, {
      ignoreStatusCodes: [404, 422],
    }).catch((e: Error) => console.log(e));
    if (!popData) {
      return;
    }
    setShowForm(true);
    const vs: any = [...(popData?.priceVariations || [])]
      .filter(({ isActive }) => isActive)
      .map((v: any) => {
        return { label: `${v.title || ''} - $${v.price}`, value: v };
      });
    // setVariations(vs);
    const indexof = vs?.findIndex((el: any) => el?.value?.isDefault === true);
    if (indexof !== -1) {
      setSelectedV(vs[indexof]);
    } else {
      setSelectedV(vs[0]);
    }
    if (!popData.owner?.isActiveProfile) {
      if (user?._id !== popData.owner?._id) {
        history.replace('/');
      }
    }

    // check if the user is need this own profile
    if (loggedIn && user?._id === popData.owner?._id) {
      setOwnProfile(true);
    }

    if (popData?.owner) {
      popData.owner.themeName = popData.owner.themeColor?.colorSetName
        .toLowerCase()
        .replace(' ', '-');
      popData.owner.themeNumber = 1;
      if (popData.owner.themeName === 'purple-haze')
        popData.owner.themeNumber = 2;
      else if (popData.owner.themeName === 'sedona')
        popData.owner.themeNumber = 3;
    }

    setPop(popData);
  };
  const onSuccessLoginCB = async (user?: IUser) => {
    if (!user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      closeSignPopUp();
      history.replace('/my-profile');
      return;
    }
    const selected = selectedV.value;
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
      vpopId: selected._id,
      buyer: loggedIn && user?._id ? user?._id : null,
    };
    const response = loggedIn
      ? await orderCreate(requestData)
      : await createOrderWithGuestUser(requestData);
    const { order } = response;
    createLog?.(order);
    const prams = stringify({ order: order._id, type: pop.popType });
    history.push(
      `/${publicUser?.username}/purchase/add-a-card-and-checkout?${prams}`,
    );
    closeSignPopUp();
  };
  const validateUsername = async (value: string) => {
    // const reg = /[^A-Za-z0-9-_\s]/g;
    // if (value && reg.test(value)) {
    //   setFieldError(
    //     'pageTitle',
    //     'Username Can only contain - and _ along with alpha-numeric characters',
    //   );
    //   return false;
    // }
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
    setIsCheckingUserName(true);
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
      .finally(() => {
        setIsCheckingUserName(false);
      });
  };
  const handleCreateOrder = async (values?: {
    name: string;
    email: string;
    phone: string;
    username: string;
    pageTitle: string;
  }) => {
    if (ownProfile) {
      onStopPOPupOpen();
      return true;
    }
    if (user?._id && !user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return;
    }

    const isAllowTocreate = !user?._id
      ? await validateUsername(values?.pageTitle || '')
      : true;
    if (!isAllowTocreate) {
      return;
    }
    const selected = selectedV.value;

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
      dispatch(setOrder(order));
      createLog?.(order);
      if (!loggedIn) {
        await validationSchema.validate(values);
        const name = values?.pageTitle?.replace(/\s{2,}/g, ' ').trim();
        // const firstName = name?.split(' ').slice(0, -1).join(' ');
        // const lastName = name?.split(' ').slice(-1).join(' ');
        await updateGuestUser({
          email: values?.email,
          phone: values?.phone,
          pageTitle: name,
          username: slugify(values?.pageTitle || ''),
        }).then((data) => {
          dispatch(setGuestUser({ ...GuestUser, ...data }));
        });
      }
      const prams = stringify({ order: order._id, type: pop.popType });
      return history.push(
        `/${publicUser?.username}/purchase/add-a-card-and-checkout?${prams}`,
      );
    } catch (e: any) {
      setIsLoading(false);
      setLoading(false);
      if (e?.message === 'Email already exists') {
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
        AppAlert({
          title: 'Order Already Exists',
          text: 'Redirecting to chat',
          onConfirm: () => {
            history.push(
              `/messages/subscriptions?userId=${publicUser?._id}&type=chat`,
            );
          },
        });
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
  return showForm ? (
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
                  src={
                    pop?.isThumbnailActive && pop?.popThumbnail
                      ? pop?.popThumbnail
                      : ''
                  }
                  fallbackComponent={
                    <AvatarName
                      text={publicUser.pageTitle || 'Incognito User'}
                    />
                  }
                />
                <h2>{pop?.title ?? 'Join My Pop Page'}</h2>
              </div>
              <span>
                {pop?.description ||
                  `Signup here to access my private chat and exclusive members only content!`}
              </span>
            </div>
            {(isPreview || !loggedIn) && (
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
                  validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
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
              </div>
            )}

            <div className="fields-wrap">
              <ListItem
                fallbackUrl={pop?.imageURL}
                key={pop._id}
                title={pop?.actionText || 'Get Free Access'}
                linkType={!isValidUrl(pop?.imageURL) ? pop?.platfrom : ''}
                // icon={iconUrl}
                disabled={isPreview || isCheckingUserName}
                onClick={submitHandler}
                showIcon={false}
                isLoading={isLoading}

                // onContextMenu={(e: any) => handleContextMenu(e, item)}
                // {...rest}
              />
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
  ) : null;
};
export default styled(ChatSubscriptionForm)``;
