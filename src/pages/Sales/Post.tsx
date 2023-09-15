import { AvatarName, ProfleTickIcon } from 'assets/svgs';
import attrAccept from 'attr-accept';
import Button from 'components/NButton';
import { Card } from 'components/PrivatePageComponents';
import CardListComments from 'components/PrivatePageComponents/CardListComments';
import CardPublicFooter from 'components/PrivatePageComponents/CardPublicFooter';
import PostBannerImages from 'components/PrivatePageComponents/PostBannerImages';
import PostBuySection from 'components/PrivatePageComponents/PostBuySection';
import PostCaption from 'components/PrivatePageComponents/PostCaption';
import PrivatePost from 'components/PrivatePageComponents/PrivatePost';
import { PostTierTypes } from 'enums';
import { useAppSelector } from 'hooks/useAppSelector';
import useUpgradePermission from 'hooks/useUpgradePermission';
import { forwardRef } from 'react';
import { isDesktop } from 'react-device-detect';
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
const Post = forwardRef((props: IPostType, ref) => {
  const {
    className,
    showRightView = true,
    managedUser,
    allowActions = true,

    onTogglePostLike,

    onCommentspagination,
    onAddComemnt,
    user,

    onAddReplyToComment,
    onPostCommentRepliesPagination,
    onToggleCommentReplyLike,
    onToggleCommentLike,
    postItem,
    reCalcHeight,
    onTip,
    onDeleteItem,
    onEditItem,
    onPinItem,
    isSeller = true,
    subSeller,
    subBuyer,
    onPostBuy,
    onPostUserNameClick,
  } = props;
  //   const pinArray = Object.keys(pinKey || {});

  const sellerUser = subSeller
    ? subSeller || {}
    : managedUser
    ? managedUser || {}
    : user || {};
  const isUserVerified =
    sellerUser?.isEmailVerified && sellerUser?.idIsVerified;
  const item: any = { ...postItem };
  const {
    personAccessType,
    isFreeSubExist,
    isUpgrade,
    ispostText,
    isMedia,
    isPaid,
    timestamp,
  } = useUpgradePermission(item, isSeller);
  const allowFooter = isSeller || (!isUpgrade && !isPaid);
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
  const subTitle = isSeller ? (
    <span className="time_stamp">{timestamp}</span>
  ) : (
    <span>@{sellerUser.username}</span>
  );
  return !isNotSeller ? null : (
    <div className="pb-20">
      <Card cardClass={`post-card ${className}`} ref={ref}>
        <Card.Header
          ontitleClick={() => {
            if (onPostUserNameClick) {
              onPostUserNameClick?.(item);
            } else {
              window.open(
                `/profile/${sellerUser?.username}`,

                '_blank',
              );
            }
          }}
          img={sellerUser?.profileImage || ' '}
          // fallbackUrl={'/assets/images/default-profile-img.svg'}
          fallbackComponent={<AvatarName text={sellerUser?.pageTitle} />}
          title={
            <span>
              {sellerUser?.pageTitle ?? 'Incognito User'}
              {isUserVerified ? (
                <ProfleTickIcon
                  width="12"
                  height="12"
                  fill="var(--pallete-primary-main)"
                />
              ) : null}
            </span>
          }
          subTitle={subTitle}
          timeStamp={
            !isSeller ? <span className="time_stamp">{timestamp}</span> : null
          }
          showRightView={showRightView}
          className="card-header_name"
          isPinPost={!!(item as any)?.pinPost}
          Rightside={(props: any) => {
            return (
              <ActionsDropDown
                item={item}
                setIsVisible={props.setIsVisible}
                allowActions={allowActions}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
                onPinItem={onPinItem}
              />
            );
          }}
        />
        {(ispostText || isMedia) && (
          <Card.Body
            caption={ispostText ? <PostCaption postText={item.postText} /> : ''}
          >
            <>
              {!isSeller ? (
                <>
                  {checksForImages ? (
                    <PostWrapper
                      thumbheight={thumbheight}
                      thumbMaxheight={thumbMaxheight}
                      thumbMinheight={thumbMinheight}
                      // containerHeight={containerHeight}
                    >
                      <PostBannerImages
                        className="post-bannerimages"
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
                  ) : null}
                </>
              ) : isMedia ? (
                <PostWrapper
                  thumbheight={thumbheight}
                  thumbMaxheight={thumbMaxheight}
                  thumbMinheight={thumbMinheight}
                  // containerHeight={containerHeight}
                >
                  <PostBannerImages
                    // onImageLoad={calulateHeight}
                    className="post-bannerimages"
                    key={item._id}
                    media={item.media?.map((med: any) => ({
                      ...med,
                      imageURL: `${med?.imageURL}?${
                        med?.updatedAt ?? postItem?.updatedAt
                      }`,
                      url: `${med?.url}?${
                        med?.updatedAt ?? postItem?.updatedAt
                      }`,
                      path: `${med?.path}?${
                        med?.updatedAt ?? postItem?.updatedAt
                      }`,
                    }))}
                  />
                </PostWrapper>
              ) : null}
            </>
          </Card.Body>
        )}
        {allowFooter ? (
          <>
            <Card.Footer>
              <CardPublicFooter
                postUser={item?.userId}
                user={subBuyer ? subBuyer : sellerUser}
                postliked={item.liked}
                postLikes={item.postLikes}
                onChangeLike={onTogglePostLike}
                id={item?._id}
                tipHandler={onTip}
                post={item}
                comments={item?.comments}
                isSeller={isSeller}
                onAddComment={onAddComemnt}
                getPostComments={onCommentspagination}
              />
            </Card.Footer>

            <CardListComments
              toggleCommentLike={onToggleCommentLike}
              getPostComments={onCommentspagination}
              item={item}
              managedUser={managedUser}
              user={subBuyer ? subBuyer : sellerUser}
              onAddReplyToComment={onAddReplyToComment}
              onPostCommentRepliesPagination={onPostCommentRepliesPagination}
              onToggleCommentReplyLike={onToggleCommentReplyLike}
            />
          </>
        ) : null}
      </Card>
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

const ActionsDropDown = ({
  item,
  setIsVisible,
  onDeleteItem,
  onEditItem,
  onPinItem,
  allowActions,
}: {
  item: IPost;
  setIsVisible: any;
  onDeleteItem?: (item: IPost) => void | Promise<any>;
  onEditItem?: (item: IPost) => void | Promise<any>;
  onPinItem?: (item: IPost) => void | Promise<any>;
  allowActions?: boolean;
}) => {
  const pinKeys = useAppSelector((state) => state.memberPost.pinPosts);
  const pinKeyArray = Object.keys(pinKeys || {});
  return allowActions ? (
    <ul className="actions">
      <li>
        <Button
          type="text"
          onClick={() => {
            // e.preventDefault();
            // e.stopPropagation();
            onDeleteItem?.(item);

            setIsVisible?.(false);
          }}
        >
          Delete post
        </Button>
      </li>
      <li>
        <Button
          type="text"
          onClick={() => {
            // e.preventDefault();
            // e.stopPropagation();
            onEditItem?.(item);

            setIsVisible?.(false);
          }}
        >
          Edit
        </Button>
      </li>
      <li>
        <Button
          type="text"
          disabled={
            pinKeyArray.length >= 3 && !pinKeys?.[item?._id as string]
              ? true
              : false
          }
          onClick={() => {
            // e.preventDefault();
            // e.stopPropagation();
            onPinItem?.(item);
            setIsVisible?.(false);
          }}
        >
          {!!pinKeys?.[item?._id as string] ? 'UnPin Post' : 'Pin Post'}
        </Button>
      </li>
    </ul>
  ) : null;
};
export default styled(Post)`
  .time_stamp {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
  }
`;
