import ComponentsHeader from 'components/ComponentsHeader';
import { RequestLoader } from 'components/SiteLoader';

import EmptydataMessage from 'components/EmtpyMessageData';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import { stringify } from 'querystring';
import { ReactElement, useEffect, useState } from 'react';

import { isDesktop } from 'react-device-detect';
import { useHistory } from 'react-router-dom';
import RoomListingBar from './components/RoomListingBar';

import {
  getVaultSubscription,
  getVaultUser,
  getVaultUsersList,
  resetVaultState,
  setVaultUser,
} from 'store/reducer/vault';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

const SubLoader = styled(RequestLoader)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VaultRoomListing = ({
  className,
}: {
  className?: string;
  user?: IUser;
}): ReactElement => {
  const [isMounting, setIsMounting] = useState(false);
  const { userId, view, ...rest } = parseQuery(location.search);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const isFetchingUsers = useAppSelector(
    (state) => state.vault.isVaultUsersFeting,
  );
  const selectedSub = useAppSelector(
    (state) => state.vault.selectedSubscription,
  );
  const subs = useAppSelector((state) => state.vault.vaultusersList);
  const { showRightView } = useControllTwopanelLayoutView();
  const getSubscriptossnById = async (subId: string) => {
    try {
      dispatch(
        getVaultSubscription({
          subscriptionId: subId,
          customError: {
            ignoreStatusCodes: [404, 500],
          },
        }),
      );
    } catch (error) {
      return error;
    }
  };
  const getSubandInsertFirst = (
    userId: string,
    callback?: (...args: any) => void,
  ) => {
    dispatch(
      getVaultUser({
        userId: userId as string,
        type: 'buyer',
        popType: 'chat-subscription',
      }),
    )
      .unwrap()
      .then((d: any) => {
        const data = d?.data;
        if (data && data?.totalCount > 0) {
          getSubscriptossnById(data.items[0]._id);

          callback?.();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    setIsMounting(true);
    dispatch(resetVaultState());

    const paramsList: any = {
      type: 'buyer',
      limit: 13,
      sort: 'createdAt',
      popType: 'chat-subscription',
    };

    dispatch(
      getVaultUsersList({
        firstSelect: false as boolean,
        // defaultOrder: userId as string,
        params: paramsList,
        callback: async (data) => {
          if (!view) {
            if (userId && !!data.items.length) {
              const index = data.items.find(
                (u: any) => u?.sellerId?._id === userId,
              );
              if (!index?._id) {
                getSubandInsertFirst(userId as string);
                showRightView();
              } else {
                dispatch(setVaultUser(index));
                getSubscriptossnById(index._id as string);
                showRightView();
              }
            }
          }
        },
      }),
    )
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsMounting(false);
      });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SpinnerComp = (
    <SubLoader
      isLoading={true}
      width="28px"
      height="28px"
      color="var(--pallete-primary-main)"
    />
  );
  if (isMounting) {
    return (
      <div className={className}>
        <SubLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {!isFetchingUsers && !subs.totalCount ? (
        <>{SpinnerComp}</>
      ) : (
        <>
          {!isFetchingUsers && !subs.totalCount ? (
            <EmptydataMessage text=" You don't have any media." />
          ) : (
            <>
              <ComponentsHeader title="VAULT" />
              <RoomListingBar
                newFeed={false}
                className="sublisting"
                enablelistingFunctions={false}
                enableTagsearch={false}
                options={{
                  showlastmessage: false,
                  showusername: true,
                }}
                onChatClick={(subscription) => {
                  getSubscriptossnById(subscription._id as string);
                  dispatch(setVaultUser(subscription));
                  if (!isDesktop) {
                    showRightView();
                  }
                  if (subscription?.sellerId?._id === userId && isDesktop) {
                    return;
                  }
                  history.push(
                    `/vault?${stringify({
                      ...rest,
                      userId: subscription?.sellerId?._id,
                      subId: subscription?._id,
                    })}`,
                  );
                }}
              />
            </>
          )}

          {!isFetchingUsers && !subs.totalCount && !selectedSub && (
            <EmptydataMessage text=" You don't have any media." />
          )}
        </>
      )}
    </div>
  );
};
export default styled(VaultRoomListing)`
  .custom-scroll-bar {
    .rc-scollbar {
      width: 100%;
    }
  }

  .field-search {
    .fields-wrap {
      .form-control {
        border-radius: 40px;

        .sp_dark & {
          background: rgba(255, 255, 255, 0.1);
        }

        &::placeholder {
          .sp_dark & {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }

      .text-input.ico-input {
        .form-control {
          padding-left: 20px;
          padding-right: 50px;
        }

        .icon {
          width: auto;
          height: 16px;
          left: auto;
          right: 16px;

          .sp_dark & {
            color: rgba(255, 255, 255, 0.4);
          }

          path {
            fill: currentColor;
          }

          svg {
            display: block;
          }
        }
      }
    }
  }

  .sublisting {
    padding: 0;
    height: calc(100% - 50px);

    .user-listings {
      padding: 0 20px;

      @media (max-width: 767px) {
        padding: 0 15px 40px;
      }
    }
  }
`;
