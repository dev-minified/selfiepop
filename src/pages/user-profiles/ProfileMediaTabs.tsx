import { RequestIcon, UnlockOrdersIcon } from 'assets/svgs';
import Button from 'components/NButton';
import Tabs from 'components/Tabs';
import MediaGallery from 'components/VaultMediaGallery';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useWallHook from 'hooks/useWallHook';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';

import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { RequestLoader } from 'components/SiteLoader';
import { toast } from 'components/toaster';
import {
  resetpostschatmedia,
  selectWallPosts,
} from 'store/reducer/member-post';
import { setActiveProfileMemberShip } from 'store/reducer/profileVisitor';
import styled from 'styled-components';
import Subscribecomp from './components/Subscribecomp';
import Posts from './mainContent/Posts';
import UnsubscribePosts from './mainContent/UnsubscribePosts';
const TabPane = Tabs.TabPane;
const RqLoader = styled(RequestLoader)`
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
const UnsubscribePostsWrapper = () => {
  const [isInitialLoading, setIsInitialLoading] = useState<any>(null);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => selectWallPosts(state));
  const seller = useAppSelector(
    (state) => state.profileVisitor.selectedProfile,
  );

  const [isModelOpen, setIsModelOpen] = useState(false);

  const { handlePaginationPosts } = useWallHook({
    sellerId: seller?._id || '',
    buyerId: user?._id || '',
    isBuyer: true,
    isBuyerView: true,
  });
  useEffect(() => {
    dispatch(resetpostschatmedia({}));
    if (!!seller?._id) {
      setIsInitialLoading(true);
      handlePaginationPosts({
        skip: 0,
        tokenId: 'post_token',
        callback: () => {
          setIsInitialLoading(false);
          //   setFilters({ ...filters, skip: 1 });
        },
      })
        .then((e: any) => {
          if (!e?.success && e?.cancelled) {
            setIsInitialLoading(true);
            return;
          }
          setIsInitialLoading(false);
        })
        .catch((e) => {
          setIsInitialLoading(false);
          console.log({ e: e });
        });
    }
  }, [seller?._id]);

  const onSubscribe = async () => {
    if (!user.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return true;
    }
    setIsModelOpen(true);
    return true;
  };
  return (
    <React.Fragment>
      {isInitialLoading ? (
        <RqLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      ) : (
        <React.Fragment>
          {(items || []).map((item: IPost) => {
            return (
              <UnsubscribePosts
                key={item?._id}
                postItem={item}
                subSeller={seller}
                onSubscribe={onSubscribe}
              />
            );
          })}
        </React.Fragment>
      )}

      {isModelOpen ? (
        <Subscribecomp
          onSubmitCallback={() => {
            setIsModelOpen(false);
            dispatch(setActiveProfileMemberShip(undefined));
          }}
          onClose={() => {
            setIsModelOpen(false);
          }}
        />
      ) : null}
    </React.Fragment>
  );
};
const ProfileMediaTabs = ({
  className,
  onChangeTab,
}: {
  className?: string;
  onChangeTab?: (tabs: string) => void;
}): ReactElement => {
  const { user } = useAuth();
  const activeMemberShip = useAppSelector(
    (state) => state.profileVisitor.activeMemberShip,
  );
  const dispatch = useAppDispatch();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const seller = useAppSelector(
    (state) => state.profileVisitor.selectedProfile?._id,
  );
  const isSubsExit = useAppSelector(
    (state) => state.profileVisitor.subscription,
  );
  const onSubscribe = async () => {
    if (!user.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return true;
    }
    setIsModelOpen(true);
    return true;
  };
  const postWrapper = useMemo(() => {
    return (
      <React.Fragment>
        {isSubsExit?._id ? <Posts /> : <UnsubscribePostsWrapper />}
      </React.Fragment>
    );
  }, [isSubsExit?._id]);
  const issubExit = !!isSubsExit?._id;

  return (
    <div className={`${className} left-block`}>
      {issubExit ? (
        <Tabs
          destroyInactiveTabPane={true}
          className={`profile-tabs`}
          onChange={(tab) => onChangeTab?.(tab)}
          defaultActiveKey={'1'}
          type="card"
        >
          <TabPane
            tab={
              <span
                id="sp_test_user_info"
                className="d-flex justify-content-center align-items-center"
              >
                <RequestIcon />
                <span className="text">Posts</span>
              </span>
            }
            key="1"
          >
            {postWrapper}
          </TabPane>
          <TabPane
            tab={
              <span
                id="sp_test_user_info"
                className="d-flex justify-content-center align-items-center"
              >
                <UnlockOrdersIcon />
                <span className="text">Media</span>
              </span>
            }
            key="2"
          >
            {isSubsExit?._id ? (
              <MediaGallery
                userId={(seller as string) || ''}
                isScrollable={false}
              />
            ) : (
              <Button
                size="large"
                type="primary"
                shape="circle"
                block
                onClick={() => {
                  onSubscribe();
                }}
              >
                {`Subscribe for ${
                  !!activeMemberShip?.price
                    ? `$${activeMemberShip?.price}`
                    : 'free'
                }`}
              </Button>
            )}
          </TabPane>
        </Tabs>
      ) : (
        <div className="posts_without_subs rc-tabs-card">{postWrapper}</div>
      )}
      {isModelOpen ? (
        <Subscribecomp
          onSubmitCallback={() => {
            setIsModelOpen(false);
            dispatch(setActiveProfileMemberShip(undefined));
          }}
          onClose={() => {
            setIsModelOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
export default styled(ProfileMediaTabs)`
  .rc-tabs-card {
    padding: 0 32px;

    @media (max-width: 767px) {
      padding: 0 15px;
    }

    .rc-tabs-content-holder {
      background: transparent;
    }
    .rc-tabs-nav-wrap {
      margin: 0 0 26px;

      .rc-tabs-nav-list {
        margin: 0;
      }
    }
    .rc-tabs-tab {
      flex-grow: 1;
      background: none;
      border: none;
      margin: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      justify-content: center;
      color: #666666;
      &::after {
        background: #666666;
        visibility: visible;
        opacity: 1;
      }
      :nth-child(2) {
        svg {
          path {
            fill: none;
          }
        }
      }
    }
    .rc-tabs-nav {
      &::after {
        visibility: hidden;
      }
    }

    .rc-tabs-tab-active {
      border-bottom: 1px solid var(--pallete-primary-main) !important;
      background: none !important;
      border: none;
      color: var(--pallete-primary-main);

      .sp_dark & {
        color: var(--pallete-text-main);
      }
      &::after {
        background: var(--pallete-primary-main);
      }
    }
  }
`;
