import EmptydataMessage from 'components/EmtpyMessageData';
import { RequestLoader } from 'components/SiteLoader';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';

import useSocket from 'hooks/useSocket';
import { stringify } from 'querystring';
import { ReactElement, useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router';
import {
  getSubscription,
  resetChatState,
  resetSubscription,
} from 'store/reducer/chat';
import {
  getAndInsertAtFirst,
  getUsersList,
  reInitializeState,
  setSelectedOrder,
  setSelectedSub,
  // setSelectedUser,
  setUserUnreadCount,
  toggleContentAccess,
  toggleSendMessage,
  updateChatUserOnlineStatus,
  updateChatWindowActiveStatus,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import RoomListingBar from './components/RoomListingBar';

dayjs.extend(utc);

dayjs.extend(isSameOrAfter);

interface Props {
  className?: string;
}

const SubLoader: any = styled(RequestLoader)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Purchases({ className }: Props): ReactElement {
  const location = useLocation();
  const { socket } = useSocket();
  const history = useHistory();

  const { userId, view, subId, ...rest } = parseQuery(location.search);

  const dispatch = useAppDispatch();

  const [subLoading, setIsSubLoading] = useState(false);

  const [isMounting, setIsMounting] = useState(false);
  const { showRightView } = useControllTwopanelLayoutView();
  // const selectedUser = useAppSelector((state) => state.mysales.selectedUser);
  const subs = useAppSelector((state) => state.mysales.usersList);

  const isFetchingUsers = useAppSelector(
    (state) => state.mysales.isUserListFetching,
  );
  const selectedOrder = useAppSelector((state) => state.mysales.selectedOrder);
  const selectedSub = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );

  useEffect(() => {
    socket?.on('chat', (data) => {
      dispatch(updateChatUserOnlineStatus({ ...data, isSeller: false }));
    });
    return () => {
      socket?.off('chat');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const getSubscriptionById = async (id?: string) => {
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
          console.log(e);
          // setSubscriptonError(e?.message || 'Subscription not found!');
        })
        .finally(() => {
          setIsSubLoading(false);
        });
    }
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
          callback?.(data?.items[0]);
        }
        setIsMounting(false);
      })
      .catch((e) => {
        console.log(e);
        setIsMounting(false);
      });
  };
  useEffect(() => {
    dispatch(updateChatWindowActiveStatus(false));
    setIsMounting(true);
    dispatch(reInitializeState());
    dispatch(resetChatState());

    const paramsList: any = {
      type: 'buyer',
      limit: 13,
      sort: 'createdAt',
      popType: 'chat-subscription',
    };

    dispatch(
      getUsersList({
        firstSelect: false as boolean,
        // defaultOrder: userId as string,
        params: paramsList,
        callback: async (data) => {
          if (userId && !!data.items.length) {
            const index = data.items.find(
              (u: any) => u?.sellerId?._id === userId,
            );
            const query = parseQuery(location.search);
            if (!index?._id) {
              getSubandInsertFirst(userId as string, (item: IOrderUser) => {
                if (userId && !query.subId) {
                  history.push(
                    `${location.pathname}?${stringify({
                      ...query,
                      subId: item._id,
                    })}`,
                  );
                }
                showRightView();
              });
            } else {
              getSubscriptionById(index?._id);
              if (userId && query.subId) {
                showRightView();
              }
              setIsMounting(false);
              // const subId = index?._id;
            }
          } else {
            setIsMounting(false);
          }
        },
      }),
    )
      .catch((e) => {
        console.log(e);
        setIsMounting(false);
      })
      .finally(() => {});

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isMounting) {
    return (
      <div className={className}>
        <SubLoader
          isLoading={isMounting}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      </div>
    );
  }

  const SpinnerComp = (
    <SubLoader
      isLoading={true}
      width="28px"
      height="28px"
      color="var(--pallete-primary-main)"
    />
  );

  return (
    <div className={className}>
      {!isFetchingUsers && !subs.totalCount ? (
        <EmptydataMessage text=" You don't have any Subscriptions..." />
      ) : (
        <>
          <RoomListingBar
            newFeed={false}
            className="sublisting"
            enablelistingFunctions={false}
            enableTagsearch={false}
            onAllSubsClick={() => {
              dispatch(resetSubscription({}));
              dispatch(setSelectedSub({}));

              if (!isDesktop) {
                showRightView();
              }
              history.push(`/messages/subscriptions`);
            }}
            onChatClick={(subscription) => {
              if (selectedOrder?._id) {
                dispatch(setSelectedOrder({}));
              }
              dispatch(resetSubscription({}));
              dispatch(setSelectedSub({}));
              if (!isDesktop) {
                showRightView();
              }
              history.push(
                `/messages/subscriptions?${stringify({
                  ...rest,
                  userId: subscription?.sellerId?._id,
                  subId: subscription?._id,
                })}`,
              );
            }}
          />

          {subLoading ? <>{SpinnerComp}</> : null}
          {!isFetchingUsers && !subs.totalCount && !selectedSub && (
            <EmptydataMessage text=" You don't have any Subscriptions..." />
          )}
        </>
      )}
    </div>
  );
}
export default styled(Purchases)`
  height: 100%;
  @media (max-width: 767px) {
    margin: 0;
  }

  .scroll-wrap {
    padding: 20px;
    @media (max-width: 1199px) {
      padding: 15px;
    }
  }
`;
