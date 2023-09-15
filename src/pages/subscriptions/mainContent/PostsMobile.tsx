import EmptydataMessage from 'components/EmtpyMessageData';
import Scrollbar from 'components/Scrollbar';
import VirtualItem from 'components/VirtualItem';
import { toast } from 'components/toaster';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import useWallHook from 'hooks/useWallHook';
import Post from 'pages/Sales/Post';
import SendTipModal from 'pages/subscriptions/components/Model/TipModel';
import UnlockModal from 'pages/subscriptions/components/Model/UnlockModel';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  onCardModalOpen,
  setCallbackForPayment,
} from 'store/reducer/cardModal';
import {
  resetpostschatmedia,
  selectPostLength,
  selectWallPosts,
  setPostsaWithPin,
  setUpdateUserPinPost,
  unlockPost,
} from 'store/reducer/member-post';
import {
  paymentForMembership,
  setUlockPostId,
  setUpgradePostId,
} from 'store/reducer/salesState';

import { getUserPinPost } from 'api/sales';
import { ExtraOrderTypes, USERCHARGEBACKMESSAGE } from 'appconstants';
import { RequestLoader } from 'components/SiteLoader';
import TiktokPlayer from 'components/TiktokPlayer';
import { PostTierTypes } from 'enums';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { parseQuery } from 'util/index';
import MemberShipUpgradeModels from '../components/Model/MemberShipUpgradeModels';
import PostMobile from './PostMobile';

const RqLoader = styled(RequestLoader)`
  margin-top: 1rem;

  &.bottom-loader {
    margin: 0;
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 0;
    background: rgba(255, 255, 255, 0.4);
    padding: 10px 0;

    .sp_dark & {
      background: rgba(0, 0, 0, 0.4);
    }
  }
`;

interface Props {
  scrollbarRef?: any;
  handleScroll?: (...args: any) => void;
  onPostUserNameClick?: (item: IPost) => void;
  AllUsers?: boolean;
  className?: string;
}

// const paidMemberships = ['pay_to_view', 'upgrade_to_view'];
const ESTIMATED_ITEM_HEIGHT = 500;
function Posts(props: Props): ReactElement {
  const { className, AllUsers, onPostUserNameClick } = props;
  const location = useLocation();
  const { userId } = parseQuery(location.search);
  // const { user: loggedUser } = useAuth();
  const selectedSub = useAppSelector(
    (state) => state.mysales.selectedSubscription,
  );
  // const selectedUser = useAppSelector((state) => state.mysales.selectedUser);
  const isMyPostsFetching = useAppSelector(
    (state) => state.memberPost.isMyPostsFetching,
  );

  const userCards = useAppSelector((state) => state.global.userCards);
  const postLength = useAppSelector((state) => selectPostLength(state));
  const { items } = useAppSelector((state) => selectWallPosts(state));

  const [open2, onOpen2, onToggle2] = useOpenClose();
  const [selectedItemforModel, setSelectedItemforModel] = useState<any>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [updgradedOpen, setUpdragedOpen] = useState(false);
  const { user } = useAuth();
  const reCalcRef = useRef<any>({});
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    skip: 0,
  });
  const [payTipPost, setPayTipPost] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<any>(null);
  const analytics = useAnalytics();
  const viewPortRef = useRef<any>(null);
  // const scrollbarRef = useRef<any>(null);
  const pinPosts = useAppSelector((state) => state.memberPost?.pinPosts);
  const {
    handlePaginationPosts,
    onTogglePostLike,
    onCommentspagination,
    onAddComemnt: onHandleAddComemnt,
    onAddReplyToComment,
    onPostCommentRepliesPagination,
    onToggleCommentReplyLike,
    onToggleCommentLike,
    onAddTipComemnt,
  } = useWallHook({
    sellerId: selectedSub?.sellerId?._id || '',
    buyerId: selectedSub?.buyerId?._id || '',
    isBuyer: true,
    fatchAllUsers: AllUsers,
    isBuyerView: true,
  });

  useEffect(() => {
    let isMounted = true;
    dispatch(resetpostschatmedia({}));
    if (!!userId) {
      setIsInitialLoading(true);
      handlePaginationPosts({
        skip: 0,
        tokenId: 'post_token',
        callback: () => {
          setIsInitialLoading(false);
          setFilters({ ...filters, skip: 1 });
        },
      })
        .then((e: any) => {
          if (!e?.success && e?.cancelled) {
            setIsInitialLoading(true);
            return;
          }

          getUserPinPost(userId as string, {
            ignoreStatusCodes: [404, 421],
          })
            .then((resp) => {
              if (isMounted) {
                if (!!resp?.items?.length) {
                  const pinPosts = resp?.items.map((pin: any) => {
                    return { ...pin, pinPost: true, id: `sp__${pin._id}` };
                  });
                  dispatch(setPostsaWithPin({ pinPosts }));
                }
                dispatch(setUpdateUserPinPost(resp));
                setIsInitialLoading(false);
              } else setIsInitialLoading(false);
            })
            .catch((e) => {
              setIsInitialLoading(false);
              console.log({ e: e });
            });
        })
        .catch((e) => {
          setIsInitialLoading(false);
          console.log({ e: e });
        });
      // .finally(() => {
      //   setIsInitialLoading(false);
      // });
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  useEffect(() => {
    if (AllUsers) {
      setIsInitialLoading(true);
      handlePaginationPosts({
        skip: 0,
        tokenId: 'post_token',
        callback: () => {
          setIsInitialLoading(false);
          setFilters({ ...filters, skip: 1 });
        },
      })
        .then((data: any) => {
          if (!data?.success && data?.cancelled) {
            setIsInitialLoading(true);
            return;
          }
          setIsInitialLoading(false);
        })
        .catch(() => {
          setIsInitialLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddComemnt = useCallback(
    async (id: string, values: Record<string, any>) => {
      return await onHandleAddComemnt(id, values, () => {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId],
  );

  const handleCommentspagination = useCallback(
    onCommentspagination,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId],
  );
  const unlockSubmit = async (postId: any, price: number) => {
    setUnlockOpen(false);
    return await dispatch(unlockPost({ postId, dispatch }))
      .unwrap()
      .then((data: any) => {
        if (data?.type === 'sale/postUnlock/rejected') {
          throw new Error(data?.error?.message);
        } else {
          if (!AllUsers) {
            getUserPinPost(userId as string, {
              ignoreStatusCodes: [404, 421],
            }).then((resp) => {
              dispatch(setUpdateUserPinPost(resp));
            });
          }
          analytics.track('post_unlock', {
            purchasedFrom: selectedSub?.sellerId?._id,
            buyerId: user?._id,
            purchaseTypeSlug: ExtraOrderTypes.post_unlock,
            purchaseAmount: price,
            itemId: postId,
          });
        }
      })
      .catch((e) => {
        if (e && e?.message) {
          toast.error(e.message);
        } else {
          toast.error('Something went wrong please try again!');
        }
      });
  };

  const membershipPayment = async (postId: string, membershipId: string) => {
    dispatch(paymentForMembership({ postId, membershipId, dispatch }))
      .unwrap()
      .then(() => {
        analytics.track('subscription_renew', {
          purchasedFrom: userId,
          memberLevelId: membershipId,
        });
        dispatch(setUpgradePostId(postId));
        dispatch(resetpostschatmedia({}));
        handlePaginationPosts({
          skip: 0,
          callback: () => {
            setFilters({ ...filters, skip: 1 });
          },
        })
          .catch((e) => {
            console.log({ e });
          })
          .finally(() => {
            dispatch(setUpgradePostId(''));
          });
      })
      .catch((e) => {
        if (e && e?.message) {
          toast.error(e.message);
        } else {
          toast.error('Something went wrong please try again!');
        }
      });
  };

  const handleModelselection = (item: any, ispaytoview: boolean) => {
    setSelectedItemforModel(item);
    if (!ispaytoview) {
      setUnlockOpen(true);
      return;
    }
    setUpdragedOpen(true);
  };
  if (isInitialLoading) {
    return (
      <RqLoader
        isLoading={true}
        width="28px"
        height="28px"
        color="var(--pallete-primary-main)"
      />
    );
  }

  const onPostBuy = async (
    item: IPost,
    isUpgrade: boolean,
    reCalcHeight?: () => void,
  ) => {
    if (!user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return;
    }
    if (!userCards?.length) {
      dispatch(onCardModalOpen());
      return;
    }
    handleModelselection(item, isUpgrade);
    reCalcRef.current = {
      ...reCalcRef.current,
      [item?._id as string]: () => {
        reCalcHeight?.();
      },
    };
  };
  const onTipHandler = (id: string) => {
    if (!user?.allowPurchases) {
      toast.error(USERCHARGEBACKMESSAGE);
      return;
    }
    if (!userCards?.length) {
      dispatch(onCardModalOpen());
      return;
    }
    onOpen2();
    setPayTipPost(id);
  };
  const LoadMore = async (e: any) => {
    if (items?.length < postLength) {
      const { scrollTop, scrollHeight, clientHeight } = e.target as any;
      const pad = 100; // 100px of the bottom

      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !isMyPostsFetching) {
        const pinArray = Object.keys(pinPosts || {});
        await handlePaginationPosts?.({
          skip: items?.length - pinArray.length || 0,
        }).catch((e) => console.log(e));
      }
    }
  };
  const swipePaginated = async () => {
    if (items?.length < postLength) {
      if (!isMyPostsFetching) {
        const pinArray = Object.keys(pinPosts || {});
        await handlePaginationPosts?.({
          skip: items?.length - pinArray.length || 0,
        }).catch((e) => console.log(e));
      }
    }
  };
  const scrollElement = document.querySelector('#subcription-scroller')
    ?.firstChild as HTMLElement;
  const SellerName = AllUsers
    ? selectedItemforModel?.userId?.pageTitle
    : selectedSub?.sellerId?.pageTitle;
  return (
    <div className={`${className}  mt-20`}>
      <MemberShipUpgradeModels
        item={selectedItemforModel}
        isOpen={updgradedOpen}
        onClose={() => setUpdragedOpen(false)}
        isAllusersWall={AllUsers}
        cbSubmit={(postId, membershipId) => {
          const isSellerDeActived = AllUsers
            ? selectedItemforModel?.userId?.isDeactivate
            : selectedSub?.sellerId?.isDeactivate;
          if (isSellerDeActived) {
            toast.error(`You can't updgrade your subscription for now`);
            return;
          }

          dispatch(setUpgradePostId(postId));
          dispatch(
            setCallbackForPayment({
              callback: async () => {
                dispatch(setUpgradePostId(postId));

                return membershipPayment(postId, membershipId).catch(() => {
                  dispatch(setUpgradePostId(''));
                });
              },
            }),
          );
          membershipPayment(postId, membershipId).catch(() => {
            dispatch(setUpgradePostId(''));
          });
        }}
        user={
          AllUsers ? { sellerId: selectedItemforModel?.userId } : selectedSub
        }
      />
      <UnlockModal
        items={selectedItemforModel}
        submitHandler={(id: string, price: number) => {
          dispatch(setUlockPostId(id));
          dispatch(
            setCallbackForPayment({
              callback: () =>
                unlockSubmit(id, price)
                  .catch((e) => toast.error(e?.message))
                  .finally(() => {
                    dispatch(setUlockPostId(''));
                    reCalcRef?.current?.[id]?.();
                  }),
            }),
          );
          unlockSubmit(id, price).finally(() => {
            dispatch(setUlockPostId(''));
            reCalcRef?.current?.[id]?.();
          });
        }}
        title="UNLOCK POST"
        message={`Are you sure you want to unlock this private post from ${
          SellerName ?? 'Incognito User'
        } ?`}
        onClose={() => setUnlockOpen(false)}
        isOpen={unlockOpen}
      />
      <SendTipModal
        title="SEND A TIP"
        onClose={onToggle2}
        isOpen={open2}
        submitHandler={(amount) => {
          dispatch(
            setCallbackForPayment({
              callback: () => onAddTipComemnt(payTipPost, amount),
            }),
          );
          onAddTipComemnt(payTipPost, amount, onToggle2, setPayTipPost);
        }}
      />
      {!isMobileOnly ? (
        <div className="posts-wrap" ref={viewPortRef}>
          <Scrollbar onScroll={LoadMore} id="subcription-scroller">
            <div className="list-container">
              {!!items?.length ? (
                items?.map((item: IPost) => {
                  const isFreeSubExist = !!item?.membershipAccessType?.find(
                    (m) => m.accessType === PostTierTypes.free_to_view,
                  );
                  const isNotSeller = !(
                    item?.membership?.accessType === PostTierTypes.hidden &&
                    !isFreeSubExist
                  );

                  return (
                    isNotSeller && (
                      <VirtualItem
                        defaultHeight={ESTIMATED_ITEM_HEIGHT}
                        key={item.id}
                        root={scrollElement}
                        visibleOffset={10000}
                        id={item.id}
                      >
                        <Post
                          postItem={item}
                          subBuyer={user}
                          onPostUserNameClick={onPostUserNameClick}
                          // key={item._id}
                          key={item.id}
                          subSeller={
                            selectedSub?.sellerId || (item.userId as any)
                          }
                          showRightView={false}
                          isSeller={false}
                          onPostBuy={onPostBuy}
                          onTogglePostLike={onTogglePostLike}
                          onTip={onTipHandler}
                          onToggleCommentLike={onToggleCommentLike}
                          onCommentspagination={handleCommentspagination}
                          onAddReplyToComment={onAddReplyToComment}
                          onPostCommentRepliesPagination={
                            onPostCommentRepliesPagination
                          }
                          onToggleCommentReplyLike={onToggleCommentReplyLike}
                          onAddComemnt={handleAddComemnt}
                        />
                      </VirtualItem>
                    )
                  );
                })
              ) : (
                <EmptydataMessage text=" You don't have any Posts." />
              )}
            </div>
          </Scrollbar>
        </div>
      ) : (
        <div className="posts-wrap" ref={viewPortRef}>
          <TiktokPlayer swipePaginated={swipePaginated} items={items}>
            {(item) => {
              return (
                <PostMobile
                  postItem={item}
                  subBuyer={user}
                  onPostUserNameClick={onPostUserNameClick}
                  key={item.id}
                  subSeller={selectedSub?.sellerId || (item.userId as any)}
                  showRightView={false}
                  isSeller={false}
                  onPostBuy={onPostBuy}
                  onTogglePostLike={onTogglePostLike}
                  onTip={onTipHandler}
                  onToggleCommentLike={onToggleCommentLike}
                  onCommentspagination={handleCommentspagination}
                  onAddReplyToComment={onAddReplyToComment}
                  onPostCommentRepliesPagination={
                    onPostCommentRepliesPagination
                  }
                  onToggleCommentReplyLike={onToggleCommentReplyLike}
                  onAddComemnt={handleAddComemnt}
                />
              );
            }}
          </TiktokPlayer>
        </div>
      )}

      {isMyPostsFetching && (
        <RqLoader
          className={`${!items?.length ? '' : 'bottom-loader'}`}
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      )}
    </div>
  );
}

export default styled(Posts)`
  position: relative;
  .pop-card {
    margin-left: 20px;
    margin-right: 20px;
  }
  .card-private-area {
    overflow: hidden;
  }
  .card-header_name .title {
    cursor: pointer;
  }
`;
