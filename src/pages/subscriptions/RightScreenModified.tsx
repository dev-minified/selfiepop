import { CircleAvatar, SalespurchasesChat } from 'assets/svgs';
import AvatarStatus from 'components/AvatarStatus';
import EmtpyMessageData from 'components/EmtpyMessageData';
import Button from 'components/NButton';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import Chat from 'components/SubscribersSubscriptions/Chat';
import Tabs from 'components/Tabs';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import useSocket from 'hooks/useSocket';
import PageTransition from 'layout/page-transition';
import { stringify } from 'querystring';
import { ReactElement, cloneElement, useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { isMobileOnly } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router';
import {
  removeCallbackForPayment,
  setCallbackForPayment,
} from 'store/reducer/cardModal';
import {
  chatUnsubscribeToggler,
  getSubscription,
  resetSubscription,
} from 'store/reducer/chat';
import {
  filterPeopYoumayKnow,
  getAndInsertAtFirst,
  getPeopleYoumayknow,
  getSubItem,
  getUserOrderNotPurchaseCourse,
  getUserOrderNotPurchaseService,
  increamentTotalCount,
  paymentForMembershipUpgrade,
  setSelectedSub,
  // setSelectedUser,
  setUserUnreadCount,
  toggleContentAccess,
  toggleSendMessage,
  updateChatUserOnlineStatus,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { parseQuery } from 'util/index';
import PeopleYoumayknow from './PeopleYoumayknow';
import SubscriptionBuyerCheckout from './SubscriptionBuyerCheckout';
import BuyerInfo from './rightScreen';
import ActivateSubModel from './rightScreen/components/AtivateSubModel';

dayjs.extend(utc);

dayjs.extend(isSameOrAfter);
const TabPane = Tabs.TabPane;
interface Props {
  className?: string;
  topBar?: ReactElement;
}
const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
  animate: {
    left: '0',
    opacity: 1,
    // position: 'relative',
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
};
type ActivateSubProps = {
  sub: ISubcription;
};
const SubLoader = styled(RequestLoader)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ActivateSub = (props: ActivateSubProps) => {
  const [open, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const submitHandler = () => {
    if (props?.sub?._id) {
      setIsLoading(true);

      dispatch(
        chatUnsubscribeToggler({
          subscriptionId: props.sub._id,
          data: { autoRenew: !props.sub.autoRenew },
          callback: (response) => {
            dispatch(
              setSelectedSub({
                ...(response?.data || {}),
                ...props.sub,
                isActive: response.data.isActive,
                periodStart: response.data.periodStart,
                periodEnd: response.data.periodEnd,
              }),
            );
            toast.success('Subscription Renewed successfully');
            setIsLoading(false);
          },
          dispatch,
        }),
      )
        .unwrap()
        .catch((e) => {
          if (e && e?.message) {
            toast.error(e.message);
          } else {
            toast.error('Something went wrong please try again!');
          }
          setIsOpen(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <div className="renewel-block">
      <Scrollbar>
        <div className="block-wrap">
          <div className="reactivateSub">
            <AvatarStatus
              src={props?.sub?.sellerId?.profileImage}
              imgSettings={{ onlyDesktop: true }}
            />
            <span className="name">
              {props?.sub?.sellerId?.pageTitle || 'Incognito User'}
            </span>
            <div className="user-detail">
              <span className="user-name">
                @{props?.sub?.sellerId?.username}
              </span>
              <span className="duration">
                {' '}
                Last seen{' '}
                {dayjs(props?.sub?.sellerId?.offlineAt).utc().fromNow()}
              </span>
            </div>
            <div className="content">
              <h3>We’re sorry, your membership has expired.</h3>
              <span className="text-para">
                To continue accessing this content, please click below to renew
                your membership.
              </span>
              <Button type="primary" onClick={() => setIsOpen(!open)}>
                Renew Membership
              </Button>
            </div>
            <ActivateSubModel
              isOpen={open}
              onClose={() => setIsOpen(false)}
              shouldCloseOnOverlayClick={!isLoading}
              sub={props.sub}
              submitHandler={() => {
                dispatch(
                  setCallbackForPayment({
                    callback: () => submitHandler(),
                  }),
                );
                submitHandler();
              }}
              isloading={isLoading}
            />
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};
function Purchases({ className, topBar }: Props): ReactElement {
  const location = useLocation();
  const { socket } = useSocket();
  const history = useHistory();
  const { setLoading } = useRequestLoader();
  const {
    userId,
    orderId,
    type,
    user,
    slug,
    view,
    subId: subID,
    ...rest
  } = parseQuery(location.search);
  const checkIsVewChange = view ? view : user || slug;
  const dispatch = useAppDispatch();

  const [subscriptionError, setSubscriptonError] = useState<string>('');

  const [subLoading, setIsSubLoading] = useState(false);

  const { user: logInUser } = useAuth();
  const subs = useAppSelector((state) => state.mysales.usersList);
  const analytics = useAnalytics();

  const isAllowMessages = useAppSelector(
    (state) => state.mysales.isAllowMessages,
  );

  const isFetchingUsers = useAppSelector(
    (state) => state.mysales.isUserListFetching,
  );
  const selectedSub = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );

  const getSubscriptionById = async (id?: string, tabSelected?: string) => {
    if (id) {
      setIsSubLoading(true);
      return await dispatch(
        getSubscription({
          subscriptionId: id,
          callback: (data) => {
            dispatch(
              setUserUnreadCount({
                unread: data?.unread || 0,
                subscriptionId: data?._id,
              }),
            );
            const priceVariation = {
              ...data?.oldPriceVariation,
              ...(data?.priceVariation?._id
                ? {
                    allowBuyerToMessage:
                      data?.priceVariation?.allowBuyerToMessage,
                    allowContentAccess:
                      data?.priceVariation?.allowContentAccess,
                    title: data?.priceVariation?.title || '',
                  }
                : {}),
            };
            const isNotExpired =
              dayjs.utc(data?.periodEnd).local().diff(dayjs(), 'minutes') >= 0;

            dispatch(
              toggleSendMessage({
                allowBuyerToMessage: isNotExpired
                  ? priceVariation?.allowBuyerToMessage
                  : false,
              }),
            );
            dispatch(
              toggleContentAccess({
                isContentAccess: isNotExpired
                  ? priceVariation?.allowContentAccess
                  : false,
              }),
            );
            // dispatch(
            //   toggleSendMessage({

            //     allowBuyerToMessage: priceVariation?.allowBuyerToMessage,
            //   }),
            // );
            // dispatch(
            //   toggleContentAccess({
            //     isContentAccess: priceVariation?.allowContentAccess,
            //   }),
            // );
            dispatch(setSelectedSub(data));
          },
          customError: {
            ignoreStatusCodes: [404],
          },
        }),
      )
        .unwrap()
        .then(({ data }: any) => {
          const priceVariation = {
            ...data?.oldPriceVariation,
            ...(data?.priceVariation?._id
              ? {
                  allowBuyerToMessage:
                    data?.priceVariation?.allowBuyerToMessage,
                  allowContentAccess: data?.priceVariation?.allowContentAccess,
                  title: data?.priceVariation?.title || '',
                }
              : {}),
          };
          return priceVariation;
        })
        .catch((e) => {
          setSubscriptonError(e?.message || 'Subscription not found!');
          console.log(e);
        })
        .finally(() => {
          setIsSubLoading(false);
        });
    }
  };
  useEffect(() => {
    if (subID) {
      getSubscriptionById(subID as string);
    }
  }, [subID]);
  useEffect(() => {
    if (!!userId) {
      const paramsList: any = { skip: 0, limit: 20, type: 'pop-course' };
      const paramsListService: any = { skip: 0, limit: 20 };
      dispatch(
        getUserOrderNotPurchaseCourse({
          userId: userId as string,
          params: paramsList,
          callback: () => {},
        }),
      ).catch((e) => {
        console.log(e);
      });
      dispatch(
        getUserOrderNotPurchaseService({
          userId: userId as string,
          params: paramsListService,
          callback: () => {},
        }),
      ).catch((e) => {
        console.log(e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useEffect(() => {
    socket?.on('chat', (data) => {
      dispatch(updateChatUserOnlineStatus({ ...data, isSeller: false }));
    });
    return () => {
      socket?.off('chat');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  const getPeopleYouknow = () => {
    dispatch(
      getPeopleYoumayknow({
        callback: () => {},
        customError: {
          ignoreStatusCodes: [404, 500],
        },
      }),
    );
  };
  const getSubandInsertFirst = (
    userId: string,
    callback?: (...args: any) => void,
  ) => {
    dispatch(
      getAndInsertAtFirst({
        userId: userId as string,
        type: 'buyer',
        popType: 'chat-subscription',
      }),
    )
      .unwrap()
      .then((d: any) => {
        const data = d?.data;
        if (data && data?.totalCount > 0) {
          const subs = data?.items[0]?._id;

          // dispatch(setSelectedUser(data.items[0]));
          getSubscriptionById(subs);
          callback?.();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    // setChatLayoutHeight({ id: 'chat-layout' });
  }, [logInUser]);
  const subId = !!selectedSub?._id;
  const onMembershipUpgrade = async (subId: string, membershipId: string) => {
    return dispatch(
      paymentForMembershipUpgrade({ subId, membershipId, dispatch }),
    )
      .unwrap()
      .then(async () => {
        const priceVariation = await getSubscriptionById(subId);
        dispatch(removeCallbackForPayment());

        analytics.track('subscription_renew', {
          purchasedFrom: selectedSub?.sellerId?._id,
          memberLevelId: membershipId,
        });
        toast.success('Subscription is upgraded successfully');
        return priceVariation;
      })
      .catch((e) => {
        if (e && e?.message) {
          toast.error(e.message);
        } else {
          toast.error('Something went wrong please try again!');
        }
      });
  };

  let isNotBefore = true;
  if (selectedSub?._id) {
    isNotBefore = !(
      dayjs.utc(selectedSub?.periodEnd).local().diff(dayjs(), 'minutes') < 0
    );
  }
  const isItemSelected = selectedSub && selectedSub?._id;
  const SpinnerComp = (
    <SubLoader
      isLoading={true}
      width="28px"
      height="28px"
      color="var(--pallete-primary-main)"
    />
  );

  const onPostUserNameClick = (item: IPost) => {
    getSubandInsertFirst(
      ((item?.userId as any)?._id || item.userId) as string,
      () => {
        history.push(
          `/messages/subscriptions?${stringify({
            userId: (item?.userId as any)?._id || item.userId,
          })}`,
        );
      },
    );
  };
  const getRightSideComp = () => {
    if (!!userId) {
      return null;
    }
    return checkIsVewChange === 'allsubs' ? (
      <div
        className={` all-subs-section ${isMobileOnly ? 'all-subs-mobile' : ''}`}
      >
        <div className="middle-block" />
        {!isMobileOnly ? (
          <div className="right-col all-subs-right-col">
            <Scrollbars>
              <PeopleYoumayknow
                onProfileCardClick={(item: any) => {
                  setSubscriptonError('');
                  dispatch(resetSubscription({}));
                  dispatch(setSelectedSub({}));
                  // dispatch(setSelectedUser({}));

                  history.push(
                    `/messages/subscriptions?user=${item?.username}&slug=${item?.popName}`,
                  );
                }}
              />
            </Scrollbars>
          </div>
        ) : null}
      </div>
    ) : (
      <PageTransition>
        <Scrollbars>
          <SubscriptionBuyerCheckout
            onCheckoutComplete={async (order: any) => {
              dispatch(
                filterPeopYoumayKnow({
                  userId: order?.seller?._id,
                  callback: (totalpeople: number) => {
                    if (!totalpeople) {
                      getPeopleYouknow();
                    }
                  },
                }),
              );
              setLoading(true);

              return await dispatch(
                getSubItem({
                  userId: order?.seller._id,
                  type: 'buyer',
                  popType: 'chat-subscription',
                  subId: '',
                }),
              )
                .unwrap()
                .then((d: any) => {
                  if (d?.totalCount > 0) {
                    const subs = d?.items[0]?._id;
                    dispatch(increamentTotalCount());
                    // dispatch(setSelectedUser(d.items[0]));
                    getSubscriptionById(subs, 'chat').catch(console.error);
                    toast.info(
                      `You have successfully subscribed to ${order?.seller?.pageTitle}`,
                    );
                    history.push(
                      `/messages/subscriptions?userId=${order?.seller._id}`,
                    );

                    return true;
                  }
                })
                .catch(() => {
                  return false;
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
            onAlreadyexistCallback={() => {
              if (!!subs.totalCount) {
                toast.info('You have already subscribed to that user!');
              }
            }}
          />
        </Scrollbars>
      </PageTransition>
    );
  };

  const GetDesktopTabs = () => {
    return (
      <Chat
        isSeller={false}
        isAllowMessages={isAllowMessages}
        className="chat-block"
      />
    );
  };
  const getMobileTabs = () => {
    return (
      <>
        <>
          <TabPane
            tab={
              <span id="sp_test_chat">
                <SalespurchasesChat />
                Chat
              </span>
            }
            key="2"
          >
            <Chat
              isSeller={false}
              isAllowMessages={isAllowMessages}
              className="chat-block"
            />
          </TabPane>
        </>

        <TabPane
          tab={
            <span id="sp_test_user_info">
              <CircleAvatar />
              Buyer Info
            </span>
          }
          key="4"
        >
          <BuyerInfo
            className="user-detail"
            onMembershipUpgrade={onMembershipUpgrade}
            onUserNameClick={() => {
              history.push(`/profile/${selectedSub?.sellerId?.username}`);
            }}
          />
        </TabPane>
      </>
    );
  };
  const desktopComponent = (tabsClass?: string) => {
    if (!!subLoading) {
      return <>{SpinnerComp}</>;
    }
    if (!!checkIsVewChange) {
      return getRightSideComp();
    }
    return isItemSelected ? (
      <>
        {isNotBefore ? (
          <>
            <div className="middle-block">
              {topBar ? (
                <div className="topBar">
                  {cloneElement(topBar, {
                    username: selectedSub?.sellerId?.username,
                  })}
                </div>
              ) : null}
              {subId && GetDesktopTabs()}
            </div>
            <div className="right-col">
              <BuyerInfo
                onMembershipUpgrade={onMembershipUpgrade}
                onUserNameClick={() => {
                  history.push(`/profile/${selectedSub?.sellerId?.username}`);
                }}
              />
            </div>
          </>
        ) : !isNotBefore ? (
          <ActivateSub sub={selectedSub as any} />
        ) : null}
      </>
    ) : (
      <div className="py-30 px-10 empty-data text-center">
        {subscriptionError}
      </div>
    );
  };
  const mobileComponent = () => {
    if (!!subLoading) {
      return <>{SpinnerComp}</>;
    }
    if (!selectedSub) {
      return null;
    }
    if (!!checkIsVewChange) {
      return getRightSideComp();
    }
    return isItemSelected ? (
      <>
        {isNotBefore ? (
          <>
            <Tabs
              defaultActiveKey={'2'}
              destroyInactiveTabPane={true}
              type="card"
            >
              {subId ? getMobileTabs() : null}
            </Tabs>
          </>
        ) : !isNotBefore ? (
          <ActivateSub sub={selectedSub as any} />
        ) : null}
      </>
    ) : (
      <div className="py-30 px-10 empty-data text-center">
        {subscriptionError}
      </div>
    );
  };
  return (
    <div className={className}>
      <div id="chat-layout" className="three-cols">
        {!isFetchingUsers && !subs.totalCount ? (
          <EmtpyMessageData text={'No Purchases Yet...'} />
        ) : (
          <>
            {!isMobileOnly ? (
              <>
                {desktopComponent(`mobile-fixed ${subId ? '' : 'block'}`)}

                {!isFetchingUsers && !subs.totalCount && !selectedSub && (
                  <EmtpyMessageData text={'No Subscriptions Yet'} />
                )}
              </>
            ) : (
              <AnimatePresence initial={false}>
                <motion.div
                  key="right"
                  custom={'right'}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={variants as any}
                  style={{ width: '100%', position: 'relative' }}
                  transition={{ mass: 0.2, duration: 0.6 }}
                  className="middle-block"
                >
                  <>{mobileComponent()}</>

                  {!isFetchingUsers && !subs.totalCount && !selectedSub && (
                    <EmtpyMessageData text={'No Subscriptions Yet'} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default styled(Purchases)`
  height: 100%;

  @media (max-width: 767px) {
    margin: 0;
  }
  .three-cols {
    height: 100%;
    display: flex;
  }
  .renewel-block {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .rc-scollbar {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .block-wrap {
      margin: auto;
      padding: 20px 0;
    }
    .reactivateSub {
      max-width: 520px;
      margin: 0 auto;
    }
    .text-para {
      margin: 0 0 16px;
      display: block;
      color: var(--pallete-text-main);
      opacity: 0.75;
      font-weight: 400;
    }
    .user-image {
      width: 120px;
      height: 120px;
      margin: 0 auto 4px;
    }
    .name {
      display: block;
      font-size: 20px;
      line-height: 24px;
      color: var(--pallete-text-main);
      font-weight: 500;
      margin: 0 0 5px;
    }
    .user-detail {
      font-size: 15px;
      line-height: 18px;
      color: var(--pallete-text-main-150);
      span {
        display: inline-block;
        vertical-align: top;
        padding: 0 10px;
      }
      .duration {
        position: relative;
        &:before {
          position: absolute;
          left: 0;
          width: 3px;
          height: 3px;
          border-radius: 100%;
          content: '';
          background: var(--pallete-text-main-150);
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
    .content {
      padding: 20px;
      background: var(--pallete-background-gray-secondary-light);
      border-radius: 15px;
      margin: 30px 0;
    }
    h3 {
      font-size: 24px;
      line-height: 28px;
      color: var(--pallete-text-main);
      margin: 0 0 12px;
      font-weight: 500;
    }
    .button {
      max-width: 278px;
      min-height: 52px;
      width: 100%;
      border-radius: 30px;
      font-size: 18px;
      line-height: 22px;
      /* color: var(--pallete-text-button-primary);
      background: var(--pallete-background-light); */
      &:not(:hover) {
        background: #000;
        color: #fff;
      }
    }
  }
  .left-col {
    width: 375px;
    min-width: 375px;
    border-right: 1px solid var(--pallete-colors-border);
    height: 100%;
    @media (max-width: 1199px) {
      width: 300px;
      min-width: 300px;
    }
  }
  .desktop-hidden {
    @media (min-width: 1024px) {
      display: none !important;
    }
  }
  .right-col {
    width: 320px;
    border-left: 1px solid var(--pallete-colors-border);
    /* padding: 20px; */
    background: var(--pallete-background-gray);
    @media (max-width: 1199px) {
      /* padding: 15px; */
      width: 280px;
    }
    @media (max-width: 1023px) {
      display: none;
    }
  }
  .scroll-wrap {
    padding: 20px;
    @media (max-width: 1199px) {
      padding: 15px;
    }
  }
  .rc-tabs-tab {
    &:nth-last-child(2) {
      @media (min-width: 1024px) {
        display: none;
      }
    }
    @media (max-width: 767px) {
      min-width: inherit;
    }
  }
  .middle-block .block .rc-tabs-tab {
    &:nth-child(2) {
      @media (min-width: 1024px) {
        display: none;
      }
    }
  }
  .rc-tabs-content-holder {
    flex-grow: 1;
    flex-basis: 0;
    background: var(--pallete-background-default);
    position: relative;
    overflow: hidden;
  }
  .rc-middle-container {
  }
  .rc-tabs-content {
    height: 100%;
  }
  .rc-tabs-tabpane {
    height: 100%;
  }
  .middle-block {
    display: flex;
    flex-direction: column;
    .topBar {
      padding: 0 0 7px;
    }
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;

    background: var(--pallete-background-primary);
    height: 100%;
    @media (max-width: 1023px) {
      padding: 12px 0 0;
    }
    @media (max-width: 767px) {
      padding: 12px 0 30px;
    }
    .chat-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .user-detail {
      padding: 20px 20px 0;
      background: var(--pallete-background-default);
      @media (max-width: 767px) {
        padding: 15px 10px 0;
      }
    }
    .widget-box {
      margin-bottom: 20px;
    }
    .rc-tabs-mobile {
      height: 100%;
      .rc-tabs-nav-list {
        @media (max-width: 767px) {
          margin: 0;
        }
      }
      .rc-tabs-tab {
        @media (max-width: 767px) {
          margin: 0;
          font-size: 0;
          line-height: 0;
          padding: 5px;
          flex: 1;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 0;
          border-left: 1px solid #e6ecf5;
          background: var(--pallete-background-default);
          color: var(--pallete-text-main-600);
          &.rc-tabs-tab-active {
            color: var(--pallete-primary-main);

            .sp_dark & {
              color: var(--pallete-text-main);
            }
          }
        }
        &:last-child {
          @media (max-width: 767px) {
            border-left: none;
          }
        }
        svg {
          @media (max-width: 767px) {
            width: 24px;
            margin: 0;
            height: auto;
          }
        }
      }
      .rc-tabs-nav {
        @media (max-width: 767px) {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--pallete-background-default);
          border-top: 1px solid var(--pallete-colors-border);
          z-index: 3;
        }
      }
    }
    .left-col {
      border-right: none;
      position: relative;
    }
    .posts-wrap {
      /* max-width: 687px;
      margin: 0 auto; */
      height: calc(${window.innerHeight + 'px'} - 135px);
      /* overflow-y: auto; */
      //-ms-overflow-style: none; /*IE and Edge */
      //scrollbar-width: thin; /* Firefox */
      //scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      .pop-card {
        max-width: 687px;
        margin: 0 auto;
        width: 100%;
        @media (max-width: 767px) {
          width: calc(100% - 30px);
        }
      }
      @media (max-width: 767px) {
        height: 100%;
        /* height: calc(${window.innerHeight + 'px'} - 250px); */
        /* padding-bottom: 75px; */
      }
    }
    .posts-wrap::-webkit-scrollbar {
      /* display: none; */
      /* width: 10px; */
    }
    /* .posts-wrap::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    }
    .posts-wrap::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    } */
  }
  .back-bar {
    padding: 0 15px 12px 45px;
    position: relative;
    display: flex;
    align-items: center;
    min-height: 25px;
    .arrow-back {
      width: 15px;
      position: absolute;
      left: 15px;
      top: calc(50% - 6px);
      transform: translate(0, -50%);
    }
    .user-info {
      padding: 0 0 0 10px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .name {
      display: block;
      font-size: 16px;
      line-height: 20px;
      color: var(--pallete-text-main-550);
      font-weight: 500;
    }
    .user-name {
      display: block;
      color: var(--pallete-text-light-200);
      font-size: 14px;
      line-height: 17px;
    }
  }
  .posts-wrap-area {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    position: relative;
    height: 100%;
    .chat-block {
      &.mt-20 {
        margin-top: 0 !important;
      }
    }
    .pop-card {
      max-width: 687px;
      margin: 0 auto;
      width: 100%;
      &:first-child {
        margin-top: 20px;
      }
    }
  }
  /* .post-bannerimages {
    min-height: 200px;
    max-height: 700px;
    .thumbnail-img {
      overflow-y: hidden;
      max-height: 500px;
    }
  } */
  .animated-block {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    overflow: hidden;
    height: 100%;
  }
  .animated-block-area {
    height: 100%;
    padding: 5px;
  }
  .form-subscription-area {
    max-width: 680px;
    margin: 0 auto;
    padding: 40px 0;
    .heading_Wrapper {
      .icon {
        width: 30px;
        margin: 0 10px 0 0;
        svg {
          width: 100%;
          height: auto;
          display: block;
        }
      }
      .thumbnail {
        width: 40px;
        height: 40px;
        margin: 0 10px 0 0;
        img {
          width: 100%;
          height: auto;
          display: block;
        }
      }
    }
  }
  .all-subs-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0 !important;
    height: 100%;
    .middle-block {
      padding: 0;
      .posts-wrap {
        height: 100%;
      }
    }
    .all-subs-posts {
      margin-top: 0 !important;
    }
    .all-subs-right-col {
      height: 100%;
    }
    .list-container {
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
`;
