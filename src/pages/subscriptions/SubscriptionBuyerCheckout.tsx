import { chargeUser } from 'api/billing';
import { checkOrderExists, orderCreate } from 'api/Order';
import { getPopByName } from 'api/Pop';
import { fetchUserByName } from 'api/User';
import { getCounterLabel } from 'api/Utils';
import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { AvatarName, Message } from 'assets/svgs';
import attrAccept from 'attr-accept';
import AvatarStatus from 'components/AvatarStatus';
import ImageModifications from 'components/ImageModifications';
import InformationWidget from 'components/InformationWidget';
import { AppAlert } from 'components/Model';
import CheckoutModal from 'components/Models/checkout-modal';
import Button from 'components/NButton';
import Slider from 'components/slider';
import { toast } from 'components/toaster';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useRequestLoader from 'hooks/useRequestLoader';
import InfoCard from 'pages/[username]/[popslug]/components/Infocard';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useHistory } from 'react-router-dom';
import { setCallbackForPayment } from 'store/reducer/cardModal';
import { resetOrder, setOrder } from 'store/reducer/checkout';
import { headerCount } from 'store/reducer/counter';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { getGradient, parseQuery } from 'util/index';
// const validationSchema = yup.object().shape({
//   email: yup
//     .string()
//     .email('Enter valid email address')
//     .required('Enter valid email address'),
//   password: yup
//     .string()

//     .max(50)
//     .min(6, 'Password should be at least 6 characters long')
//     .required('Password is required'),
//   pageTitle: yup
//     .string()
//     .required('Public username required')
//     .min(3, 'Username must be at least 3 characters long!'),
//   // .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter Valid username'),
// });
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
const SubscriptionBuyerCheckout = ({
  className,
  onSubmitCb,
  onCreateOrder,
  onAlreadyexistCallback,
  onCheckoutComplete,
}: any) => {
  const loading = useAppSelector((state) => state.global?.loading);

  const [isOpen, onOpen, OnClose] = useOpenClose(false);
  const { user } = useAuth();
  const [subAlreadyExists, setSubAlreadyExists] = useState<boolean>(false);
  const { user: username, slug } = parseQuery(location.search);
  const [error, setError] = useState<string>('');
  const [selectedV, setSelectedV] = useState<any>({});
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [pop, setPop] = useState<any>({});
  const [publicUser, setPubliceUser] = useState<any>({});
  const [disabled, setdisabled] = useState<boolean>(false);
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();

  const history = useHistory();
  const subscription = useAppSelector((state) => state.counter);
  const { setLoading } = useRequestLoader();
  const { handleSubmit } = useFormik({
    // validationSchema,
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      pageTitle: user?.pageTitle,
      username: user?.username,
    },
    onSubmit: async (formData) => {
      setLoading(true);
      await handleCreateOrder();
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
          setSubAlreadyExists(true);
        }
      });
    } finally {
      setdisabled(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (pop?._id) checkFor();
  }, [pop?._id]);
  useEffect(() => {
    if (!!username) {
      setSubAlreadyExists(false);
      getUserWithName();
    }
  }, [username]);
  const getUserWithName = async () => {
    setSkeleton(true);
    const response = fetchUserByName(
      username as string,
      {},
      {
        errorConfig: { ignoreStatusCodes: [404] },
      },
    ).catch((e: Error) => {
      console.log(e);
      setError(e?.message || 'Sorry User data is not available!');
    });
    const popData = getPopByName(username as string, slug as string, {
      ignoreStatusCodes: [404],
    }).catch((e: Error) => {
      console.log(e);

      setError(e?.message || 'Sorry User data is not available!');
    });
    Promise.all([popData, response])
      .then((res) => {
        if (res[0]) {
          const { priceVariations = [] } = res[0];
          if (!!priceVariations?.length) {
            let variation = priceVariations.find(
              (v: PriceVariant) => v.isDefault && !v.isArchive && v.isActive,
            );
            if (!variation) {
              variation = priceVariations.find(
                (v: PriceVariant) => !v.isArchive && v.isActive,
              );
            }
            if (!variation) {
              setError(
                "Sorry this seller don't have any membership available!",
              );
            }

            setSelectedV(variation);
          } else {
            setError("Sorry this seller don't have any membership available!");
          }
          setPop(res[0]);
        }
        setPubliceUser(res[1]);
        setSkeleton(false);
      })
      .finally(() => {
        setSkeleton(false);
      });
  };

  const checkoutForfree = async (order: Record<string, any>) => {
    try {
      setLoading(true);

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
      // if (order?.popType === ServiceType.CHAT_SUBSCRIPTION) {
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
      try {
        await onCheckoutComplete?.(order);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
      // history.push(`/my-subscriptions?userId=${order?.seller?._id}&type=chat`);
    } catch (e: any) {
      setLoading(false);

      if (e && e?.message) {
        if (e?.message === 'You have already purchased') {
          if (onAlreadyexistCallback) {
            onAlreadyexistCallback?.();
            return;
          }
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
      checkoutForfree(order);
    } else {
      dispatch(setOrder(order));
      onOpen();
      return;
    }
  };
  const handleCreateOrder = async () => {
    if (user?._id && !user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return;
    }
    const selected = selectedV;
    dispatch(resetOrder());
    const buyerId = user?._id;
    const requestData: any = {
      popId: pop._id,
      vpopId: selected?._id,
      buyer: buyerId,
    };
    try {
      const response = await orderCreate(requestData);
      const { order } = response;
      dispatch(setOrder(order));
      onCreateOrder?.(order);
      OrderChat(order);
    } catch (e: any) {
      if (e?.message === 'email already exists') {
        return;
      }
      AppAlert({
        title: 'Please Enter Correct information',
        text: e.message,
      });
    }
  };
  const submitHandler = async (e: any) => {
    e?.preventDefault();
    handleSubmit();
  };
  return (
    <>
      <CheckoutModal
        isOpen={isOpen}
        onClose={OnClose}
        onCheckoutComplete={onCheckoutComplete}
      />
      <div className={`${className} form-subscription-area text-center`}>
        {error ? (
          <div className="p-10 empty-data">
            <Button disabled block shape="circle">
              {error || 'No Record Found'}
            </Button>
          </div>
        ) : subAlreadyExists ? (
          <div>
            <p>You have already subscribed to that user!</p>
          </div>
        ) : (
          <>
            <div className="qa-wedget mb-30">
              <div className="title-box justify-content-between w-100">
                <div className="heading_Wrapper d-flex align-items-center">
                  {skeleton ? (
                    <Skeleton circle width={40} height={40} />
                  ) : pop?.isThumbnailActive && pop?.popThumbnail ? (
                    <ImageModifications
                      imgeSizesProps={{
                        onlyMobile: true,
                        imgix: {
                          all: 'w=64&h=64',
                        },
                      }}
                      src={pop?.popThumbnail}
                      className="thumbnail"
                      alt=""
                    />
                  ) : (
                    <span className="icon">
                      <Message color="#000" />
                    </span>
                  )}

                  {skeleton ? (
                    <div className="w-100">
                      <Skeleton height={40} width="50%" />
                    </div>
                  ) : (
                    <h2 className="text-capitalize">{pop?.title || ''}</h2>
                  )}
                </div>
                {selectedV?.price > -1 && (
                  <span className="price h2">{`$${selectedV?.price}`}</span>
                )}
              </div>
            </div>
            {pop?.additionalArt?.length > 0 && (
              <Slider
                additionalArt={pop?.additionalArt.map((f: any) => {
                  if (
                    attrAccept(
                      { name: f?.artName, type: f?.artType },
                      'image/*',
                    )
                  ) {
                    return {
                      ...f,
                      artPath: f?.artPath,
                    };
                  }
                  return f;
                })}
              />
            )}
            {pop?.infoCard && (
              <InfoCard
                {...pop?.infoCard}
                skeleton={skeleton}
                className="mb-30"
              />
            )}
            {selectedV?.description?.length > 0 && (
              <InformationWidget icon={false} className="mb-30">
                {selectedV?.description}
              </InformationWidget>
            )}
            {!skeleton && pop?._id ? (
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
                          publicUser?.profileImage
                            ? publicUser?.profileImage
                            : ''
                        }
                        fallbackComponent={
                          <AvatarName
                            text={publicUser.pageTitle || 'Incognito User'}
                          />
                        }
                      />
                      <h2>{selectedV?.title ?? 'Join My Pop Page'}</h2>
                    </div>
                    <span>
                      {selectedV?.description ||
                        `Signup here to access my private chat and exclusive members only content!`}
                    </span>
                  </div>
                  <div className="fields-wrap">
                    <Button
                      type="primary"
                      size="x-large"
                      htmlType="submit"
                      block
                      disabled={disabled || loading}
                      isLoading={loading}
                      onClick={submitHandler}
                    >
                      Let's Chat!
                    </Button>
                  </div>
                </div>
              </StyledListItem>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};
export default styled(SubscriptionBuyerCheckout)`
  .empty-block {
    margin: 15px;
  }
`;
