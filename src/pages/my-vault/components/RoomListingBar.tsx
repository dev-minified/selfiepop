import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import RoomCard from 'pages/subscriptions/components/RoomCard';
import RoomSearchFrom from 'pages/subscriptions/components/RoomSearch';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RoomListing from './RoomListing';

import { RequestLoader } from 'components/SiteLoader';
import { getVaultUsersList, setVaultUsers } from 'store/reducer/vault';
import styled from 'styled-components';
import { getSortbyParam, parseQuery } from 'util/index';

interface Props {
  className?: string;
  onChatClick?: (user: IOrderUserType) => void;
  setIsAllSubcription?: any;
  enableTagsearch?: boolean;
  enaablePush?: boolean;
  enablelistingFunctions?: boolean;
  showPeopleYoumayKnow?: boolean;
  newFeed?: boolean;
  onProfileCardClick?: (item: any) => void;
  onAllSubsClick?: () => void;
  options?: {
    showusername?: boolean;
    showlastmessage?: boolean;
  };
}
let timeout: NodeJS.Timeout;
function RoomListingBar({
  className,
  onChatClick,
  newFeed = true,
  enableTagsearch = true,
  enablelistingFunctions = true,
  showPeopleYoumayKnow = false,
  onProfileCardClick,
  onAllSubsClick,
  options = {
    showlastmessage: true,
    showusername: false,
  },
}: Props): ReactElement {
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, orderId, type, ...rest } = parseQuery(location.search);
  const users = useAppSelector((state) => state.vault.vaultusersList);

  const isUserListFetching = useAppSelector(
    (state) => state.vault.isVaultUsersFeting,
  );
  const alreadyFetchedUsers = useAppSelector(
    (state) => state.vault.alreadyFetchedUsers,
  );
  const { user } = useAuth();
  const [tags, setTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isTagActive, setIsTagActive] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<IOrderUserType[]>([]);
  const [showResultCount, setShowResultCount] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const scrollbarRef = useRef<any>(null);

  const getUsers = (params: Record<string, any> = {}) => {
    const paramsList: any = {
      type: 'buyer',
      limit: 13,
      sort: 'createdAt',
      popType: 'chat-subscription',
      ...params,
    };
    dispatch(
      getVaultUsersList({
        params: paramsList,
        callback: (data) => {
          if ((!userId || !searchText) && !!data.items.length) {
          }
        },
      }),
    ).catch((e) => console.log(e));
  };
  const onhandleSearchText = (text: string) => {
    setSearchText(text);
    clearTimeout(timeout);

    const delayDebounceFn = setTimeout(async () => {
      if (!isTagActive && text) {
        setShowResultCount(true);
        const paramsList: any = {
          type: 'buyer',
          limit: 10,
          sort: 'createdAt',
          name: searchText,
          popType: 'chat-subscription',
        };
        dispatch(
          getVaultUsersList({
            defaultOrder: userId as string,
            params: paramsList,
            callback: (data) => {
              if (userId && !!data.items.length) {
                dispatch(setVaultUsers(data));
                setFilteredUsers(data.items);
              } else {
                // dispatch(setSelectedUser(null));
                setFilteredUsers(data.items);
              }
            },
          }),
        ).catch((e) => console.log(e));
        return () => clearTimeout(delayDebounceFn);
      } else {
        getUsers({ isInitial: true });
      }
    }, 200);
  };

  useEffect(() => {
    if (users) {
      setFilteredUsers(users.items as any);
    }
  }, [users]);

  const handleScroll = async () => {
    if (users?.items?.length < users?.totalCount) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if ((t > 1 || showPeopleYoumayKnow) && !isUserListFetching) {
        // if (!isUserListFetching) {
        dispatch(
          getVaultUsersList({
            params: {
              skip: users?.items?.length - alreadyFetchedUsers.totalCount,
              type: 'buyer',
              limit: 13,
              sort: getSortbyParam('createdAt'),
              popType: 'chat-subscription',
            },
            callback: () => {},
          }),
        )
          .unwrap()
          .catch((e) => console.log(e));
      }
    }
  };

  return (
    <div className={className}>
      {newFeed && (
        <div className="main-user-wrap">
          <RoomCard
            className="main-user"
            user={{ profileImage: user?.profileImage }}
            title={'Feed'}
            onChatClick={onAllSubsClick}
          />
        </div>
      )}

      <RoomSearchFrom
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
          onhandleSearchText('');
          setTags([]);
        }}
        count={filteredUsers.length}
      />
      {isUserListFetching && !filteredUsers?.length && (
        <RequestLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      )}
      <Scrollbar
        className="user-listing-scroll"
        ref={scrollbarRef}
        {...(!showPeopleYoumayKnow ? { onScrollStop: handleScroll } : {})}
      >
        <>
          <RoomListing
            onChatClick={onChatClick}
            className="user-listings"
            users={filteredUsers}
            options={options}
          />
          {users?.totalCount !== filteredUsers?.length && (
            <div
              className="loadMore"
              onClick={() => {
                if (showPeopleYoumayKnow) {
                  handleScroll();
                }
              }}
            >
              {isUserListFetching && !!filteredUsers?.length ? (
                <RequestLoader
                  isLoading={true}
                  width="28px"
                  height="28px"
                  color="var(--pallete-primary-main)"
                />
              ) : showPeopleYoumayKnow ? (
                <span className="load-more-text">Load More</span>
              ) : null}
            </div>
          )}
        </>
      </Scrollbar>
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
  }

  .main-user-wrap {
    padding: 15px 20px 0;
    background: var(--pallete-background-gray);

    @media (max-width: 767px) {
      padding: 15px 12px 0;
    }

    .main-user {
      margin: 0;
      background: var(--pallete-background-secondary);
    }
  }

  .rc-scollbar {
    @media (max-width: 767px) {
      padding-bottom: 90px;
    }
  }

  .loadMore {
    text-align: center;
    padding: 10px 0;

    .load-more-text {
      color: #8287a0;
      font-size: 14px;
      line-height: 18px;
      font-weight: 500%;
      cursor: pointer;

      &:before {
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px 0 0;
        border-style: solid;
        border-width: 6px 6px 0 6px;
        border-color: currentColor transparent transparent transparent;
        content: '';
      }
    }
  }
`;
