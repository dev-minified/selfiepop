import {
  CommentsIcon,
  LikeHeart,
  ProfleTickIcon,
  SolidHeart,
} from 'assets/svgs';
import attrAccept from 'attr-accept';
import ImageModifications from 'components/ImageModifications';
import CardAddComments from 'components/PrivatePageComponents/CardAddComments';
import CardListComments from 'components/PrivatePageComponents/CardListComments';
import PostBannerImages from 'components/PrivatePageComponents/PostBannerImages';
import PostBuySection from 'components/PrivatePageComponents/PostBuySection';
import PrivatePost from 'components/PrivatePageComponents/PrivatePost';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import classNames from 'classnames';
import { PostTierTypes } from 'enums';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useOnClickOutside } from 'hooks/useClickOutside';
import useUpgradePermission from 'hooks/useUpgradePermission';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { createPortal } from 'react-dom';
import { selectPostLiekesById, updatelikes } from 'store/reducer/member-post';
import styled, { css } from 'styled-components';
type IPostType = {
  managedAccountId?: string;
  managedUser?: any;
  user?: IUser;
  className?: string;
  showRightView?: boolean;
  allowActions?: boolean;
  onTogglePostLike?: (...args: any[]) => Promise<any>;
  onPostUserNameClick?: (...args: any[]) => void | Promise<any>;
  onCommentspagination?: (...args: any[]) => Promise<any>;
  onAddComemnt?: (...args: any[]) => Promise<any>;
  onToggleCommentLike?: (id: string, postId?: string) => Promise<any>;
  onAddReplyToComment?: (...args: any[]) => Promise<any>;
  onPostCommentRepliesPagination?: (...args: any[]) => Promise<any>;
  onToggleCommentReplyLike?: (...args: any[]) => Promise<any>;
  onDeleteItem?: (item: IPost) => void | Promise<any>;
  onEditItem?: (item: IPost) => void | Promise<any>;
  onPinItem?: (item: IPost) => void | Promise<any>;
  onPostBuy?: (
    item: IPost,
    isUpgrade: boolean,
    reCalcHeight?: () => void,
  ) => Promise<any> | void;
  onTip?: (id: string) => void;
  postItem: IPost;
  isSeller?: boolean;
  reCalcHeight?: () => void;
  subSeller?: IPostUser;
  subBuyer?: IUser;
  index?: number;
};
type IPostComments = {
  children: any;
};
const PortalComments = (props: IPostComments) => {
  return createPortal(props.children, document.body);
};
const CommentsWrapper = styled.div`
  .comment-section {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: var(--pallete-background-default);
    height: 70%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .comments-wrap {
      max-height: calc(100% - 75px);
      overflow-y: auto;
      overflow-x: hidden;
    }

    .comments-list {
      padding: 15px;
      /* height: calc(100% - 75px);
      overflow: auto; */
    }

    .comments-box {
      margin: 0;
      padding: 15px 15px 0;
      border-top-width: 4px;
    }

    .tip-row {
      margin: 0;
    }
  }
`;
const Tipswrapper = styled.div`
  border-radius: 20px;
  background: rgba(229, 16, 117, 1);
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pallete-common-white);
  padding: 8px 18px;
  margin: 0 18px 0 0;
`;
const TotalTips = ({ totalTips }: { totalTips?: number }) => {
  return totalTips && totalTips > 0 ? (
    <Tipswrapper>You tipped: ${totalTips}</Tipswrapper>
  ) : null;
};
const Post = forwardRef((props: IPostType, ref) => {
  const {
    managedUser,
    onTogglePostLike,
    onCommentspagination,
    onAddComemnt,
    onAddReplyToComment,
    onPostCommentRepliesPagination,
    onToggleCommentReplyLike,
    onToggleCommentLike,
    postItem,
    reCalcHeight,
    onTip,
    isSeller = true,
    subSeller,
    subBuyer,
    onPostBuy,
  } = props;
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState<boolean>(false);
  const [shouldDisablePointerEvents, setShouldDisablePointerEvents] =
    useState(false);

  const [disableclick, setDisableclick] = useState<boolean>(false);
  const commentRef = useRef(null);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const sellerUser = subSeller
    ? subSeller || {}
    : (managedUser && managedUser) || {};
  const user = subBuyer ? subBuyer : sellerUser;
  const isUserVerified =
    sellerUser?.isEmailVerified && sellerUser?.idIsVerified;
  const item: any = { ...postItem };
  const postLikes = useAppSelector((state) =>
    selectPostLiekesById(state, item?._id),
  );
  const totalCount = postLikes?.totalCount || 0;
  const {
    personAccessType,
    isFreeSubExist,
    isUpgrade,
    ispostText,
    isMedia,
    isPaid,
  } = useUpgradePermission(item, isSeller);
  // const allowFooter = isSeller || (!isUpgrade && !isPaid);
  const checksForImages = isMedia && !isUpgrade && !isPaid;
  const isNotSeller =
    isSeller || !(personAccessType === PostTierTypes.hidden && !isFreeSubExist);
  const ismoremedia = item?.media && item?.media?.length;
  let thumbMaxheight = 1000;
  let thumbMinheight = 300;
  let thumbheight = 400;
  // let containerHeight = 650;
  /**
   *
   *  formula
   *  adjusted width/adjusted height = original width /original height
   */
  if (ismoremedia) {
    // const ismorethantwomedia = ismoremedia > 1;

    const ImageHeight = item?.media?.[0]?.height;
    const ImageWidth = item?.media?.[0]?.width;
    const isImage = attrAccept({ type: item?.media?.[0].type }, 'image/*');
    if (!!ImageHeight && !!ImageWidth && isImage) {
      thumbheight = 630 * (ImageHeight / ImageWidth);

      thumbheight = thumbheight < 200 ? 200 : thumbheight;
    }

    if (thumbheight > thumbMaxheight) {
      thumbheight = thumbMaxheight;
    }

    if (!isDesktop) {
      thumbheight = 250;
      thumbMaxheight = 250;

      thumbMinheight = 250;
    }
  }
  const commentSectionVariants = {
    open: {
      y: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    closed: {
      y: '100%',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };
  useEffect(() => {
    const index = postLikes?.items?.findIndex(
      (p: any) => (p.userId as IPostUser)?._id === user?._id,
    );
    setLiked(index > -1);
  }, [postLikes]);
  useOnClickOutside(commentRef, () => {
    setIsOpenComment(false);
  });
  const onHandleChangeLike = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (disableclick) {
      return;
    }
    setDisableclick(true);
    const tempLikes = { ...postLikes };
    const newPostlikes = {
      items: [...(postLikes?.items || [])],
      totalCount: postLikes?.totalCount || 0,
    };
    setLiked(!liked);
    if (liked) {
      const index = newPostlikes.items.findIndex(
        (p) => (p.userId as IPostUser)?._id === user?._id,
      );
      if (index > -1) {
        newPostlikes.items.splice(index, 1);
        newPostlikes.totalCount = newPostlikes.totalCount - 1;
      }
    } else {
      newPostlikes.totalCount = newPostlikes.totalCount + 1;
      if (newPostlikes?.items?.length >= 5) {
        newPostlikes.totalCount = newPostlikes.totalCount || 0;
        newPostlikes.items = newPostlikes?.items?.slice(0, -1);
      }

      const isOwner =
        typeof item?.userId === 'object'
          ? item?.userId._id === user?._id
          : item?.userId === user?._id;
      newPostlikes.items.unshift({
        createdAt: dayjs().utc().format(),
        postId: item?._id,
        updatedAt: dayjs().utc().format(),
        userId: {
          firstName: user?.username,
          lastName: user?.lastName,
          profileImage: user?.profileImage,
          username: user?.username,
          _id: user?._id,
          pageTitle: user?.pageTitle,
        },
        postOwner: isOwner,
        _id: uuid(),
      });
    }
    onTogglePostLike?.(item?._id, !liked, newPostlikes)
      .then(() => {
        setDisableclick(false);
      })
      .catch(() => {
        dispatch(
          updatelikes({
            postLikes: tempLikes,
            postId: item?._id,
          }),
        );
        setDisableclick(false);
        setLiked(!liked);
      });
  };
  let timeoutId: NodeJS.Timeout | undefined;
  useEffect(() => {
    if (!isOpenComment) {
      // Set a timeout of 2 seconds
      timeoutId = setTimeout(() => {
        setShouldDisablePointerEvents(false);
      }, 100);
    } else {
      // Cancel the timeout if isOpenComment is false before 2 seconds have passed
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setShouldDisablePointerEvents(true);
    }

    // Clean up the timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpenComment]);
  return !isNotSeller ? null : (
    <div className="pb-20 media-wrapper">
      {(ispostText || isMedia) && (
        <>
          {!isSeller ? (
            <>
              {checksForImages ? (
                <PostWrapper
                  className="post-banner-parent"
                  thumbheight={thumbheight}
                  thumbMaxheight={thumbMaxheight}
                  thumbMinheight={thumbMinheight}
                  // containerHeight={containerHeight}
                >
                  <PostBannerImages
                    className={classNames('post-bannerimages', {
                      'pointer-events-none': shouldDisablePointerEvents,
                    })}
                    key={item._id}
                    media={item.media}
                    // onImageLoad={calulateHeight}
                  />
                </PostWrapper>
              ) : isMedia ? (
                <BuySections
                  item={item}
                  isPaid={isPaid}
                  user={sellerUser}
                  onPostBuy={() => {
                    onPostBuy?.(item, isUpgrade, reCalcHeight);
                  }}
                />
              ) : (
                <div className="place-holder-media-text">
                  This post has no Media
                </div>
              )}
            </>
          ) : isMedia ? (
            <PostWrapper
              className="post-banner-parent"
              thumbheight={thumbheight}
              thumbMaxheight={thumbMaxheight}
              thumbMinheight={thumbMinheight}
              // containerHeight={containerHeight}
            >
              <PostBannerImages
                // onImageLoad={calulateHeight}
                className={classNames('post-bannerimages', {
                  'pointer-events-none': shouldDisablePointerEvents,
                })}
                key={item._id}
                media={item.media?.map((med: any) => ({
                  ...med,
                  imageURL: `${med?.imageURL}?${
                    med?.updatedAt ?? postItem?.updatedAt
                  }`,
                  url: `${med?.url}?${med?.updatedAt ?? postItem?.updatedAt}`,
                  path: `${med?.path}?${med?.updatedAt ?? postItem?.updatedAt}`,
                }))}
              />
            </PostWrapper>
          ) : null}
        </>
      )}
      {isOpenComment ? (
        <PortalComments>
          <CommentsWrapper>
            <motion.div
              ref={commentRef}
              className="comment-section"
              variants={commentSectionVariants}
              initial="closed"
              animate={isOpenComment ? 'open' : 'closed'}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
            >
              <div className="comments-wrap">
                <CardListComments
                  className="comments-list"
                  toggleCommentLike={onToggleCommentLike}
                  getPostComments={onCommentspagination}
                  item={item}
                  managedUser={managedUser}
                  user={subBuyer ? subBuyer : sellerUser}
                  onAddReplyToComment={onAddReplyToComment}
                  onPostCommentRepliesPagination={
                    onPostCommentRepliesPagination
                  }
                  onToggleCommentReplyLike={onToggleCommentReplyLike}
                />
              </div>
              <CardAddComments
                className="comments-box"
                id={item?._id}
                onSubmit={onAddComemnt}
                user={user}
              />
            </motion.div>
          </CommentsWrapper>
        </PortalComments>
      ) : null}
      {!isUpgrade && !isPaid && (
        <div className="actions-list">
          <div
            onClick={() => {
              onTip?.(item?._id);
            }}
            className="action-item"
          >
            {/* <AvatarName text={`$${item?.totalTips || ''}`} slice={false} /> */}
            <span className="total-tip-amount">${item?.totalTips || ''}</span>
            <span className="counter">Tip</span>
          </div>
          <div onClick={onHandleChangeLike} className="action-item">
            {liked ? <SolidHeart fill="red" /> : <LikeHeart />}
            {!!totalCount && <span className="counter">{totalCount || 0}</span>}
          </div>
          <div
            onClick={() => {
              setIsOpenComment(!isOpenComment);
            }}
            className="action-item"
          >
            <CommentsIcon />
            <span className="counter">comments</span>
          </div>
        </div>
      )}

      <div className="post-detail-area">
        <div className="user-details">
          <div className="profile-image">
            <ImageModifications
              src={sellerUser?.profileImage}
              alt="img description"
              fallbackUrl={'/assets/images/default-profile-img.svg'}
            />
          </div>
          <div className="text-description">
            <span className="user-name">
              {sellerUser?.pageTitle ?? 'Incognito User'}
              {isUserVerified && (
                <ProfleTickIcon width="12" height="12" fill="#fff" />
              )}
            </span>
            <span className="profile-name">@{sellerUser?.username}</span>
          </div>
        </div>
        <p>{item.postText}</p>
      </div>
    </div>
  );
});
const PostWrapper = styled.div<{
  thumbMaxheight: number;
  thumbMinheight: number;
  thumbheight: number;
  // containerHeight: number;
}>`
  ${({ thumbMaxheight, thumbMinheight, thumbheight }) => {
    return css`
      .thumbnail-img {
        overflow: hidden;
        img {
          min-height: ${thumbMinheight}px;
          max-height: ${thumbMaxheight}px;
          height: ${thumbheight}px;
          object-fit: cover;
          width: 100%;
        }
      }
    `;
  }}
  .post-bannerimages {
    .gallery-item {
      &:not(:first-child) {
        padding-top: 0;
        height: 145px;

        .video_thumbnail {
          height: 100%;
        }

        .audio_thumbnail {
          height: 100%;
        }
      }
    }

    .video_thumbnail {
      height: 400px;
    }

    .audio_thumbnail {
      height: 400px;
    }
  }

  .pointer-events-none {
    pointer-events: none;
  }
`;
const BuySections = ({
  isPaid,
  item,
  user,
  onPostBuy,
}: {
  isPaid: boolean;
  user?: any;
  item: IPost;
  onPostBuy?: () => Promise<any> | void;
}) => {
  const unlockingPost = useAppSelector((state) => state.mysales.unlockPostId);
  const isUpgradingMembership = useAppSelector(
    (state) => state.mysales.upgradePostId,
  );
  return (
    <>
      <div className="card-private-area">
        <PrivatePost
          className="private-post-card"
          title={
            isPaid
              ? 'Unlock to access this content'
              : 'Upgrade to access this content'
          }
          subTitle={isPaid ? 'Pay to access this content' : ''}
        />
        <PostBuySection
          modalHandler={onPostBuy}
          isloading={
            unlockingPost === item._id || item._id === isUpgradingMembership
          }
          media={item.media}
          buttonTitle={
            isPaid
              ? `Unlock for $${Number(item.membership?.viewPrice || 0).toFixed(
                  2,
                )}`
              : `Upgrade to see ${
                  user ? `${user?.pageTitle ?? 'Incognito User'}'s` : ''
                } Posts`
          }
        />
      </div>
    </>
  );
};

export default styled(Post)``;
