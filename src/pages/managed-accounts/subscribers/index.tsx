import { getOrdersList } from 'api/Order';
import UserList from 'components/UserList';
import ListItem from 'components/UserList/ListItem';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useBottomNavToggler from 'hooks/useBottomnavToggle';
import useSocket from 'hooks/useSocket';
import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { setHeaderProps } from 'store/reducer/headerState';
import { getUsersList } from 'store/reducer/salesState';
import styled from 'styled-components';
import { getSortbyParam } from 'util/index';

type Props = {
  className?: string;
};

const Subscribers: React.FC<Props> = (props) => {
  const { className } = props;
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { socket } = useSocket();
  const sortRef = useRef('lastMessage');
  const user = useAppSelector((state) => state.managedUsers.item);
  const { applyClass, onBottomNavToggle } = useBottomNavToggler();
  const [data, setData] = useState<{ items: any[]; totalCount: number }>({
    items: [],
    totalCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(
      setHeaderProps({
        title: 'User Members',
        backUrl: `/managed-accounts/${id}`,
        showHeader: true,
      }),
    );
    getSubscriptions({
      sortType: 'lastMessageAsc',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    !applyClass && onBottomNavToggle({ applyClass: true });
    return () => {
      applyClass && onBottomNavToggle({ applyClass: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyClass]);
  useEffect(() => {
    socket?.on(user?._id, (chatData: any) => {
      if (chatData.type === 'chat') {
        const userIndex = data.items?.findIndex(
          (it) =>
            it?.buyer?._id === chatData?.user?._id &&
            chatData?.chat?.sentFrom === 'BUYER',
        );
        if (userIndex !== -1) {
          const newItems = [...data.items];
          const item = newItems[userIndex];
          const newObj = {
            buyerId: item.buyer,
            createdAt: item.createdAt,
            lastMessageAt: chatData.chat?.updatedAt,
            lastMessage: chatData.chat.messageValue,
            unread: (item?.unread || 0) + 1,
            sellerId: item.sllerId,
            orderId: item.orderId,
            tags: item.tags,
            totalEarnings: item.totalEarnings,
            _id: item._id,
          };
          const newItem = getMappedItem(newObj);
          if (sortRef.current === 'lastMessage') {
            newItems.splice(userIndex, 1);
            newItems.unshift(newItem);
          } else {
            newItems[userIndex] = getMappedItem(newObj);
          }
          setData({ ...data, items: newItems });
        }
      }
      if (chatData.type === 'new-sub') {
        const newItems = [...data.items];

        const newObj = {
          buyerId: chatData?.subscription?.buyerId,
          createdAt: chatData?.subscription?.createdAt,
          lastMessageAt: chatData?.subscription?.createdAt,
          lastMessage: '',
          unread: 0,
          sellerId: chatData?.subscription?.sllerId,
          orderId: chatData?.subscription?.orderId,
          tags: chatData?.subscription?.tags,
          totalEarnings: 0,
          _id: chatData?.subscription?._id,
        };
        newItems.unshift(getMappedItem(newObj));
        setData({ ...data, items: newItems, totalCount: data.totalCount + 1 });
      }
    });
    return () => {
      socket?.off(user?._id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user?._id, data?.items]);
  const getMappedItem = ({ buyerId: sub, ...rest }: any) => {
    const timestamp = rest?.lastMessageAt;
    const formattedTimestamp = !timestamp
      ? ''
      : dayjs(timestamp).isToday()
      ? dayjs(timestamp).format('h:mm A')
      : dayjs(timestamp).format('MM/DD/YYYY hh:mm A');
    return {
      title: `${sub?.pageTitle ?? 'Incognito User'}`,
      image: sub.profileImage,
      timestamp: formattedTimestamp,
      isOnline: sub.isOnline,
      description: !!rest?.totalEarnings ? (
        <span>${rest.totalEarnings}</span>
      ) : (
        ''
      ),
      extra:
        rest?.unread > 0 ? (
          <span className="unread-messages">{rest?.unread}</span>
        ) : null,
      id: rest._id,
      tags: rest.tags || [],
      buyer: sub,
      ...rest,
    };
  };
  const mapItems = (items: any[]) => {
    return (
      items?.map(({ buyerId: sub, ...rest }: any) => {
        const timestamp = rest?.lastMessageAt;
        const formattedTimestamp = !timestamp
          ? ''
          : dayjs(timestamp).isToday()
          ? dayjs(timestamp).format('h:mm A')
          : dayjs(timestamp).format('MM/DD/YYYY hh:mm A');
        return {
          title: `${sub?.pageTitle ?? 'Incognito User'}`,
          image: sub.profileImage,
          timestamp: formattedTimestamp,
          isOnline: sub.isOnline,
          description: !!rest?.totalEarnings ? (
            <span>${rest.totalEarnings}</span>
          ) : (
            ''
          ),
          extra:
            rest?.unread > 0 ? (
              <span className="unread-messages">{rest?.unread}</span>
            ) : null,
          id: rest._id,
          tags: rest.tags || [],
          buyer: sub,
          ...rest,
        };
      }) || []
    );
  };

  const getSubscriptions = (params: any) => {
    setLoading(true);
    getOrdersList({ ...params, limit: 20, sellerId: id })
      .then((res) => {
        const items = mapItems(res.items);
        setData({ items, totalCount: res.totalCount });
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setLoading(false);
      });
  };

  const onSortChange = (sortOption: string, sortType: string) => {
    sortRef.current = sortOption;
    getSubscriptions({
      sortType: `${sortOption}${sortType
        .substring(0, 1)
        .toUpperCase()}${sortType.substring(1)}`,
    });
  };

  const loadMore = async (
    items: any[],
    sortOption: string,
    sortType: string,
  ): Promise<any> => {
    return dispatch(
      getUsersList({
        params: {
          skip: items?.length,
          sellerId: id,
          type: 'seller',
          limit: 20,
          sort: getSortbyParam('createdAt'),
          popType: 'chat-subscription',
          sortType:
            sortOption +
            sortType.substring(0, 1).toUpperCase() +
            sortType.substring(1),
        },
        callback: (dataa) => {
          if (dataa?.items) {
            const newData = [...data.items];
            const updatedData = [...dataa.items];
            const newItems = updatedData.filter((f) => {
              const isFind = newData.findIndex((fd) => fd._id === f._id);
              const isExist = isFind === -1;
              if (!isExist) {
                newData[isFind] = getMappedItem(f);
              }
              return isExist;
            });
            setData(() => ({
              items: [...newData, ...mapItems(newItems)],
              totalCount: dataa.totalCount,
            }));
          }
        },
      }),
    ).catch((e) => console.log(e));
  };

  const handleSearch = async (
    search: string,
    data: any,
    sortOption: string,
    sortType: string,
  ) => {
    return new Promise((res, rej) => {
      setLoading(true);
      const paramsList: any = {
        type: 'seller',
        limit: 20,
        sort:
          sortOption +
          sortType.substring(0, 1).toUpperCase() +
          sortType.substring(1),
        name: search,
        popType: 'chat-subscription',
        sellerId: id,
      };
      dispatch(
        getUsersList({
          params: paramsList,
          callback: (data) => {
            setData({
              items: mapItems(data.items),
              totalCount: data.totalCount,
            });
          },
        }),
      )
        .catch((e) => {
          console.log(e);
          rej(e);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const debouncedSearch = debounce(handleSearch, 500);

  return (
    <div className={`${className} subscription-member-list`}>
      {user && (
        <ListItem
          className="top-level-user"
          title={`${user?.pageTitle ?? 'Incognito User'}`}
          image={user?.profileImage}
          isOnline={user?.isOnline}
          extra={
            <div>
              <span className="unread-messages">{user?.subscription}</span>
              <span className="account-subscriptions">{user?.unread}</span>
            </div>
          }
        />
      )}
      <UserList
        items={data.items}
        onItemClick={(item: any) => {
          history.push(
            `/managed-accounts/${id}/subscribers/${item.id}?userId=${item.buyer._id}`,
          );
        }}
        loading={loading}
        allowSearch
        searchFn={debouncedSearch as any}
        onSortChange={onSortChange}
        totalCount={data.totalCount}
        loadMore={loadMore}
      />
    </div>
  );
};

export default styled(Subscribers)`
  height: 100%;

  .top-level-user {
    padding: 10px 20px 10px 18px;
    background: var(--pallete-background-default);
    border-bottom: 1px solid var(--pallete-colors-border);
  }

  .user-managed-list {
    height: calc(100% - 59px);
  }

  .list-scroll {
    height: calc(100% - 60px) !important;
    width: calc(100% + 44px) !important;
    margin: 0 -22px;

    @media (max-width: 767px) {
      height: calc(100vh - 285px) !important;
      margin: 0 -15px;
      width: calc(100% + 30px) !important;
    }

    .user-managed-list__wrap {
      padding-top: 0;
      padding-bottom: 0;

      @media (max-width: 767px) {
        padding-bottom: 80px;
      }
    }
  }

  .user-managed-list {
    padding: 0 22px;

    @media (max-width: 767px) {
      padding: 0 15px;
    }

    .members-filters-form {
      background: none;
      padding: 12px 0 0;
      margin: 0 0 19px;
    }

    .search-area-box {
      &:after {
        display: none;
      }

      .field-search {
        margin: 0;
      }
    }
  }
`;
