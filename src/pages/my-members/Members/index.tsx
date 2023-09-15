/* eslint-disable @typescript-eslint/no-unused-vars */
import { getOrdersList } from 'api/Order';
import axios from 'axios';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useSocket from 'hooks/useSocket';
import { stringify } from 'querystring';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router-dom';
import {
  getSubscription,
  resetChatState,
  resetSubscription,
} from 'store/reducer/chat';
import {
  getAndInsertAtFirst,
  getUsersList,
  reInitializeState,
  setIsUsersFetched,
  setSelectedOrder,
  setSelectedSub,
  // setSelectedUser,
  setUserListOrders,
  setUserUnreadCount,
  updateChatUserOnlineStatus,
  updateChatWindowActiveStatus,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import RoomListingBar from './components/RoomListingBar';

interface Props {
  className?: string;
}

function Index({ className }: Props): ReactElement {
  const { user } = useAuth();
  const { socket } = useSocket();
  const cancelToken = useRef<any>();
  const [selectedSort, setSelectedSort] = useState<{
    label: string;
    value: string;
  }>({ label: 'Recent Message', value: 'lastMessage' });
  const subs = useAppSelector((state) => state.mysales.usersList);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isUsersFetched = useAppSelector(
    (state) => state.mysales.isUsersFetched,
  );

  const isFetchingUsers = useAppSelector(
    (state) => state.mysales.isUserListFetching,
  );
  const [sortState, setSortState] = useState<string>('Asc');
  const usersListTotalCount = useAppSelector(
    (state) => state.mysales.usersList.totalCount,
  );
  const emailNotificationClosedByUser = useAppSelector(
    (state) => state.global?.emailNotificationClosedByUser,
  );
  const selectedOrder = useAppSelector((state) => state.mysales.selectedOrder);
  const { showRightView } = useControllTwopanelLayoutView();
  const {
    showNav = true,
    applyClass,
    onBottomNavToggle,
  } = useBottomNavToggler();
  const [isMounting, setIsMounting] = useState(false);
  const location = useLocation();
  const { userId, orderId, type, ...rest } = parseQuery(location.search);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const getSubscriptionById = (id?: string) => {
    if (id) {
      dispatch(
        getSubscription({
          subscriptionId: id,
          callback: (data) => {
            dispatch(setSelectedSub(data));
            dispatch(
              setUserUnreadCount({
                unread: data?.unread || 0,
                subscriptionId: data?._id,
              }),
            );
          },
          customError: {
            ignoreStatusCodes: [404],
          },
        }),
      )
        .then((data) => console.log('fetched data'))
        .catch((e) => console.log(e));
    }
  };
  const getSellersUsers = (paramsList: Record<string, any>) => {
    dispatch(
      getUsersList({
        firstSelect: false,
        defaultOrder: '' as string,
        params: paramsList,
        callback: (data) => {
          if (userId && !!data.items.length) {
            const index = data.items.findIndex(
              (u: any) => u?.buyerId?._id === userId,
            );

            if (isDesktop) {
              dispatch(updateChatWindowActiveStatus(true));
            }
            if (!isDesktop) {
              showRightView();
            }
            if (index === -1) {
              dispatch(
                getAndInsertAtFirst({
                  userId: userId as string,
                  type: 'seller',
                  popType: 'chat-subscription',
                }),
              )
                .unwrap()
                .then((d) => {
                  const data = d?.data;
                  if (data && data?.totalCount > 0) {
                    // dispatch(setSelectedUser(data?.items?.[0]));
                    getSubscriptionById(data?.items?.[0]?._id);
                  }
                })
                .catch((e) => console.log(e));
            } else {
              getSubscriptionById(data?.items[index]?._id);
            }
          }
        },
        options: {
          cancelToken: cancelToken.current.token,
        },
        isInitial: true,
      }),
    )
      .catch((e) => console.log(e))
      .finally(() => {
        dispatch(setIsUsersFetched(true));
        setIsMounting(false);
      });
  };
  useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    if ((!isUsersFetched && !isDesktop) || isDesktop) {
      setIsMounting(true);
      dispatch(reInitializeState());
      dispatch(updateChatWindowActiveStatus(false));
    }
    dispatch(resetChatState());
    if ((!isUsersFetched && !isDesktop) || isDesktop) {
      const paramsList: any = {
        type: 'seller',
        limit: 20,
        sort: 'createdAt',
        popType: 'chat-subscription',
        sortType: selectedSort?.value + sortState,
      };

      getSellersUsers(paramsList);
    }
    return () => {
      cancelToken.current.cancel('Operation canceled by the user.');
      dispatch(updateChatWindowActiveStatus(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!!usersListTotalCount) {
      setIsLoading(true);
      const paramsList: any = {
        type: 'seller',
        limit: 20,
        sort: 'createdAt',
        popType: 'chat-subscription',
        sortType: selectedSort?.value + sortState,
      };
      getOrdersList(paramsList)
        .then((d) => {
          console.log('sort', d);
          if (d?.totalCount > 0) {
            dispatch(setUserListOrders(d));
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState, selectedSort?.value]);
  useEffect(() => {
    if (!isDesktop) {
      if (userId) {
        onBottomNavToggle({ showNav: false, applyClass: false });
      } else {
        onBottomNavToggle({ showNav: true, applyClass: true });
      }
    }
    return () => {
      !isDesktop && applyClass && onBottomNavToggle({ applyClass: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, showNav, applyClass]);
  // useEffect(() => {
  //   if (!isDesktop) {
  //     setChatLayoutHeight({
  //       id: 'chat-layout1',
  //       className: 'edit-back',
  //       both: true,
  //     });
  //     return;
  //   }
  //   setChatLayoutHeight({
  //     id: 'chat-layout1',
  //   });
  // }, [user, isMounting, emailNotificationClosedByUser]);

  useEffect(() => {
    socket?.on('chat', (data) => {
      dispatch(updateChatUserOnlineStatus({ ...data, isSeller: true }));
    });
    return () => {
      socket?.off('chat');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  return (
    <div className={`${className} chat-layout-panel`}>
      <div id="chat-layout1" className="three-cols">
        {!isFetchingUsers && !subs.totalCount ? (
          <div className="py-30 px-10 empty-data text-center">
            You don’t have any members..
          </div>
        ) : isFetchingUsers && !usersListTotalCount ? (
          <div className="left-col">
            <div className="skeleton_wrap">
              <SkeletonTheme
                borderRadius="22px"
                baseColor="#EDF0F6"
                highlightColor="#c2c3c6"
              >
                <Skeleton className="mb-15" height={44} />
              </SkeletonTheme>
              <SkeletonTheme
                borderRadius="4"
                baseColor="#EDF0F6"
                highlightColor="#c2c3c6"
              >
                <Skeleton className="mb-10" height={70} count={4} />
              </SkeletonTheme>
            </div>
          </div>
        ) : (
          <div className="left-col">
            <RoomListingBar
              pushUrl={'/my-members/subscriber'}
              isLoading={isLoading}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              sortState={sortState}
              changeSort={setSortState}
              enaablePush={isDesktop}
              enableTagsearch={false}
              enableSort={true}
              getSubscription={isDesktop}
              onChatClick={(subscription) => {
                dispatch(resetSubscription({}));
                dispatch(setSelectedSub({}));
                // dispatch(setSelectedUser(subscription));
                getSubscriptionById(subscription?._id);
                if (selectedOrder?._id) {
                  dispatch(setSelectedOrder({}));
                }
                if (!isDesktop) {
                  showRightView();
                }
                history.push(
                  `/my-members/subscriber?${stringify({
                    ...rest,
                    userId: subscription?.buyerId?._id,
                  })}`,
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default styled(Index)`
  /* margin: -51px 0 0; */
  height: 100%;

  @media (max-width: 767px) {
    margin: 0;
  }
  .skeleton_wrap {
    padding: 28px 20px;
  }
  .three-cols {
    height: 100%;
    display: flex;
  }
  .left-col {
    height: 100%;
    width: 100%;

    .rc-scollbar {
      width: 100%;

      @media (max-width: 767px) {
        padding-bottom: 70px;
      }
    }

    .user-listings {
      padding: 0 15px;

      @media (max-width: 767px) {
        padding-bottom: 40px;
      }
    }

    .chat-user-area {
      background: var(--pallete-background-primary-light);
      border-radius: 5px;
      margin: 0 0 10px;
      border: 2px solid transparent;

      &:hover {
        background: var(--pallete-background-secondary);
      }

      &.active {
        border-color: var(--pallete-primary-main);
        background: none;
      }
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
      font-size: 14px;
      line-height: 17px;
      color: var(--pallete-text-light-200);

      .sp_dark & {
        color: #fff;

        svg {
          path {
            fill: #fff;
          }
        }
      }
    }
  }
`;
