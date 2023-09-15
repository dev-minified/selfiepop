import { Card } from 'components/PrivatePageComponents';
import CardAddComments from 'components/PrivatePageComponents/CardAddComments';
import CardListComments from 'components/PrivatePageComponents/CardListComments';
import CardPublicFooter from 'components/PrivatePageComponents/CardPublicFooter';
import PostBannerImages from 'components/PrivatePageComponents/PostBannerImages';
import PostBuySection from 'components/PrivatePageComponents/PostBuySection';
import PostCaption from 'components/PrivatePageComponents/PostCaption';
import PrivatePost from 'components/PrivatePageComponents/PrivatePost';
import TipsBar from 'components/PrivatePageComponents/TipsBar';
import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import React, { forwardRef, ReactElement, useCallback, useState } from 'react';

import { USERCHARGEBACKMESSAGE } from 'appconstants';
import { ProfleTickIcon } from 'assets/svgs';
import { toast } from 'components/toaster';
import { PostTierTypes } from 'enums';
import { useAppSelector } from 'hooks/useAppSelector';
import useDropDown from 'hooks/useDropDown';
import useUpgradePermission from 'hooks/useUpgradePermission';
import { onCardModalOpen } from 'store/reducer/cardModal';
import {
  setSelectedScheduledPost,
  toggleEditPost,
} from 'store/reducer/member-post';
import styled from 'styled-components';
import Button from '../NButton';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const PinPost = forwardRef(
  (
    {
      className,
      showRightView = true,
      managedUser,
      allowActions = true,
      onConformToDelete,
      onChangeLike,

      handleAddComemnt,
      toggleLike,
      handleCommentspagination,
      handleModelselection,
      unlockData,
      selectedItemforModel,
      onOpen2,
      setPayTipPost,
      isSeller = false,
      onAddReplyToComment,
      onPostCommentRepliesPagination,
      onToggleCommentReplyLike,
      onUnPinPost,
      pinPost,
    }: {
      managedUser?: any;
      className?: string;
      onConformToDelete?: any;
      showRightView?: boolean;
      allowActions?: boolean;
      onChangeLike?: any;
      handleModelselection?: (item: any, ispaytoview: boolean) => any;
      commentOpen?: any;
      isSeller?: boolean;

      handleAddComemnt?: any;
      onOpen2?: any;
      setPayTipPost?: any;
      toggleLike?: any;
      handleCommentspagination?: any;
      isPaid?: boolean;
      isUpgrade?: boolean;
      unlockData?: boolean;
      selectedItemforModel?: any;
      onUnPinPost?: (postId: string) => void | Promise<any>;
      onAddReplyToComment?: (...args: any[]) => Promise<any>;
      onPostCommentRepliesPagination?: (...args: any[]) => Promise<any>;
      onToggleCommentReplyLike?: (...args: any[]) => Promise<any>;
      pinPost?: IPost;
    },
    ref,
  ): ReactElement => {
    const dispatch = useAppDispatch();
    const [commentOpen, setCommentOpen] = useState<string | undefined>(
      undefined,
    );
    const { user } = useAuth();
    const userCards = useAppSelector((state) => state.global.userCards);
    const userPinPostState = useAppSelector(
      (state) => state.memberPost.pinPosts,
    );
    const isPostUnlocking = useAppSelector(
      (state) => state.memberPost.isPostUnlocking,
    );
    const isUpgradingMemberShip = useAppSelector(
      (state) => state.mysales.isUpgradingMemberShip,
    );
    const current = dayjs();
    const isUserVerified =
      managedUser?.isEmailVerified && managedUser?.idIsVerified;
    const { setIsVisible, isVisible } = useDropDown(false, false);
    const setOpenedComemnt = useCallback(
      (id: string) => {
        if (commentOpen === id) {
          setCommentOpen(undefined);
        } else setCommentOpen(id);
      },
      [commentOpen],
    );
    const onAddComemnt = useCallback(
      async (id: string, values: Record<string, any>) => {
        return await handleAddComemnt?.(id, values, () => {
          setCommentOpen(undefined);
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [commentOpen],
    );
    const getComponent = () => {
      // const pinArray = Object.keys(userPinPostState || {});
      const PinItem = pinPost;
      let timestamp =
        PinItem?.postType === 'scheduled'
          ? dayjs(PinItem?.publishAt)
          : PinItem?.createdAt
          ? dayjs(PinItem?.createdAt)
          : '';
      if (timestamp) {
        timestamp = (timestamp as dayjs.Dayjs).isSame(current, 'date')
          ? (timestamp as dayjs.Dayjs).fromNow()
          : (timestamp as dayjs.Dayjs).format('MM/DD/YYYY hh:mm A');
      }
      const {
        personAccessType,
        isFreeSubExist,
        isUpgrade,
        ispostText,
        isMedia,
        isPaid,
      } = useUpgradePermission(PinItem);
      return (
        <React.Fragment>
          {personAccessType === PostTierTypes.hidden &&
          !isFreeSubExist ? null : (
            <Card cardClass="mb-20 post-card" ref={ref}>
              <Card.Header
                ontitleClick={() => {
                  window.open(`/${managedUser?.username}`, '_blank');
                }}
                imgscreenSettings={{
                  // defaultUrl: '/assets/images/default-profile-img.svg',

                  onlyMobile: true,
                  imgix: { all: 'w=200&h=200' },
                }}
                img={managedUser?.profileImage}
                fallbackUrl={'/assets/images/default-profile-img.svg'}
                title={
                  <span>
                    {managedUser?.pageTitle ?? 'Incognito User'}

                    {isUserVerified ? (
                      <ProfleTickIcon
                        width="12"
                        height="12"
                        fill="var(--pallete-primary-main)"
                      />
                    ) : null}
                  </span>
                }
                subTitle={timestamp}
                className="card-header_name"
                showRightView={showRightView}
                isPinPost={!!userPinPostState?.[PinItem?._id || '']}
                Rightside={() => {
                  return allowActions && isVisible ? (
                    <ul className="actions">
                      <li>
                        <Button
                          type="text"
                          onClick={() => {
                            onConformToDelete?.('delete', PinItem || {});
                            setIsVisible(false);
                          }}
                        >
                          Delete post
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="text"
                          onClick={() => {
                            dispatch(setSelectedScheduledPost(PinItem));
                            dispatch(toggleEditPost({ isOpen: true }));
                            setIsVisible(false);
                            // onConformToDelete('edit', item || {});
                          }}
                        >
                          Edit
                        </Button>
                      </li>
                      <li>
                        <Button
                          type="text"
                          onClick={() => {
                            onUnPinPost?.(PinItem?._id || '');

                            setIsVisible(false);
                          }}
                        >
                          UnPin Post
                        </Button>
                      </li>
                    </ul>
                  ) : null;
                }}
              />
              {(ispostText || isMedia) && (
                <Card.Body
                  caption={
                    ispostText ? (
                      <PostCaption postText={PinItem?.postText} />
                    ) : (
                      ''
                    )
                  }
                >
                  {isMedia && !isUpgrade && !isPaid ? (
                    <PostBannerImages
                      key={PinItem?._id}
                      media={PinItem?.media?.map((med: any) => ({
                        ...med,
                        imageURL: `${med?.imageURL}?${
                          med?.updatedAt ?? PinItem?.updatedAt
                        }`,
                        url: `${med?.url}?${
                          med?.updatedAt ?? PinItem?.updatedAt
                        }`,
                        path: `${med?.path}?${
                          med?.updatedAt ?? PinItem?.updatedAt
                        }`,
                      }))}
                    />
                  ) : (
                    isMedia && (
                      <>
                        <div className="card-private-area">
                          <PrivatePost
                            title={
                              isPaid
                                ? 'Unlock to access this content'
                                : 'Upgrade to access this content'
                            }
                            subTitle={
                              isPaid ? 'Pay to access this content' : ''
                            }
                          />
                          <PostBuySection
                            modalHandler={() => {
                              if (!user?.allowPurchases) {
                                toast.error(USERCHARGEBACKMESSAGE);
                                return;
                              }
                              if (!userCards?.length) {
                                dispatch(onCardModalOpen());
                                return;
                              }
                              handleModelselection?.(PinItem, isUpgrade);
                            }}
                            isloading={
                              (unlockData === PinItem?._id &&
                                isPostUnlocking) ||
                              (PinItem?._id === selectedItemforModel?._id &&
                                isUpgradingMemberShip)
                            }
                            media={PinItem?.media}
                            buttonTitle={
                              isPaid
                                ? `Unlock for $${Number(
                                    PinItem?.membership?.viewPrice || 0,
                                  ).toFixed(2)}`
                                : `Upgrade to see ${
                                    managedUser
                                      ? `${
                                          managedUser?.sellerId?.pageTitle ??
                                          'Incognito User'
                                        }'s`
                                      : ''
                                  } Posts`
                            }
                          />
                        </div>
                      </>
                    )
                  )}
                </Card.Body>
              )}
              {!isUpgrade && !isPaid && (
                <>
                  {' '}
                  <Card.Footer>
                    <CardPublicFooter
                      postUser={PinItem?.userId}
                      user={managedUser ?? user}
                      tipHandler={() => {
                        if (!user?.allowPurchases) {
                          toast.error(USERCHARGEBACKMESSAGE);
                          return;
                        }
                        if (!userCards?.length) {
                          dispatch(onCardModalOpen());
                          return;
                        }
                        onOpen2();
                        setPayTipPost(PinItem?._id);
                      }}
                      postliked={PinItem?.liked}
                      postLikes={PinItem?.postLikes}
                      onChangeLike={onChangeLike}
                      id={PinItem?._id}
                      post={PinItem}
                      setCommentOpen={setOpenedComemnt}
                      comments={PinItem?.comments}
                      isSeller={isSeller}
                    />
                    {isSeller ? null : <TipsBar postId={PinItem?._id} />}
                  </Card.Footer>
                  {commentOpen && commentOpen === PinItem?._id && (
                    <CardAddComments
                      id={PinItem._id}
                      onSubmit={onAddComemnt}
                      user={managedUser ?? user}
                    />
                  )}
                  {/* {!!PinItem?.comments?.totalCount && ( */}
                  <CardListComments
                    toggleCommentLike={toggleLike}
                    getPostComments={handleCommentspagination}
                    item={PinItem}
                    managedUser={managedUser}
                    user={managedUser ?? user}
                    postComment={commentOpen}
                    setOpenedComemnt={setOpenedComemnt}
                    onAddReplyToComment={onAddReplyToComment}
                    onPostCommentRepliesPagination={
                      onPostCommentRepliesPagination
                    }
                    onToggleCommentReplyLike={onToggleCommentReplyLike}
                  />
                  {/* )} */}
                </>
              )}
            </Card>
          )}
        </React.Fragment>
      );
    };
    return <div className={`${className} mt-20`}>{getComponent()}</div>;
  },
);

export default styled(PinPost)``;
