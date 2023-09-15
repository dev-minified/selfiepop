import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { stringify } from 'querystring';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getSubscription } from 'store/reducer/chat';
import {
  getUsersList,
  searchUserList,
  setSelectedSub,
} from 'store/reducer/salesState';
import styled from 'styled-components';
import { getSortbyParam, parseQuery } from 'util/index';
import RoomListing from './RoomListing';
import RoomSearchFrom from './RoomSearch';

interface Props {
  className?: string;
  sortState?: string;
  selectedSort?: { value: string; label: string };
  setSelectedSort?: Function;
  changeSort?: Function;
  onChatClick?: (user: IOrderUserType) => void;
  enableTagsearch?: boolean;
  isLoading?: boolean;
  enaablePush?: boolean;
  getSubscription?: boolean;
  pushUrl?: string;
  enableSort?: boolean;
}
let delayDebounceFn: NodeJS.Timeout;
function RoomListingBar({
  className,
  onChatClick,
  selectedSort,
  setSelectedSort,
  changeSort,
  sortState = 'Asc',
  enableTagsearch = true,
  isLoading = false,
  enaablePush = true,
  getSubscription: fetchSub = true,
  pushUrl,
  enableSort,
}: Props): ReactElement {
  const users = useAppSelector((state) => state.mysales.usersList);
  const [tags, setTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isTagActive, setIsTagActive] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [showResultCount, setShowResultCount] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const scrollbarRef = useRef<any>(null);
  const isUserListFetching = useAppSelector(
    (state) => state.mysales.isUserListFetching,
  );
  const alreadyFetchedUsers = useAppSelector(
    (state) => state.mysales.alreadyFetchedUsers,
  );
  const location = useLocation();
  const history = useHistory();
  const isMount = useRef<any>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, orderId, type, ...rest } = parseQuery(location.search);
  const getSubscriptionById = (id?: string) => {
    if (id) {
      dispatch(
        getSubscription({
          subscriptionId: id,
          callback: (data) => {
            dispatch(setSelectedSub(data));
          },
        }),
      ).catch((e) => console.log(e));
    }
  };
  const onhandleSearchText = (text: string) => {
    setSearchText(text);
    clearTimeout(delayDebounceFn);

    delayDebounceFn = setTimeout(async () => {
      if (!isTagActive && text) {
        setShowResultCount(true);
        const paramsList: any = {
          type: 'seller',
          limit: 20,
          sort: 'createdAt',
          name: text,
          popType: 'chat-subscription',
        };
        dispatch(
          getUsersList({
            defaultOrder: userId as string,
            params: paramsList,
            callback: (data) => {
              if (userId && !!data.items.length) {
                fetchSub && getSubscriptionById(data?.items[0]?.subscriptionId);
                enaablePush &&
                  history.push(
                    `${pushUrl}?${stringify({
                      ...rest,
                      userId: data.items[0]?._id,
                    })}`,
                  );
                dispatch(searchUserList(data));
                setFilteredUsers(data.items.map((m: any) => m?._id));
              } else {
                setFilteredUsers(data.items.map((m: any) => m?._id));
              }
            },
          }),
        ).catch((e) => console.log(e));
        return () => clearTimeout(delayDebounceFn);
      } else {
        getUsers();
      }
    }, 200);
  };
  const getUsers = () => {
    const paramsList: any = {
      type: 'seller',
      limit: 20,
      sort: 'createdAt',
      popType: 'chat-subscription',
    };
    dispatch(
      getUsersList({
        params: paramsList,
        callback: (data) => {
          if ((!userId || !searchText) && !!data.items.length) {
            fetchSub && getSubscriptionById(data?.items[0]?.subscriptionId);
            enaablePush &&
              history.push(
                `${pushUrl}?${stringify({
                  ...rest,
                  userId: data.items[0]?._id,
                })}`,
              );
          }
        },
      }),
    ).catch((e) => console.log(e));
  };

  useEffect(() => {
    if (users) {
      setFilteredUsers(users.items);
    }
  }, [users]);
  const handleScroll = async () => {
    if (scrollbarRef.current && users?.items?.length < users?.totalCount) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isUserListFetching) {
        dispatch(
          getUsersList({
            params: {
              skip: users?.items?.length - alreadyFetchedUsers.totalCount,
              type: 'seller',
              limit: 20,
              sort: getSortbyParam('createdAt'),
              popType: 'chat-subscription',
              sortType: selectedSort?.value + sortState,
            },
            callback: () => {},
          }),
        ).catch((e) => console.log(e));
      }
    }
  };

  return (
    <div className={`${className} chat-user-listing`}>
      <RoomSearchFrom
        enableSort={enableSort}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        sortState={sortState}
        setSortState={changeSort}
        enableTagsearch={enableTagsearch}
        searchText={searchText}
        onSearchTextUpdate={onhandleSearchText}
        tags={tags}
        onTagsUpdate={setTags}
        isTagActive={isTagActive}
        setIsTagActive={setIsTagActive}
        showResultCount={showResultCount}
        onResultCountClose={() => {
          setShowResultCount(false);
          // setSearchText('');
          onhandleSearchText('');
          setTags([]);
        }}
        count={filteredUsers.length}
      />
      {((isUserListFetching && !users.items?.length) || isLoading) && (
        <RequestLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      )}
      {!isLoading && (
        <Scrollbar onScrollStop={handleScroll} ref={scrollbarRef}>
          <RoomListing
            onChatClick={onChatClick}
            className="user-listings"
            users={filteredUsers}
          />
        </Scrollbar>
      )}
      {isUserListFetching && !!users.items?.length && (
        <RequestLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      )}
    </div>
  );
}

export default styled(RoomListingBar)`
  background: var(--pallete-background-gray);
  padding: 0 6px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .user-listings {
    flex-grow: 1;
    flex-basis: 0;

    @media (max-width: 767px) {
      padding-bottom: 80px;
    }
  }
`;
